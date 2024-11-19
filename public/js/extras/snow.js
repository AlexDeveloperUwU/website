let skew = 1;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

(function frame() {
  const ticks = Math.max(200, 500 * Math.random());

  skew = Math.max(0.8, skew - 0.001);

  confetti({
    particleCount: 1,
    startVelocity: 0,
    ticks: ticks,
    origin: {
      x: Math.random(),
      y: Math.random() * skew - 0.2,
    },
    colors: ["#ffffff"],
    shapes: ["emoji"],
    shapeOptions: {
      emoji: {
        value: ["❄️"],
      },
    },
    gravity: randomInRange(0.4, 0.6),
    scalar: randomInRange(0.4, 1),
  });

  requestAnimationFrame(frame);
})();
