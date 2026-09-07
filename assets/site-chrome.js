/* ==========================================================================
   지아 공용 사이트 크롬 JS — GNB · 전체메뉴 · 모바일 사이드바 · TOP 버튼
   전 페이지 공용. lucide.createIcons() 이후에 로드하세요.
   ========================================================================== */
(function(){
/* ===== 헤더 (유라인 GNB) ===== */
var nav=document.getElementById('nav'),
    moHeader=document.getElementById('moHeader'),
    topBtn=document.getElementById('topBtn'),
    dropdown=document.getElementById('dropdownMenu'),
    gnbMenu=document.getElementById('gnbMenu'),
    menuButton=document.getElementById('menuButton'),
    hasHero=!!document.querySelector('.mainVisual, .hero');

function syncHeader(){
  var y=window.scrollY, top=hasHero && y<40 && !(dropdown && dropdown.classList.contains('on'));
  if(nav) nav.classList.toggle('on', top);
  if(moHeader) moHeader.classList.toggle('on', hasHero && y<40);
  if(topBtn) topBtn.classList.toggle('is-show', y>400);
}
window.addEventListener('scroll', syncHeader);
syncHeader();
if(topBtn) topBtn.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};

/* 전체메뉴 열기/닫기 — 열리면 GNB 메뉴는 페이드아웃 */
function closeDropdown(){
  if(!dropdown) return;
  dropdown.classList.remove('on');
  if(gnbMenu) gnbMenu.classList.remove('off');
  syncHeader();
}
if(menuButton && dropdown) menuButton.onclick=function(){
  var open=!dropdown.classList.contains('on');
  dropdown.classList.toggle('on', open);
  if(gnbMenu) gnbMenu.classList.toggle('off', open);
  if(open){ if(nav) nav.classList.remove('on'); } else syncHeader();
};
var headerEl=document.getElementById('header');
if(headerEl) headerEl.addEventListener('mouseleave', closeDropdown);
document.addEventListener('keydown',function(e){if(e.key==='Escape') closeDropdown()});

/* 모바일 사이드바 */
var sideBar=document.getElementById('sideBar'), sideDim=document.getElementById('sideDim');
function sideToggle(on){
  if(sideBar) sideBar.classList.toggle('active', on);
  if(sideDim) sideDim.classList.toggle('active', on);
  document.body.style.overflow = on ? 'hidden' : '';
}
var moOpen=document.getElementById('moOpen'), moClose=document.getElementById('moClose');
if(moOpen) moOpen.onclick=function(){sideToggle(true)};
if(moClose) moClose.onclick=function(){sideToggle(false)};
if(sideDim) sideDim.onclick=function(){sideToggle(false)};
document.querySelectorAll('#mo_nav ul.menu > li > button').forEach(function(b){
  b.onclick=function(){b.parentElement.classList.toggle('active')};
});
})();
