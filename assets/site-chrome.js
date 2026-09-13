/* ==========================================================================
   지아 공용 사이트 크롬 JS — GNB · 전체메뉴 · 모바일 사이드바 · TOP 버튼
   전 페이지 공용. lucide.createIcons() 이후에 로드하세요.
   ========================================================================== */
(function(){
/* ===== 헤더 (유라인 GNB) ===== */
var nav=document.getElementById('nav'),
    moHeader=document.getElementById('moHeader'),
    moQuick=document.getElementById('moQuick'),
    topBtn=document.getElementById('topBtn'),
    dropdown=document.getElementById('dropdownMenu'),
    gnbMenu=document.getElementById('gnbMenu'),
    menuButton=document.getElementById('menuButton'),
    /* 히어로가 헤더를 덮는 페이지, 또는 밝은 배경 페이지(gnb-light)는 최상단에서 투명 헤더 */
    hasHero=!!document.querySelector('.mainVisual, .hero, .subhero_section') ||
            document.body.classList.contains('gnb-light');

function syncHeader(){
  var y=window.scrollY, top=hasHero && y<40 && !(dropdown && dropdown.classList.contains('on'));
  if(nav) nav.classList.toggle('on', top);
  if(moHeader) moHeader.classList.toggle('on', hasHero && y<40);
  /* 모바일: 스크롤을 내리면 2행 메뉴를 보여준다 */
  if(moQuick) moQuick.classList.toggle('is-show', y>=40);
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

/* ==========================================================================
   스크롤 등장 애니메이션 + 히어로 숫자 카운팅
   ========================================================================== */
(function(){
  if(!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 숫자 카운팅 (서브 히어로 지표) ---- */
  var stats=document.querySelectorAll('.subhero_section .stats .v');
  var countIO=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      countIO.unobserve(e.target);
      runCount(e.target);
    });
  },{threshold:.4});
  function fmt(n, dec){ return dec ? n.toFixed(dec) : String(Math.round(n)); }
  function runCount(el){
    var m=el.getAttribute('data-count-raw').match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if(!m){ return; }
    var pre=m[1], target=parseFloat(m[2]), dec=(m[2].split('.')[1]||'').length, suf=m[3];
    if(reduce){ el.textContent=pre+fmt(target,dec)+suf; return; }
    var dur=1400, t0=null;
    function step(t){
      if(t0===null) t0=t;
      var p=Math.min((t-t0)/dur,1), eased=1-Math.pow(1-p,3);
      el.textContent=pre+fmt(target*eased,dec)+suf;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  stats.forEach(function(el){
    var raw=el.textContent.trim();
    var m=raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if(!m) return;
    el.setAttribute('data-count-raw', raw);
    var dec=(m[2].split('.')[1]||'').length;
    if(!reduce) el.textContent=m[1]+fmt(0,dec)+m[3];
    countIO.observe(el);
  });

  if(reduce) return;

  /* ---- 등장 애니메이션 대상 ---- */
  var SKIP='#header,#footer,#mo_nav,#sideBar,.mainVisual,.rv-modal,.fixcta,.ji-intro,#clsSource,.dropdown_menu,[hidden]';
  /* 애니메이션 제외: 원인·솔루션 섹션 이미지, 장식 배경 그래픽 */
  var NOANIM='.linestory_section .img,.value_section .value-deco';
  var CARD=[
    '.box','.quoteline .q','.course-info','.course-row','.course-price','.course-cta',
    '.bg-item','.accline .item','.acc-item','.post-card','.value-points .vp','.fm-block',
    '.subhero_section .stats > div','.board','.cmp-wrap','.step-points li','.bookline .bk',
    '.sig-img','.sig-ph','.core-ph','.rv','.pm-viewport',
    'a.more_btn','.letter-inner > a','.partner_cta .inner > a'
  ].join(',');
  var TEXT=[
    'h1','h2','h3','h4','p','li',
    '.title > span','.head > span','.clinic .left > span','.letter-inner > span',
    '.value_section .text > span','.linestory_section .txt > span'
  ].join(',');

  var targets=[];
  function skip(el){ return el.closest(SKIP) || el.closest(NOANIM); }

  document.querySelectorAll(CARD).forEach(function(el){
    if(skip(el)) return;
    if(el.parentElement && el.parentElement.closest('.ani-fade')) return;   /* 바깥 카드가 이미 담당 */
    el.classList.add('ani-fade'); targets.push(el);
  });
  document.querySelectorAll('img').forEach(function(el){
    if(skip(el) || el.closest('.ani-fade')) return;
    el.classList.add('ani-fade'); targets.push(el);
  });
  document.querySelectorAll(TEXT).forEach(function(el){
    if(skip(el) || el.closest('.ani-fade') || el.closest('.ani-text')) return;
    if(!el.textContent.trim()) return;
    var cs=getComputedStyle(el);
    if(cs.transform && cs.transform!=='none') return;   /* 원래 transform 이 있는 요소는 건드리지 않는다 */
    el.classList.add('ani-text'); targets.push(el);
  });

  document.documentElement.classList.add('jia-anim');

  function done(el){
    el.classList.remove('ani-text','ani-fade','is-in');
    el.style.transitionDelay='';
  }
  var io=new IntersectionObserver(function(entries){
    var n=0;
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target;
      io.unobserve(el);
      el.style.transitionDelay=Math.min(n++,6)*90+'ms';
      el.classList.add('is-in');
      /* 끝나면 클래스를 걷어내 원래 hover 전환 등을 되돌린다 */
      setTimeout(function(){ done(el); }, 1800);
    });
  },{threshold:.12, rootMargin:'0px 0px -6% 0px'});
  targets.forEach(function(el){ io.observe(el); });
})();
