/* ==========================================================================
   지아 공용 섹션 JS — 스토리 슬라이더 (아코디언형)
   ========================================================================== */
(function(){
  document.querySelectorAll('[data-story]').forEach(function(sec){
    var track  = sec.querySelector('.st-track'),
        slides = sec.querySelectorAll('.st-slide'),
        bars   = sec.querySelectorAll('.st-progress span'),
        prev   = sec.querySelector('.st-prev'),
        next   = sec.querySelector('.st-next'),
        nameEl = sec.querySelector('.bottom .name'),
        numEl  = sec.querySelector('.bottom .num'),
        i = 0;
    if(!track || !slides.length) return;

    function shift(){
      /* 활성 슬라이드가 왼쪽에 오도록 이전 슬라이드들의 폭 합만큼 이동 */
      var x = 0;
      for(var k=0; k<i; k++){
        x += slides[k].getBoundingClientRect().width;
        var cs = getComputedStyle(track);
        x += parseFloat(cs.columnGap || cs.gap) || 0;
      }
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }
    function render(){
      slides.forEach(function(s,k){ s.classList.toggle('is-active', k===i) });
      bars.forEach(function(b,k){ b.classList.toggle('is-active', k===i) });
      if(prev) prev.disabled = (i<=0);
      if(next) next.disabled = (i>=slides.length-1);
      var h4 = slides[i].querySelector('.top h4');
      if(nameEl && h4) nameEl.textContent = h4.textContent;
      if(numEl) numEl.innerHTML = '<span>' + String(i+1).padStart(2,'0') + '</span> / ' +
                                  String(slides.length).padStart(2,'0');
      /* 폭 전환 애니메이션이 끝난 뒤 위치를 다시 잡는다 */
      shift();
      setTimeout(shift, 520);
    }
    if(prev) prev.onclick = function(){ if(i>0){ i--; render(); } };
    if(next) next.onclick = function(){ if(i<slides.length-1){ i++; render(); } };
    slides.forEach(function(s,k){
      s.addEventListener('click', function(){ if(k!==i){ i=k; render(); } });
    });
    window.addEventListener('resize', shift);
    render();
  });
})();
