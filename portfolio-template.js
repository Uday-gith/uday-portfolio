const CONFIG = window.PORTFOLIO_CONFIG || {};
const params = new URLSearchParams(location.search);
const category = document.body.dataset.category;
const grid = document.getElementById('portfolio-grid');
const statusEl = document.getElementById('portfolio-status');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
const driveThumb = (id, size=1600) => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${size}`;
const drivePreview = id => `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
const title = n => n.replace(/\.[^/.]+$/, '').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();

async function listFolder(folderId) {
  const q = `'${folderId}' in parents and trashed = false`;
  const params = new URLSearchParams({key: CONFIG.googleDriveApiKey,q,fields:'files(id,name,mimeType,webViewLink,thumbnailLink,modifiedTime,size,description)',orderBy:'modifiedTime desc',pageSize:'100'});
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!response.ok) throw new Error(`Drive API ${response.status}`);
  const data = await response.json();
  return (data.files || []).filter(f => !f.mimeType.includes('folder')).filter(f => !CONFIG.showFileTypes?.length || CONFIG.showFileTypes.includes(f.mimeType));
}
function configured() { return CONFIG.googleDriveApiKey && !CONFIG.googleDriveApiKey.includes('PASTE_') && CONFIG.folders?.[category] && !CONFIG.folders[category].includes('PASTE_'); }
function card(p,i) {
  const video=p.mimeType.startsWith('video/'); const thumb=p.thumbnailLink ? p.thumbnailLink.replace(/=s\d+$/, '=s1600') : driveThumb(p.id);
  return `<article class="portfolio-card tilt-card" data-index="${i}" tabindex="0"><div class="media-wrap"><img loading="lazy" src="${thumb}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none';this.parentElement.classList.add('no-image')">${video?'<span class="play">▶</span>':''}<span class="card-category">${category==='video'?'VIDEO EDITING':category==='graphics'?'GRAPHICS & BRANDING':'PERFORMANCE MARKETING'}</span></div><div class="card-info"><h3>${escapeHtml(title(p.name))}</h3><span>${new Date(p.modifiedTime).toLocaleDateString(undefined,{month:'short',year:'numeric'})} ↗</span></div></article>`;
}
function openProject(p) { const video=p.mimeType.startsWith('video/'); modalContent.innerHTML=`<div class="modal-media">${video?`<iframe src="${drivePreview(p.id)}" allow="autoplay; fullscreen" allowfullscreen title="${escapeHtml(p.name)}"></iframe>`:`<img src="${driveThumb(p.id,2200)}" alt="${escapeHtml(p.name)}">`}</div><div class="modal-details"><span class="eyebrow">${category==='video'?'VIDEO EDITING':category==='graphics'?'GRAPHICS & BRANDING':'PERFORMANCE MARKETING'}</span><h2>${escapeHtml(title(p.name))}</h2>${p.description?`<p>${escapeHtml(p.description)}</p>`:''}<a href="${p.webViewLink||'#'}" target="_blank" rel="noopener">Open original file ↗</a></div>`; modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');}
async function load(){ if(!configured()){statusEl.innerHTML='Connect this category folder in <code>config.js</code> to load your work.';return;} try{const items=await listFolder(CONFIG.folders[category]);statusEl.textContent=items.length?`${items.length} projects`:'No work found in this folder yet.';grid.innerHTML=items.map(card).join('');grid.querySelectorAll('.portfolio-card').forEach((el,i)=>{el.addEventListener('click',()=>openProject(items[i]));el.addEventListener('keydown',e=>{if(e.key==='Enter')openProject(items[i])})});initTilts();}catch(e){console.error(e);statusEl.textContent='Could not load this portfolio. Check the Drive API key, folder ID and sharing settings.';}}
function initTilts(){document.querySelectorAll('.tilt-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--rx',`${-y*5}deg`);el.style.setProperty('--ry',`${x*7}deg`)});el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')})})}
document.querySelector('.modal-close').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modalContent.innerHTML='';document.body.classList.remove('modal-open')});
modal.addEventListener('click',e=>{if(e.target===modal)document.querySelector('.modal-close').click()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))document.querySelector('.modal-close').click()});
document.getElementById('year').textContent=new Date().getFullYear(); load();
