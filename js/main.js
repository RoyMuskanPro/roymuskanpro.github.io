(() => {
  try {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const theme = savedTheme || systemTheme;
    document.documentElement.dataset.theme = theme;
    document.querySelector("meta[name='theme-color']").setAttribute("content", theme === "light" ? "#f7faf9" : "#071016");
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector("meta[name='theme-color']");
  let redraw = () => {};

  function getTheme() {
    return root.dataset.theme === "light" ? "light" : "dark";
  }

  function setTheme(theme, persist = false) {
    root.dataset.theme = theme;
    themeMeta.setAttribute("content", theme === "light" ? "#f7faf9" : "#071016");

    if (themeButton) {
      themeButton.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
      themeButton.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch {
        return;
      }
    }
  }

  setTheme(getTheme());

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark", true);
      redraw();
    });
  }

  const canvas = document.querySelector(".data-viz");
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;

  const points = Array.from({ length: 26 }, (_, index) => ({
    x: index / 25,
    y: 0.42 + Math.sin(index * 0.72) * 0.14 + Math.cos(index * 0.31) * 0.05
  }));

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(timestamp = 0) {
    const time = timestamp * 0.00016;
    const styles = getComputedStyle(root);
    const barStart = styles.getPropertyValue("--viz-bar-start").trim() || "rgba(91, 209, 201, 0.22)";
    const barEnd = styles.getPropertyValue("--viz-bar-end").trim() || "rgba(91, 209, 201, 0.025)";
    const lineColor = styles.getPropertyValue("--viz-line").trim() || "rgba(167, 236, 229, 0.22)";
    const pointColor = styles.getPropertyValue("--viz-point").trim() || "rgba(207, 251, 245, 0.34)";

    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "miter";

    const barCount = Math.max(12, Math.floor(width / 92));
    const barWidth = Math.max(4, width / barCount * 0.18);
    const baseline = height * 0.72;

    for (let index = 0; index < barCount; index += 1) {
      const x = width * 0.08 + index * (width * 0.84 / Math.max(1, barCount - 1));
      const wave = Math.sin(time * 4.2 + index * 0.74) * 0.5 + 0.5;
      const lift = height * (0.09 + wave * 0.19);
      const gradient = context.createLinearGradient(0, baseline - lift, 0, baseline);

      gradient.addColorStop(0, barStart);
      gradient.addColorStop(1, barEnd);
      context.strokeStyle = gradient;
      context.lineWidth = barWidth;
      context.beginPath();
      context.moveTo(x, baseline);
      context.lineTo(x, baseline - lift);
      context.stroke();
    }

    context.beginPath();
    points.forEach((point, index) => {
      const x = width * (0.08 + point.x * 0.84);
      const pulse = Math.sin(time * 5 + index * 0.82) * 0.034;
      const y = height * (point.y + pulse);

      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.strokeStyle = lineColor;
    context.lineWidth = 1.35;
    context.stroke();

    for (let index = 0; index < points.length; index += 3) {
      const point = points[index];
      const x = width * (0.08 + point.x * 0.84);
      const y = height * (point.y + Math.sin(time * 5 + index * 0.82) * 0.034);

      context.beginPath();
      context.arc(x, y, 2.2, 0, Math.PI * 2);
      context.fillStyle = pointColor;
      context.fill();
    }

    if (!reducedMotion.matches) {
      frame = window.requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", () => {
    resize();
    if (reducedMotion.matches) {
      draw();
    }
  });

  const handleMotionChange = () => {
    window.cancelAnimationFrame(frame);
    draw();
  };

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", handleMotionChange);
  } else if (reducedMotion.addListener) {
    reducedMotion.addListener(handleMotionChange);
  }

  resize();
  redraw = () => {
    window.cancelAnimationFrame(frame);
    draw(performance.now());
  };
  draw();
});
