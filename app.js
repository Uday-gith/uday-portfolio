const CONFIG=window.PORTFOLIO_CONFIG||{};
const grid=document.getElementById('home-grid'),statusEl=document.getElementById('home-status');
const escapeHtml=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
const driveThumb=item=>item?.thumbnailLink||`https://drive.google.com/thumbnail?id=${encodeURIComponent(item?.id||'')}&sz=w1600`;
const label=k=>k==='video'?'Video Editing':k==='graphics'?'Graphics & Branding':'Performance Marketing';
function renderServiceThumbs(data){
 const categories=['video','graphics','performance'];
 categories.forEach(key=>{
  const host=document.querySelector(`[data-service-thumb="${key}"]`);
  if(!host)return;
  const cat=(data.categories||[]).find(x=>x.key===key);
  const items=(cat?.sections||[]).flatMap(s=>s.items||[]).sort((a,b)=>new Date(b.modifiedTime)-new Date(a.modifiedTime));
  const item=items[0];
  if(!item)return;
  host.src=driveThumb(item);
  host.alt=item.title||item.name||`${label(key)} work`;
  host.onerror=()=>{host.classList.add('broken');};
 });
}
function render(items){
 if(!items.length){statusEl.textContent='Add work to your Drive folders to see it here.';return}
 statusEl.textContent=`Showing ${Math.min(items.length,9)} recent projects`;
 grid.innerHTML=items.slice(0,9).map(p=>{const v=p.mimeType?.startsWith('video/');const t=driveThumb(p);const page=p.category==='video'?'video.html':p.category==='graphics'?'graphics.html':'performance.html';
 return `<a class="preview-card tilt-card" href="${page}"><div class="media-wrap"><img loading="lazy" decoding="async" src="${t}" alt="${escapeHtml(p.title||p.name)}" onerror="this.classList.add('broken');this.parentElement.classList.add('no-image')">${v?'<span class="play">▶</span>':''}<span class="card-category">${label(p.category)}</span></div><div class="card-info"><h3>${escapeHtml(p.title||p.name||'Project')}</h3><span>${escapeHtml(p.section||'Work')} ↗</span></div></a>`}).join('');
 initTilts();
}
function initTilts(){document.querySelectorAll('.tilt-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--rx',`${-y*4}deg`);el.style.setProperty('--ry',`${x*6}deg`)});el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')})})}
function parseCsv(text){const rows=[];let row=[],cell='',quote=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'){if(quote&&n==='"'){cell+='"';i++}else quote=!quote}else if(c===','&&!quote){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}else cell+=c}if(cell||row.length){row.push(cell);rows.push(row)}const head=(rows.shift()||[]).map(x=>x.trim().toLowerCase());return rows.map(r=>Object.fromEntries(head.map((h,i)=>[h,(r[i]||'').trim()])))}
async function loadTestimonials(){
 const track=document.getElementById('testimonial-track'),add=document.getElementById('testimonial-add');
 if(!track)return;
 if(CONFIG.testimonialFormUrl&&!CONFIG.testimonialFormUrl.includes('PASTE_')) add.href=CONFIG.testimonialFormUrl;
 if(!CONFIG.testimonialsCsvUrl||CONFIG.testimonialsCsvUrl.includes('PASTE_'))return;
 try{
  const r=await fetch(CONFIG.testimonialsCsvUrl,{cache:'no-store'});
  if(!r.ok)throw new Error(r.status);
  const rows=parseCsv(await r.text()).filter(x=>(x.name||x['your name'])&&(x.testimonial||x.message||x.review||x['your review']));
  if(!rows.length)return;
  const cards=rows.map(x=>{
   const name=x.name||x['your name'],role=x.role||x.company||'',quote=x.testimonial||x.message||x.review||x['your review'];
   return `<article class="testimonial-card"><p>“${escapeHtml(quote)}”</p><div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(role)}</span></div></article>`;
  }).join('');
  track.innerHTML=`<div class="testimonial-loop">${cards}${cards}</div>`;
 }catch(e){console.warn('Testimonials:',e)}
}
async function load(){
 const start=performance.now();
 try{const r=await fetch('portfolio.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error(r.status);const data=await r.json();renderServiceThumbs(data);render(data.latest||[])}catch(e){console.error(e);statusEl.textContent='Portfolio sync is being prepared. Run the GitHub sync workflow after adding work to Drive.'}
 loadTestimonials();document.getElementById('year').textContent=new Date().getFullYear();document.documentElement.dataset.loaded=Math.round(performance.now()-start)
}
load();