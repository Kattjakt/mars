import "./styles.css.proxy.js";
function* noise(seed = 0) {
  while (true) {
    seed = seed * 16807 % 2147483647;
    yield (seed - 1) / 2147483646;
  }
}
const darken = (hex, amount) => {
  const transform = (color) => {
    return Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16);
  };
  return "#" + hex.replace(/^#/, "").replace(/../g, (color) => ("0" + transform(color)).substr(-2));
};
const scene = document.querySelector(".scene");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const resize = () => {
  const rect = scene.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
};
window.addEventListener("load", resize, false);
window.addEventListener("resize", resize, false);
const render = (delta) => {
  const time = 1e3 + delta / 9;
  let slideupTransition = Math.min((time - 1050) / 250, 1);
  slideupTransition = 1 - Math.sin(slideupTransition * (Math.PI / 2));
  let timecycle = Math.max(time - 1100, 0);
  timecycle = Math.min(timecycle / 500, 1);
  timecycle = 1 - Math.sin(timecycle * (Math.PI / 2));
  const sunOffset = timecycle * canvas.height / 1.65;
  const sunX = canvas.width / 2;
  const sunY = canvas.height / 2.2 + sunOffset;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const nightskyGradient = context.createRadialGradient(sunX, sunY, 20, sunX, sunY - 150 * timecycle, 200);
  nightskyGradient.addColorStop(0, `rgba(42, 51, 62, ${timecycle})`);
  nightskyGradient.addColorStop(1, `rgba(25, 29, 35, ${timecycle})`);
  context.fillStyle = nightskyGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const dayskyGradient = context.createRadialGradient(sunX, sunY, 20, sunX, sunY - 150 * timecycle, 500 / 2.5);
  dayskyGradient.addColorStop(0, `rgba(255, 253, 229, ${(1 - timecycle) * 0.85})`);
  dayskyGradient.addColorStop(1, `rgba(97, 33, 0, ${0.47 * (1 - timecycle)})`);
  context.fillStyle = dayskyGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const sunRadialFactor = 1 - timecycle;
  const sunRadialGradient = context.createRadialGradient(sunX, sunY, 30, sunX, sunY + canvas.height / 6 * sunRadialFactor, canvas.height / 1.65);
  sunRadialGradient.addColorStop(0, `rgba(255, 253, 229, ${0.25 * (1 - timecycle)})`);
  sunRadialGradient.addColorStop(1, "transparent");
  context.fillStyle = sunRadialGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = `rgba(255, 253, 229, ${(1 - timecycle) * 0.5})`;
  context.beginPath();
  context.arc(sunX, sunY, Math.abs(canvas.width / 20 * (1 - timecycle)), 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  const yStep = 1 / canvas.height;
  for (let y = 0; y <= 1; y += yStep) {
    if (y < 0.1 || y > 0.9)
      continue;
    if ((time - y * canvas.height) % 9 >= 1) {
      continue;
    }
    const baseline = Math.pow(y * canvas.height * 375e-5, 2.85) * 1.2;
    const seed = Math.floor((time - y * canvas.height) / 9);
    const random = noise(Math.floor(seed));
    const step = 1 / 9;
    let points = [];
    for (let x = -step; x <= 1 + step; x += step) {
      const deviation = Math.abs(Math.pow((x - 0.5) * 4, 2)) * -2.5;
      const wiggle = (1 + Math.sin(time / 100)) * deviation * 0.5;
      const roundiness = (deviation + wiggle) / 500;
      const value = random.next().value / 15.6;
      const terrainOffset = value * (0.6 + baseline);
      const perspective = Math.pow(baseline * 2, 2.5) * 0.022;
      const offset = perspective + roundiness - terrainOffset;
      const finalY = 0.6 + slideupTransition + offset;
      points.push([x, finalY]);
    }
    context.beginPath();
    let i = 0;
    for (i = 0; i < points.length - 2; i++) {
      const xc = (points[i][0] + points[i + 1][0]) / 2;
      const yc = (points[i][1] + points[i + 1][1]) / 2;
      const x = points[i][0] * canvas.width;
      const y2 = points[i][1] * canvas.height;
      context.quadraticCurveTo(x, y2, xc * canvas.width, yc * canvas.height);
    }
    context.quadraticCurveTo(points[i][0] * canvas.width, points[i][1] * canvas.height, points[i + 1][0] * canvas.width, points[i + 1][1] * canvas.height);
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
    let intensity = Math.pow(y, 1.2) * canvas.height / 100;
    let color = "#deb887";
    color = darken(color, Math.floor(intensity * -75));
    color = darken(color, Math.floor(timecycle * -125));
    context.fillStyle = color;
    context.fill();
  }
  const factor = Math.pow(1 - timecycle, 2);
  const rayGradient = context.createRadialGradient(sunX, sunY, 30, sunX, sunY + canvas.height / 6 * factor, canvas.height / 1.65);
  const rayOpacity = Math.pow(factor, 2);
  rayGradient.addColorStop(0, `rgba(255, 253, 229, ${0.3 * rayOpacity})`);
  rayGradient.addColorStop(1, "transparent");
  context.fillStyle = rayGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(render);
};
render(0);
