import {demoMatches, competitions} from "./data.js";
import {getFavorites, toggleFavorite} from "./storage.js";

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const matchList=$("#matchList"), sidebar=$("#sidebar"), scrim=$("#scrim");
let currentPage="inicio", currentFilter="todos", searchTerm="";

function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400)}
function openMenu(){sidebar.classList.add("open");scrim.classList.add("show");$("#menuButton").setAttribute("aria-expanded","true")}
function closeMenu(){sidebar.classList.remove("open");scrim.classList.remove("show");$("#menuButton").setAttribute("aria-expanded","false")}
function setPage(page){
 currentPage=page;closeMenu();
 $$(".nav-link[data-page],.bottom-link[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 renderPage();
 window.scrollTo({top:0,behavior:"smooth"});
}
function matchCard(m){
 const fav=getFavorites().includes(m.id);
 const state=m.status==="live"?"live":m.status==="finished"?"finished":"upcoming";
 const label=state==="live"?"AO VIVO":state==="finished"?"TERMINADO":"PRÓXIMO";
 const score=state==="upcoming"?m.kickoff:`${m.homeScore ?? 0} : ${m.awayScore ?? 0}`;
 return `<article class="match-card">
  <div class="match-meta"><span>${escapeHtml(m.competition)}</span><span class="status ${state}">${state==="live"?'<i class="live-dot"></i>':""}${label}</span></div>
  <div class="teams">
   <div class="team"><div class="team-crest">${m.homeIcon||"⚽"}</div><div class="team-name">${escapeHtml(m.home)}</div></div>
   <div class="score">${score}</div>
   <div class="team"><div class="team-crest">${m.awayIcon||"⚽"}</div><div class="team-name">${escapeHtml(m.away)}</div></div>
  </div>
  <div class="match-foot"><span>${escapeHtml(m.minute||m.kickoff||"")}</span><button class="favorite-btn ${fav?"saved":""}" data-favorite="${escapeHtml(m.id)}" aria-label="Adicionar aos favoritos">${fav?"♥":"♡"}</button></div>
 </article>`;
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderMatches(list){
 const filtered=list.filter(m=>{
  const filterOk=currentFilter==="todos" || m.status===currentFilter;
  const q=searchTerm.toLowerCase();
  const searchOk=!q||[m.home,m.away,m.competition].some(v=>String(v).toLowerCase().includes(q));
  return filterOk&&searchOk;
 });
 matchList.innerHTML=filtered.length?filtered.map(matchCard).join(""):`<div class="empty-state">Não foram encontrados jogos nesta secção.</div>`;
}
function heading(title,desc){return `<h1 class="page-title">${title}</h1><p class="page-description">${desc}</p>`}
function renderPage(){
 const content=$("#pageContent");
 const hero=$(".hero");
 hero.hidden=currentPage!=="inicio";
 const introNotice=`<div class="notice"><span>ⓘ</span><p>Esta versão usa jogos demonstrativos. Os dados reais exigem ligação a uma API. As transmissões serão apresentadas apenas quando forem oficiais e autorizadas.</p></div>`;
 if(currentPage==="inicio"){
  content.innerHTML=`<div class="section-heading"><div><span class="eyebrow">ACOMPANHA AGORA</span><h2>Em destaque</h2></div><button class="text-btn" data-go="jogos">Ver todos →</button></div>${introNotice}<div class="filter-row" id="quickFilters"><button class="chip selected" data-filter="todos">Todos</button><button class="chip" data-filter="live">Ao vivo</button><button class="chip" data-filter="upcoming">Próximos</button><button class="chip" data-filter="finished">Terminados</button></div><div class="match-list" id="matchList"></div>`;
 } else if(["ao-vivo","jogos","favoritos"].includes(currentPage)){
  const titles={"ao-vivo":["Jogos ao vivo","Acompanha os encontros que estão a decorrer."],"jogos":["Todos os jogos","Consulta partidas, horários e resultados."],"favoritos":["Os teus favoritos","Jogos que guardaste para acompanhar."]};
  const [t,d]=titles[currentPage];
  content.innerHTML=`${heading(t,d)}${introNotice}<div class="match-list" id="matchList"></div>`;
 } else if(currentPage==="competicoes"){
  content.innerHTML=`${heading("Competições","Explora campeonatos e torneios de diferentes países.")}${introNotice}<div class="competition-grid">${competitions.map(([n,c])=>`<div class="competition">🏆 ${escapeHtml(n)}<small>${escapeHtml(c)}</small></div>`).join("")}</div>`;
 } else if(currentPage==="canais"){
  content.innerHTML=`${heading("Canais oficiais","Acede às páginas oficiais de emissoras e competições. A disponibilidade dos jogos depende do país e dos direitos de transmissão.")}<div class="channel-card"><h3>FIFA+</h3><p>Plataforma oficial da FIFA. A oferta de jogos e conteúdos varia por região.</p><a href="https://www.plus.fifa.com/" target="_blank" rel="noopener noreferrer">Visitar FIFA+ ↗</a></div><div class="channel-card"><h3>UEFA.tv</h3><p>Conteúdos oficiais da UEFA. Nem todos os jogos em direto estão disponíveis.</p><a href="https://www.uefa.tv/" target="_blank" rel="noopener noreferrer">Visitar UEFA.tv ↗</a></div><div class="channel-card"><h3>CAF TV</h3><p>Conteúdos e vídeos oficiais da Confederação Africana de Futebol.</p><a href="https://www.youtube.com/@CAF_TV" target="_blank" rel="noopener noreferrer">Visitar CAF TV ↗</a></div>`;
 } else {
  content.innerHTML=`${heading("Sobre o MEDBI Football Live","Uma plataforma para acompanhar o futebol mundial.")}<div class="channel-card"><h3>O nosso compromisso</h3><p>O MEDBI Football Live organiza informação futebolística e encaminha os utilizadores para fontes oficiais de transmissão. Não aloja nem retransmite sinais televisivos sem autorização.</p><p>Versão inicial de desenvolvimento. Os resultados de demonstração não são dados reais.</p></div>`;
 }
 const list=$("#matchList");
 if(list){
  let matches=demoMatches;
  if(currentPage==="ao-vivo") matches=matches.filter(m=>m.status==="live");
  if(currentPage==="favoritos") matches=matches.filter(m=>getFavorites().includes(m.id));
  if(currentPage==="jogos") matches=demoMatches;
  renderMatches(matches);
 }
}
document.addEventListener("click",e=>{
 const pageBtn=e.target.closest("[data-page]"); if(pageBtn){setPage(pageBtn.dataset.page);return}
 const go=e.target.closest("[data-go]");if(go){setPage(go.dataset.go);return}
 const filter=e.target.closest("[data-filter]");if(filter){currentFilter=filter.dataset.filter;$$(".chip").forEach(b=>b.classList.toggle("selected",b===filter));renderPage();return}
 const fav=e.target.closest("[data-favorite]");if(fav){toggleFavorite(fav.dataset.favorite);renderPage();toast("Lista de favoritos atualizada.");}
});
$("#menuButton").addEventListener("click",openMenu);
$("#closeMenu").addEventListener("click",closeMenu);
scrim.addEventListener("click",closeMenu);
$("#searchToggle").addEventListener("click",()=>{$("#searchPanel").hidden=!$("#searchPanel").hidden;if(!$("#searchPanel").hidden)$("#searchInput").focus()});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderPage()});
$("#clearSearch").addEventListener("click",()=>{$("#searchInput").value="";searchTerm="";renderPage()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
renderPage();
