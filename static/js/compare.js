// Before/after slider for two synchronized videos: the right video is clipped
// at the pointer position, so the left shows MonoGS and the right shows ours.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.compare-slider').forEach(function (box) {
    var left = box.querySelector('.compare-left');
    var right = box.querySelector('.compare-right');
    var handle = box.querySelector('.compare-handle');
    var labelL = box.querySelector('.compare-label-left');
    var labelR = box.querySelector('.compare-label-right');

    function setPos(frac) {
      frac = Math.min(Math.max(frac, 0), 1);
      var pct = frac * 100;
      right.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
      labelL.style.opacity = frac < 0.12 ? 0 : 1;
      labelR.style.opacity = frac > 0.88 ? 0 : 1;
    }
    setPos(parseFloat(box.dataset.pos || '0.5'));

    function onMove(clientX) {
      var r = box.getBoundingClientRect();
      setPos((clientX - r.left) / r.width);
    }
    box.addEventListener('mousemove', function (e) { onMove(e.clientX); });
    box.addEventListener('touchmove', function (e) {
      onMove(e.touches[0].clientX);
      e.preventDefault();
    }, { passive: false });

    // Keep the two videos on the same frame.
    function sync() {
      if (Math.abs(left.currentTime - right.currentTime) > 0.06) {
        right.currentTime = left.currentTime;
      }
    }
    setInterval(sync, 250);
    left.addEventListener('seeked', function () { right.currentTime = left.currentTime; });
    left.addEventListener('play', function () { right.currentTime = left.currentTime; right.play(); });
  });
});
