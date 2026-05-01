// NATURE
const nc=document.getElementById('nc');
const svgs=['<svg width="22" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 2C11 2 2 8 2 16C2 21.5 6 26 11 26C16 26 20 21.5 20 16C20 8 11 2 11 2Z" fill="rgba(74,112,80,.32)" stroke="rgba(74,112,80,.45)" stroke-width=".5"/><line x1="11" y1="26" x2="11" y2="2" stroke="rgba(74,112,80,.35)" stroke-width=".7"/></svg>','<svg width="18" height="22" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="9" cy="11" rx="8" ry="10" transform="rotate(-15 9 11)" fill="rgba(106,152,112,.28)" stroke="rgba(74,112,80,.4)" stroke-width=".5"/></svg>'];
for(let i=0;i<18;i++){const l=document.createElement('div');l.className='leaf';l.innerHTML=svgs[i%2];const s=Math.random()*.7+.5;l.style.cssText=`left:${Math.random()*105}%;width:${22*s}px;height:${28*s}px;animation-duration:${Math.random()*18+12}s;animation-delay:-${Math.random()*20}s;`;nc.appendChild(l);}
for(let i=0;i<20;i++){const f=document.createElement('div');f.className='ff';const dx=(Math.random()-.5)*150,dy=(Math.random()-.5)*150;f.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;--dx:${dx}px;--dy:${dy}px;animation-duration:${Math.random()*6+4}s;animation-delay:-${Math.random()*8}s;width:${Math.random()*3+2}px;height:${Math.random()*3+2}px;`;nc.appendChild(f);}

// REVEAL
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*.06+'s';obs.observe(el);});
document.querySelectorAll('.card').forEach((el,i)=>{el.style.transitionDelay=(i%3)*.07+'s';el.classList.add('reveal');obs.observe(el);});

// TABS
function switchTab(btn,body){body.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));body.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));btn.classList.add('active');const idx=Array.from(body.querySelectorAll('.tab-btn')).indexOf(btn);body.querySelectorAll('.tab-pane')[idx].classList.add('active');}

// INGREDIENTS
function toggleIng(btn){btn.querySelector('.ingarr').classList.toggle('open');btn.nextElementSibling.classList.toggle('open');}

// PHOTO
function pickPhoto(btn){btn.closest('.cphoto').querySelector('.cfile').click();}
function loadPhoto(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const ph=inp.closest('.cphoto');const img=ph.querySelector('img');const ph2=ph.querySelector('.cph');img.src=e.target.result;img.classList.add('loaded');if(ph2)ph2.style.display='none';showToast('📷 Foto adicionada!');};r.readAsDataURL(f);}

// CART
let cart={},prevOpen=false;
function updateQty(btn,d){const w=btn.closest('.qty-wrap');const n=w.querySelector('.qty-num');n.textContent=Math.max(1,parseInt(n.textContent)+d);}
function addToCart(btn){const c=btn.closest('.card');const id=c.dataset.id,name=c.dataset.name,icon=c.dataset.icon;const qty=parseInt(c.querySelector('.qty-num').textContent);cart[id]?(cart[id].qty+=qty):(cart[id]={id,name,icon,qty});renderCart();updatePrev();showToast('✦ '+name+' adicionado!');btn.classList.add('added');btn.querySelector('span').textContent='✓ Adicionado';setTimeout(()=>{btn.classList.remove('added');btn.querySelector('span').textContent='+ Adicionar';},2000);}
function removeFromCart(id){delete cart[id];renderCart();updatePrev();}
function renderCart(){const items=Object.values(cart);const count=items.reduce((s,i)=>s+i.qty,0);const cc=document.getElementById('cc');cc.textContent=count;count>0?cc.classList.add('show'):cc.classList.remove('show');const wrap=document.getElementById('citems');if(!items.length){wrap.innerHTML='<div class="cdempty"><span class="ico">🌿</span>Seu carrinho está vazio.<br>Escolha seus sabonetes.</div>';return;}wrap.innerHTML=items.map(i=>`<div class="cditem"><span class="cditem-ico">${i.icon}</span><div class="cditem-info"><div class="cditem-name">${i.name}</div><div class="cditem-qty">Qtd: ${i.qty} unidade${i.qty>1?'s':''}</div></div><button class="cditem-rm" onclick="removeFromCart('${i.id}')">✕</button></div>`).join('');}
function buildMsg(){const items=Object.values(cart);const name=document.getElementById('cname').value.trim();const lines=items.map(i=>`  • ${i.name} (${i.qty}x)`).join('\n');const ns=name?`\nNome: ${name}`:'';return`Olá! Acabei de finalizar meu pedido, tem algo a pronta entrega ou consegue por encomenda? 🤍🌼\n\nPedido:\n${lines}${ns}`;}
function updatePrev(){const t=document.getElementById('mptxt');if(t)t.textContent=buildMsg();}
function togglePrev(){prevOpen=!prevOpen;document.getElementById('mprev').classList.toggle('show',prevOpen);document.getElementById('prevlbl').textContent=prevOpen?'Ocultar mensagem':'Ver mensagem antes de enviar';if(prevOpen)updatePrev();}
function sendIG(){const items=Object.values(cart);if(!items.length){showToast('Adicione sabonetes primeiro!');return;}const msg=buildMsg();if(navigator.clipboard)navigator.clipboard.writeText(msg).catch(()=>{});const igl='instagram://user?username=juremisaboaria';const igw='https://ig.me/m/juremisaboaria';const iframe=document.createElement('iframe');iframe.style.display='none';document.body.appendChild(iframe);iframe.src=igl;const t=setTimeout(()=>{try{document.body.removeChild(iframe);}catch(e){}window.open(igw,'_blank');},1500);document.addEventListener('visibilitychange',function h(){if(document.hidden){clearTimeout(t);try{document.body.removeChild(iframe);}catch(e){}document.removeEventListener('visibilitychange',h);}});showToast('📋 Mensagem copiada! Abrindo Instagram...');}
function openCart(){document.getElementById('cov').classList.add('open');document.getElementById('cdrawer').classList.add('open');}
function closeCart(){document.getElementById('cov').classList.remove('open');document.getElementById('cdrawer').classList.remove('open');}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3200);}