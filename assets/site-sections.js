/* ==========================================================================
   지아 공용 섹션 JS — 프로모션 카드 슬라이더 (.slide_contain)
   여러 페이지에서 재사용. lucide.createIcons() 이후 로드.
   ========================================================================== */
(function(){
/* ===== 경력자 클래스 카드 슬라이더 (유라인 프로모션) ===== */
document.querySelectorAll('.slide_contain').forEach(function(sc){
  var track=sc.querySelector('.pm-track'),
      vp=sc.querySelector('.pm-viewport'),
      prev=sc.querySelector('.pm-prev'), next=sc.querySelector('.pm-next'),
      idx=0;
  if(!track||!vp) return;
  function step(){
    var first=track.querySelector('.pm-slide');
    return first ? first.getBoundingClientRect().width + 26 : 0;
  }
  function maxIdx(){
    var total=track.scrollWidth, view=vp.clientWidth, s=step();
    return s ? Math.max(0, Math.ceil((total-view)/s)) : 0;
  }
  function render(){
    idx=Math.min(idx, maxIdx());
    track.style.transform='translateX('+(-idx*step())+'px)';
    if(prev) prev.disabled = idx<=0;
    if(next) next.disabled = idx>=maxIdx();
  }
  if(prev) prev.onclick=function(){idx--;render()};
  if(next) next.onclick=function(){idx++;render()};
  window.addEventListener('resize',render);
  render();
});
})();

/* ==========================================================================
   클래스 상세 모달 — APPLY 카드를 누르면 Class 탭 패널 내용을 그대로 띄운다.
   내용을 복제해 쓰므로 카피가 한 곳(#classes)에만 존재한다.
   ========================================================================== */
(function(){
  var modal=document.getElementById('clsModal');
  if(!modal) return;
  var body=modal.querySelector('.cls-modal-body');
  if(!body) return;

  function open(id){
    var src=document.getElementById(id);
    if(!src) return;
    body.innerHTML=src.innerHTML;
    /* 복제본에는 이벤트가 따라오지 않으므로 아코디언을 다시 묶는다 */
    body.querySelectorAll('.acc-q').forEach(function(q){
      q.onclick=function(){q.parentElement.classList.toggle('is-open')};
    });
    modal.hidden=false;
    document.body.style.overflow='hidden';
    var box=modal.querySelector('.rv-box');
    if(box) box.scrollTop=0;
    if(window.lucide) lucide.createIcons();
  }
  function close(){
    modal.hidden=true;
    document.body.style.overflow='';
    body.innerHTML='';
  }

  document.querySelectorAll('.pm-slide[data-cls]').forEach(function(c){
    c.onclick=function(){open(c.getAttribute('data-cls'))};
  });
  modal.querySelectorAll('[data-cls-close]').forEach(function(x){
    x.onclick=function(e){e.stopPropagation(); close()};
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && !modal.hidden) close();
  });
})();

/* 후기 슬라이더 — 모바일 스와이프.
   슬라이더 본체는 각 페이지 인라인 스크립트가 담당하므로 좌우 버튼을 대신 눌러준다. */
document.querySelectorAll('.rv').forEach(function(rv){
  var vp=rv.querySelector('.rv-vp'),
      prev=rv.querySelector('.rv-prev'),
      next=rv.querySelector('.rv-next');
  if(!vp || !prev || !next) return;
  var x0=null, y0=null, horiz=false;
  vp.addEventListener('touchstart',function(e){
    var t=e.touches[0]; x0=t.clientX; y0=t.clientY; horiz=false;
  },{passive:true});
  vp.addEventListener('touchmove',function(e){
    if(x0===null) return;
    var t=e.touches[0];
    if(!horiz && Math.abs(t.clientX-x0) > Math.abs(t.clientY-y0)+6) horiz=true;
  },{passive:true});
  vp.addEventListener('touchend',function(e){
    if(x0===null) return;
    var dx=e.changedTouches[0].clientX - x0;
    if(horiz && Math.abs(dx) > 40) (dx < 0 ? next : prev).click();
    x0=null;
  },{passive:true});
});
