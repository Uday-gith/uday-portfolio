const CONFIG=window.PORTFOLIO_CONFIG||{};
const grid=document.getElementById('home-grid');
const statusEl=document.getElementById('home-status');
const escapeHtml=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
const driveThumb=id=>`https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1400`;
const label=k=>k==='video'?'Video Editing':k==='graphics'?'Graphics & Branding':'Performance Marketing';
function render(items){
  if(!items.length){statusEl.textContent='Add work to your Drive folders to see it here.';return}
  statusEl.textContent=`Showing ${Math.min(items.length,9)} recent projects`;
  grid.innerHTML=items.slice(0,9).map(p=>{
    const v=p.mimeType?.startsWith('video/');
    const t=p.thumbnailLink?p.thumbnailLink.replace(/=s\d+$/,'=s1400'):driveThumb(p.id);
    const page=p.category==='video'?'video.html':p.category==='graphics'?'graphics.html':'performance.html';
    return `<a class="preview-card tilt-card" href="${page}"><div class="media-wrap"><img loading="lazy" src="${t}" alt="${escapeHtml(p.title||p.name)}">${v?'<span class="play">▶</span>':''}<span class="card-category">${label(p.category)}</span></div><div class="card-info"><h3>${escapeHtml(p.title||p.name||'Project')}</h3><span>${escapeHtml(p.section||'Work')} ↗</span></div></a>`
  }).join('');
  initTilts();
}
function initTilts(){document.querySelectorAll('.tilt-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--rx',`${-y*4}deg`);el.style.setProperty('--ry',`${x*6}deg`)});el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')})})}
function rocketScene(){
  if(!window.THREE)return;
  const host=document.getElementById('rocket-canvas'); if(!host)return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.1,100); camera.position.set(0,0,13);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.4)); renderer.setSize(innerWidth,innerHeight); host.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff,.7));
  const key=new THREE.DirectionalLight(0xd9ffcc,1.5); key.position.set(4,5,7); scene.add(key);
  const rocket=new THREE.Group(); scene.add(rocket);
  const bodyMat=new THREE.MeshStandardMaterial({color:0xdfe5e7,roughness:.3,metalness:.25,transparent:true,opacity:.36});
  const darkMat=new THREE.MeshStandardMaterial({color:0x273039,roughness:.35,metalness:.4,transparent:true,opacity:.42});
  const accentMat=new THREE.MeshStandardMaterial({color:0xd9ff4f,roughness:.25,metalness:.15,transparent:true,opacity:.55});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.72,.9,3.4,32),bodyMat); body.rotation.z=-Math.PI/2; rocket.add(body);
  const nose=new THREE.Mesh(new THREE.ConeGeometry(.72,1.45,32),bodyMat); nose.rotation.z=-Math.PI/2; nose.position.x=2.42; rocket.add(nose);
  const windowMat=new THREE.MeshStandardMaterial({color:0x5b7cff,roughness:.12,metalness:.25,transparent:true,opacity:.5});
  const window=new THREE.Mesh(new THREE.SphereGeometry(.3,24,16),windowMat); window.position.set(1.2,.48,.65); window.scale.set(1,.72,.35); rocket.add(window);
  for(const z of [-.58,.58]){const fin=new THREE.Mesh(new THREE.ConeGeometry(.52,1.25,4),darkMat);fin.rotation.z=Math.PI/2;fin.rotation.x=z>0?.25:-.25;fin.position.set(-.75,z*.9,0);rocket.add(fin)}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.76,.08,12,32),accentMat);ring.rotation.y=Math.PI/2;ring.position.x=-.8;rocket.add(ring);
  const flameMat=new THREE.MeshBasicMaterial({color:0xffb84d,transparent:true,opacity:.48});
  const flame=new THREE.Mesh(new THREE.ConeGeometry(.42,1.5,24),flameMat); flame.rotation.z=Math.PI/2; flame.position.x=-2.25; rocket.add(flame);
  const glow=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),new THREE.MeshBasicMaterial({color:0xffe5a3,transparent:true,opacity:.3}));glow.position.x=-2.45;rocket.add(glow);
  rocket.position.set(3,-1,0); rocket.rotation.set(.12,.25,-.18);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches; let start=performance.now();
  function animate(t){const s=(t-start)/1000;if(!reduce){rocket.position.x=3+1.2*Math.sin(s*.16);rocket.position.y=-.8+.9*Math.sin(s*.32);rocket.rotation.y=.2+.12*Math.sin(s*.25);rocket.rotation.z=-.12+.08*Math.sin(s*.37);flame.scale.y=.9+.18*Math.sin(s*8);glow.scale.setScalar(.9+.25*Math.sin(s*7))}renderer.render(scene,camera);requestAnimationFrame(animate)}requestAnimationFrame(animate);
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.4))},{passive:true});
}
function parseCsv(text){const rows=[];let row=[],cell='',quote=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'){if(quote&&n==='"'){cell+='"';i++;}else quote=!quote;}else if(c===','&&!quote){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}if(cell||row.length){row.push(cell);rows.push(row)}const head=(rows.shift()||[]).map(x=>x.trim().toLowerCase());return rows.map(r=>Object.fromEntries(head.map((h,i)=>[h,(r[i]||'').trim()])))}
async function loadTestimonials(){const track=document.getElementById('testimonial-track'),status=document.getElementById('testimonial-status'),add=document.getElementById('testimonial-add');if(CONFIG.testimonialFormUrl&&!CONFIG.testimonialFormUrl.includes('PASTE_')){add.href=CONFIG.testimonialFormUrl}else{add.style.display='none'}if(!CONFIG.testimonialsCsvUrl||CONFIG.testimonialsCsvUrl.includes('PASTE_'))return;try{const r=await fetch(CONFIG.testimonialsCsvUrl,{cache:'no-store'});if(!r.ok)throw new Error(r.status);const rows=parseCsv(await r.text()).filter(x=>(x.name||x.Name||x['your name'])&&(x.testimonial||x.message||x.review||x['your review']));if(!rows.length)return;const cards=rows.map(x=>{const name=x.name||x.Name||x['your name'];const role=x.role||x.Role||x.company||'';const quote=x.testimonial||x.message||x.review||x['your review'];return `<article class="testimonial-card"><p>“${escapeHtml(quote)}”</p><div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(role)}</span></div></article>`}).join('');track.innerHTML=`<div class="testimonial-loop">${cards}${cards}</div>`;status.textContent=`${rows.length} testimonial${rows.length===1?'':'s'}`;}catch(e){console.warn('Testimonials:',e)}}
async function load(){rocketScene();try{const r=await fetch('portfolio.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error(r.status);const data=await r.json();render(data.latest||[]);}catch(e){console.error(e);statusEl.textContent='Portfolio sync is being prepared. Add work to Drive and run the GitHub sync workflow.'}loadTestimonials();document.getElementById('year').textContent=new Date().getFullYear()}
load();
