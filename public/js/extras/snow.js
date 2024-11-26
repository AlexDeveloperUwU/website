function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

(function frame() {
  const ticks = Math.max(200, 500 * Math.random());

  confetti({
    particleCount: 1,
    startVelocity: 0,
    ticks: ticks,
    origin: {
      x: Math.random(),
      y: Math.random(),
    },
    colors: ["#ffffff"],
    shapes: ["emoji"],
    shapeOptions: {
      emoji: {
        value: ["❄️"],
      },
    },
    gravity: randomInRange(0.4, 0.6),
    scalar: randomInRange(0.4, 1.2),
  });

  setTimeout(() => {
    requestAnimationFrame(frame);
  }, 10);
})();