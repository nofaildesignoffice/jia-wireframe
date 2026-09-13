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
   클래스 선택 · 상세 · 결제 모달
   좌: 과정 선택 / 우: 선택한 과정의 상세(#clsSource 패널을 복제해 재조립)
   ========================================================================== */
(function(){
  var modal=document.getElementById('payModal');
  if(!modal) return;
  var detail=modal.querySelector('#payDetail'),
      priceEl=modal.querySelector('#payPrice'),
      btn=modal.querySelector('#payBtn'),
      empty='<p class="pay-empty">왼쪽에서 과정을 선택하시면 상세 내용이 표시됩니다.</p>';

  /* 탭 패널 마크업을 상세 패널용 한 단 구조로 재조립 */
  function build(id){
    var src=document.getElementById(id);
    if(!src){ detail.innerHTML=empty; return; }
    detail.innerHTML=src.innerHTML;

    var head=detail.querySelector('.cls-head');
    if(head){
      var chips=head.querySelector('.chips');
      if(chips) chips.parentNode.removeChild(chips);
    }
    var cols=detail.querySelector('.cls-cols');
    if(!cols) return;

    /* 표 -> 텍스트 목록 */
    var tbl=cols.querySelector('.tbl');
    if(tbl){
      var info=document.createElement('div'); info.className='cm-info';
      tbl.querySelectorAll('tr').forEach(function(tr){
        var th=tr.querySelector('th'), td=tr.querySelector('td');
        if(!th || !td) return;
        var row=document.createElement('div'); row.className='cm-row';
        var k=document.createElement('span'); k.className='k'; k.textContent=th.textContent.trim();
        var v=document.createElement('span'); v.className='v'; v.innerHTML=td.innerHTML;
        if(td.classList.contains('strong')) v.classList.add('strong');
        row.appendChild(k); row.appendChild(v);
        info.appendChild(row);
      });
      cols.parentNode.insertBefore(info, cols);
      tbl.parentNode.removeChild(tbl);
    }
    /* 결제 버튼이 왼쪽에 있으므로 패널 안의 신청 버튼은 제거 */
    var cta=cols.querySelector('.cls-cta');
    if(cta) cta.parentNode.removeChild(cta);

    /* 커리큘럼만 남겨 한 단으로 */
    var keep=document.createElement('div'); keep.className='cm-right';
    while(cols.firstChild){
      var n=cols.firstChild; cols.removeChild(n);
      if(n.nodeType!==1) continue;
      if(n.classList.contains('acc') || n.classList.contains('stepbar')) keep.appendChild(n);
      else while(n.firstChild){
        var c=n.firstChild; n.removeChild(c);
        if(c.nodeType===1) keep.appendChild(c);
      }
    }
    keep.querySelectorAll('.acc-item').forEach(function(it){ it.classList.add('is-open') });
    keep.querySelectorAll('.acc-q .mk').forEach(function(m){ m.parentNode.removeChild(m) });
    cols.parentNode.replaceChild(keep, cols);
  }

  function select(r){
    modal.querySelectorAll('.pay-opt').forEach(function(o){ o.classList.remove('is-on') });
    var opt=r.closest('.pay-opt');
    if(opt) opt.classList.add('is-on');
    r.checked=true;
    build(r.getAttribute('data-cls'));
    if(priceEl) priceEl.textContent=r.getAttribute('data-price');
    if(btn){
      btn.classList.remove('is-disabled');
      btn.removeAttribute('aria-disabled');
      btn.setAttribute('href','page_11.html?class='+r.value);
    }
    if(window.lucide) lucide.createIcons();
    if(detail) detail.scrollTop=0;
  }
  function reset(){
    modal.querySelectorAll('input[name="payClass"]').forEach(function(r){ r.checked=false });
    modal.querySelectorAll('.pay-opt').forEach(function(o){ o.classList.remove('is-on') });
    if(detail) detail.innerHTML=empty;
    if(priceEl) priceEl.textContent='과정을 선택해주세요';
    if(btn){ btn.classList.add('is-disabled'); btn.setAttribute('aria-disabled','true'); btn.setAttribute('href','#'); }
  }
  function open(cls){
    reset();
    if(cls){
      var r=modal.querySelector('input[name="payClass"][data-cls="'+cls+'"]');
      if(r) select(r);
    }
    modal.hidden=false;
    document.body.style.overflow='hidden';
    if(window.lucide) lucide.createIcons();
  }
  function close(){ modal.hidden=true; document.body.style.overflow=''; }

  /* 고정 CTA — 선택 없이 열기 */
  document.querySelectorAll('[data-pay-open]').forEach(function(b){
    b.onclick=function(e){ e.preventDefault(); open(null); };
  });
  /* 카드의 자세히 보기 — 해당 과정을 선택한 채로 열기 */
  document.querySelectorAll('.pm-slide[data-cls]').forEach(function(c){
    c.onclick=function(){ open(c.getAttribute('data-cls')); };
  });

  modal.querySelectorAll('[data-pay-close]').forEach(function(x){
    x.onclick=function(e){ e.stopPropagation(); close(); };
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !modal.hidden) close(); });
  modal.querySelectorAll('input[name="payClass"]').forEach(function(r){
    r.onchange=function(){ select(r) };
  });
  if(btn) btn.onclick=function(e){ if(btn.classList.contains('is-disabled')) e.preventDefault(); };
})();
