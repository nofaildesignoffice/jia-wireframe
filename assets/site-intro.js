/* ==========================================================================
   지아 인트로 애니메이션
   - 탭 세션당 1회만 재생 (sessionStorage)
   - 모션 최소화 설정을 존중
   - 어떤 이유로든 중간에 실패해도 오버레이가 남지 않도록 안전장치 포함
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'jia-intro-shown';
  var TIMING = {
    start: 120,    // 시작 전 대기
    hold: 1100,    // 로고 완성 후 유지
    fade: 700      // 페이드아웃 시간 (CSS transition 과 동일)
  };

  var el = document.getElementById('jiIntro');
  if (!el) return;

  function remove() {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // 모션 최소화 설정이면 재생하지 않는다
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var seen;
  try { seen = sessionStorage.getItem(KEY); } catch (e) { seen = null; }

  if (seen || reduce) { remove(); return; }

  try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

  // 재생 중에는 뒤 페이지가 스크롤되지 않게
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  el.classList.add('is-on');

  // 안전장치: 무슨 일이 있어도 이 시간 안에는 사라진다
  var failsafe = setTimeout(remove, TIMING.start + TIMING.hold + TIMING.fade + 4000);

  function play() {
    // 다음 프레임에 켜야 CSS transition 이 동작한다
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('is-play');

        // 마지막 글자의 transition-delay(.75s) + duration(.7s) 이후 유지 시간
        setTimeout(function () {
          el.classList.add('is-out');
          setTimeout(function () {
            clearTimeout(failsafe);
            remove();
          }, TIMING.fade);
        }, 1450 + TIMING.hold);
      });
    });
  }

  setTimeout(play, TIMING.start);
})();
