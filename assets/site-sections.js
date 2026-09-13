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
/* 원본 탭 패널(#clsSource)에서 필요한 부분만 꺼내 기존 섹션 패턴으로 그려준다.
   as:'grid'    — .cont.c3 헤어라인 그리드 (정보)
   as:'accline' — .accline 아코디언 라인 (커리큘럼)
   기본        — 모달용 한 단(정보 텍스트 + 커리큘럼 박스) */
function jiaClassParts(id){
  var src=document.getElementById(id);
  if(!src) return null;
  var tmp=document.createElement('div');
  tmp.innerHTML=src.innerHTML;
  var rows=[];
  tmp.querySelectorAll('.tbl tr').forEach(function(tr){
    var th=tr.querySelector('th'), td=tr.querySelector('td');
    if(th && td) rows.push({k:th.textContent.trim(), v:td.innerHTML, strong:td.classList.contains('strong')});
  });
  var items=[];
  tmp.querySelectorAll('.acc-item').forEach(function(it){
    var q=it.querySelector('.acc-q'), a=it.querySelector('.acc-a');
    if(!q || !a) return;
    var mk=q.querySelector('.mk'); if(mk) mk.parentNode.removeChild(mk);
    items.push({q:q.textContent.trim(), a:a.innerHTML});
  });
  var head=tmp.querySelector('.cls-head');
  var cta=tmp.querySelector('.cls-cta a');
  return {rows:rows, items:items, head:head, cta:cta};
}
function jiaEsc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function jiaRenderClass(target, id, opts){
  opts=opts||{};
  var d=jiaClassParts(id);
  if(!target || !d){ if(target) target.innerHTML=''; return; }

  if(opts.as==='grid'){
    target.className='cont c3';
    target.innerHTML=d.rows.map(function(r){
      return '<div class="box"><p class="n">'+jiaEsc(r.k)+'</p><h4'+(r.strong?' class="fee"':'')+'>'+r.v+'</h4></div>';
    }).join('');
    return;
  }
  if(opts.as==='accline'){
    target.innerHTML='<div class="accline">'+d.items.map(function(it,i){
      return '<div class="item'+(i===0?' is-open':'')+'">'
        +'<button class="q acc-q">'+jiaEsc(it.q)+'<span class="mk">+</span></button>'
        +'<div class="a acc-a">'+it.a+'</div></div>';
    }).join('')+'</div>';
    /* 이 스크립트는 페이지 인라인 스크립트 뒤에 실행되므로 직접 묶어준다 */
    target.querySelectorAll('.acc-q').forEach(function(q){
      q.onclick=function(){ q.parentElement.classList.toggle('is-open') };
    });
    return;
  }

  /* 기본 — 모달 상세 */
  target.innerHTML='';
  if(d.head && d.head.children.length){
    var chips=d.head.querySelector('.chips');
    if(chips) chips.parentNode.removeChild(chips);
    if(d.head.children.length) target.appendChild(d.head);
  }
  if(d.rows.length){
    target.insertAdjacentHTML('beforeend','<div class="cm-info">'+d.rows.map(function(r){
      return '<div class="cm-row"><span class="k">'+jiaEsc(r.k)+'</span><span class="v'+(r.strong?' strong':'')+'">'+r.v+'</span></div>';
    }).join('')+'</div>');
  }
  if(d.items.length){
    target.insertAdjacentHTML('beforeend','<div class="cm-right"><div class="acc">'+d.items.map(function(it){
      return '<div class="acc-item is-open"><button class="acc-q">'+jiaEsc(it.q)+'</button><div class="acc-a">'+it.a+'</div></div>';
    }).join('')+'</div></div>');
  }
}

document.querySelectorAll('[data-cls-src]').forEach(function(el){
  jiaRenderClass(el, el.getAttribute('data-cls-src'), {as: el.getAttribute('data-cls-as') || ''});
});

(function(){
  var modal=document.getElementById('payModal');
  if(!modal) return;
  var detail=modal.querySelector('#payDetail'),
      priceEl=modal.querySelector('#payPrice'),
      btn=modal.querySelector('#payBtn'),
      empty='<p class="pay-empty">왼쪽에서 과정을 선택하시면 상세 내용이 표시됩니다.</p>';

  function build(id){ jiaRenderClass(detail, id); }

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
