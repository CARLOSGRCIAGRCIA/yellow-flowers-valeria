const Galaxy = (() => {
  let canvas, ctx;
  let W, H;
  let stars, asteroids;
  let galaxies = [];
  let time = 0;

  function init() {
    canvas = document.getElementById("galaxy-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d", { alpha: false });
    resize();
    window.addEventListener("resize", debounce(resize, 200));
    loop();
  }

  const debounce = (fn, d) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), d);
    };
  };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initGalaxies();
    asteroids = [];
  }

  function initStars() {
    stars = [];
    const n = Math.floor((W * H) / 6000);
    for (let i = 0; i < n; i++) {
      const h =
        Math.random() < 0.5
          ? 220 + Math.random() * 50
          : Math.random() < 0.5
            ? 260 + Math.random() * 60
            : 320 + Math.random() * 30;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.5 + 0.3,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.008 + 0.003,
        c: { h, s: 60 + Math.random() * 30, l: 85 + Math.random() * 12 },
      });
    }
  }

  function initGalaxies() {
    const r = Math.min(W, H);
    galaxies = [
      createGalaxy("milkyway", W * 0.5, H * 0.42, r * 0.32, 0, 4),
      createGalaxy("andromeda", W * 0.82, H * 0.3, r * 0.22, 0.4, 3),
      createGalaxy("arp273", W * 0.18, H * 0.52, r * 0.16, -0.3, 2),
    ];
  }

  function createGalaxy(type, x, y, size, rotOffset, armCount) {
    const arms = [];
    for (let a = 0; a < armCount; a++) {
      const armAngle = (a * Math.PI * 2) / armCount + rotOffset;
      const armStars = [];
      const starCount =
        type === "milkyway" ? 550 : type === "andromeda" ? 350 : 180;

      for (let i = 0; i < starCount; i++) {
        const r = Math.random() * size;
        const spread = (Math.random() - 0.5) * 0.25;
        const angle = armAngle + r * 0.012;

        armStars.push({
          rx: Math.cos(angle + spread) * r,
          ry: Math.sin(angle + spread) * r * 0.55,
          r: Math.random() * 1.0 + 0.15,
          a: Math.random() * 0.5 + 0.3,
          ph: Math.random() * Math.PI * 2,
          c:
            type === "andromeda"
              ? { h: 200 + Math.random() * 40, s: 50, l: 88 }
              : type === "arp273"
                ? { h: 300 + Math.random() * 40, s: 55, l: 85 }
                : Math.random() < 0.8
                  ? { h: 260 + Math.random() * 40, s: 65, l: 88 }
                  : { h: 35 + Math.random() * 20, s: 50, l: 92 },
        });
      }
      arms.push(armStars);
    }

    const nebulae = type === "milkyway" ? [] : null;
    if (type === "milkyway") {
      for (let i = 0; i < 6; i++) {
        nebulae.push({
          ox: (Math.random() - 0.5) * size,
          oy: (Math.random() - 0.5) * size * 0.5,
          rad: Math.random() * size * 0.25 + size * 0.1,
          al: Math.random() * 0.06 + 0.015,
          h:
            Math.random() < 0.5
              ? 270 + Math.random() * 40
              : 320 + Math.random() * 30,
          st: 1 + Math.random(),
        });
      }
    }

    const dust = type === "milkyway" ? [] : null;
    if (type === "milkyway") {
      for (let i = 0; i < 3; i++) {
        dust.push({
          ang: (Math.random() - 0.5) * 0.6,
          w: Math.random() * size * 0.12 + size * 0.04,
          l: size * 0.7,
          al: Math.random() * 0.1 + 0.02,
        });
      }
    }

    return {
      type,
      x,
      y,
      size,
      arms,
      nebulae,
      dust,
      rot: 0,
      rotSpd: 0.00078,
    };
  }

  function spawnAsteroid() {
    const angle = Math.PI * 0.38 + Math.random() * 0.25;
    asteroids.push({
      x: W + 50,
      y: Math.random() * H * 0.5,
      vx: -Math.cos(angle) * (Math.random() * 5 + 4),
      vy: Math.sin(angle) * (Math.random() * 5 + 4),
      life: 1,
      dec: 0.004 + Math.random() * 0.004,
      sz: Math.random() * 2 + 1,
      t: [],
      h: 35 + Math.random() * 20,
    });
  }

  function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      a.t.push(a.x, a.y, a.life);
      if (a.t.length > 60) a.t.splice(0, 3);
      a.x += a.vx;
      a.y += a.vy;
      a.life -= a.dec;
      if (a.life <= 0 || a.x < -100) asteroids.splice(i, 1);
    }
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#030208");
    g.addColorStop(0.5, "#050310");
    g.addColorStop(1, "#070412");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawGalaxy(g) {
    g.rot += g.rotSpd;
    const cos = Math.cos(g.rot),
      sin = Math.sin(g.rot);

    if (g.nebulae) {
      for (const n of g.nebulae) {
        ctx.save();
        ctx.translate(g.x + n.ox, g.y + n.oy);
        ctx.rotate(g.rot * 0.3);
        ctx.scale(1, n.st);
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rad);
        grd.addColorStop(0, `hsla(${n.h}, 65%, 62%, ${n.al})`);
        grd.addColorStop(0.5, `hsla(${n.h + 25}, 50%, 48%, ${n.al * 0.4})`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(0, 0, n.rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.translate(g.x, g.y);
    ctx.rotate(g.rot * 0.5);

    for (const arm of g.arms) {
      for (const s of arm) {
        const alpha = s.a * (0.75 + 0.25 * Math.sin(time * 0.002 + s.ph));
        const sx = s.rx * cos - s.ry * sin;
        const sy = s.rx * sin + s.ry * cos;

        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.c.h}, ${s.c.s}%, ${s.c.l}%, ${alpha})`;
        ctx.fill();

        if (s.r > 0.9 && alpha > 0.55) {
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.c.h}, ${s.c.s}%, ${s.c.l}%, ${alpha * 0.07})`;
          ctx.fill();
        }
      }
    }

    ctx.restore();

    if (g.dust) {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rot * 0.5);

      for (const d of g.dust) {
        ctx.save();
        ctx.rotate(d.ang);
        const grd = ctx.createLinearGradient(-d.l / 2, 0, d.l / 2, 0);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(0.3, `rgba(5, 3, 12, ${d.al})`);
        grd.addColorStop(0.5, `rgba(8, 5, 18, ${d.al * 1.2})`);
        grd.addColorStop(0.7, `rgba(5, 3, 12, ${d.al})`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(-d.l / 2, -d.w / 2, d.l, d.w);
        ctx.restore();
      }

      ctx.restore();
    }

    const coreR = g.size * 0.18;
    const coreGrd = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, coreR * 3);
    const coreH =
      g.type === "andromeda" ? 200 : g.type === "arp273" ? 310 : 280;
    coreGrd.addColorStop(0, `hsla(${coreH}, 50%, 95%, 0.22)`);
    coreGrd.addColorStop(0.3, `hsla(${coreH + 15}, 45%, 80%, 0.1)`);
    coreGrd.addColorStop(0.6, `hsla(${coreH + 30}, 40%, 60%, 0.04)`);
    coreGrd.addColorStop(1, "transparent");
    ctx.fillStyle = coreGrd;
    ctx.beginPath();
    ctx.arc(g.x, g.y, coreR * 3, 0, Math.PI * 2);
    ctx.fill();

    if (g.type === "arp273") {
      const g2 = { rx: g.size * 0.28, ry: -g.size * 0.18, rot: g.rot * 1.1 };
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.translate(g.x, g.y);

      for (const arm of g.arms) {
        for (const s of arm) {
          const sx =
            s.rx * 0.35 * Math.cos(g2.rot) -
            s.ry * 0.35 * Math.sin(g2.rot) +
            g2.rx;
          const sy =
            s.rx * 0.35 * Math.sin(g2.rot) +
            s.ry * 0.35 * Math.cos(g2.rot) +
            g2.ry;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.c.h}, ${s.c.s}%, ${s.c.l}%, ${s.a * 0.45})`;
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  function drawStars() {
    for (const s of stars) {
      const alpha = s.a * (0.7 + 0.3 * Math.sin(time * s.sp + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.c.h}, ${s.c.s}%, ${s.c.l}%, ${alpha})`;
      ctx.fill();
    }
  }

  function drawAsteroids() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (const a of asteroids) {
      const len = a.t.length / 3;
      for (let i = 0; i < len - 1; i++) {
        const idx = i * 3;
        const x1 = a.t[idx],
          y1 = a.t[idx + 1],
          l1 = a.t[idx + 2];
        const x2 = a.t[idx + 3] ?? x1,
          y2 = a.t[idx + 4] ?? y1;
        const prog = i / len;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${a.h}, 85%, 78%, ${l1 * prog * 0.65})`;
        ctx.lineWidth = a.sz * prog;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      const grd = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.sz * 5);
      grd.addColorStop(0, `hsla(45, 100%, 95%, ${a.life})`);
      grd.addColorStop(0.25, `hsla(${a.h}, 85%, 72%, ${a.life * 0.8})`);
      grd.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.sz * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawHorizon() {
    const grd = ctx.createLinearGradient(0, H, 0, H * 0.45);
    grd.addColorStop(0, "rgba(3, 1, 8, 0.94)");
    grd.addColorStop(0.35, "rgba(5, 2, 12, 0.5)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  function loop() {
    time++;

    ctx.fillStyle = "#030208";
    ctx.fillRect(0, 0, W, H);

    drawBackground();

    for (const g of galaxies) drawGalaxy(g);

    drawStars();
    drawHorizon();
    updateAsteroids();
    drawAsteroids();

    requestAnimationFrame(loop);
  }

  function startAsteroids() {
    setInterval(() => {
      if (Math.random() > 0.4) spawnAsteroid();
    }, 2800);
    setTimeout(spawnAsteroid, 700);
    setTimeout(spawnAsteroid, 1500);
  }

  return { init, startAsteroids };
})();

export function initGalaxy() {
  Galaxy.init();
  Galaxy.startAsteroids();
}
