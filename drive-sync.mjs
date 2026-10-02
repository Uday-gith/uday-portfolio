import fs from 'fs';

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const ROOTS = {
  video: process.env.VIDEO_FOLDER_ID,
  graphics: process.env.GRAPHICS_FOLDER_ID,
  performance: process.env.PERFORMANCE_FOLDER_ID,
};

if (!API_KEY) throw new Error('Missing GOOGLE_DRIVE_API_KEY');
for (const [k,v] of Object.entries(ROOTS)) if (!v) throw new Error(`Missing ${k.toUpperCase()}_FOLDER_ID`);

const TYPES = new Set([
  'image/jpeg','image/png','image/webp','image/gif','image/avif',
  'video/mp4','video/webm','video/quicktime'
]);

function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function cleanName(n){return n.replace(/\.[^/.]+$/,'').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();}
async function drive(url){
  const r=await fetch(url);
  if(!r.ok) throw new Error(`Drive API ${r.status}: ${await r.text()}`);
  return r.json();
}
async function children(folderId){
  const q=encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields=encodeURIComponent('nextPageToken,files(id,name,mimeType,webViewLink,thumbnailLink,modifiedTime,size,description)');
  const out=[]; let token='';
  do{
    const page=token?`&pageToken=${encodeURIComponent(token)}`:'';
    const url=`https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=100&key=${encodeURIComponent(API_KEY)}${page}`;
    const d=await drive(url); out.push(...(d.files||[])); token=d.nextPageToken||'';
  }while(token);
  return out;
}
async function buildCategory(key,rootId){
  const top=await children(rootId);
  const subfolders=top.filter(x=>x.mimeType==='application/vnd.google-apps.folder');
  const direct=top.filter(x=>x.mimeType!=='application/vnd.google-apps.folder' && TYPES.has(x.mimeType));
  const sections=[];
  for(const folder of subfolders){
    const files=(await children(folder.id)).filter(x=>x.mimeType!=='application/vnd.google-apps.folder' && TYPES.has(x.mimeType));
    sections.push({id:folder.id,title:folder.name,items:files.map(file=>({...file,title:cleanName(file.name),category:key,section:folder.name}))});
  }
  if(direct.length) sections.push({id:`${rootId}-uncategorized`,title:'More Work',items:direct.map(file=>({...file,title:cleanName(file.name),category:key,section:'More Work'}))});
  sections.sort((a,b)=>a.title.localeCompare(b.title));
  return {key,sections};
}

const categories=[];
for(const [key,id] of Object.entries(ROOTS)) categories.push(await buildCategory(key,id));
const latest=categories.flatMap(c=>c.sections.flatMap(s=>s.items)).sort((a,b)=>new Date(b.modifiedTime)-new Date(a.modifiedTime)).slice(0,18);
fs.writeFileSync('portfolio.json',JSON.stringify({generatedAt:new Date().toISOString(),categories,latest},null,2));
console.log(`Generated portfolio.json with ${latest.length} latest items.`);
