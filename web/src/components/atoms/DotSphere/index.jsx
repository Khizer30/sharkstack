import { useEffect, useRef } from "react";

class Ease {
  constructor(value, pow, duration, timeBegin) {
    this.value = this.begin = this.end = value;
    this.pow = pow;
    this.maxDuration = duration;
    this.time = timeBegin;
    this.duration = 0;
    this.init();
  }

  init() {
    this.begin = this.end;
    this.end = Math.random();
    this.time = 0;
    this.duration = Math.sqrt(Math.abs(this.end - this.begin)) * this.maxDuration;
  }

  update(timeChange = 1) {
    let timeRatio = this.time / this.duration;

    if (timeRatio < 0.5) {
      timeRatio = 0.5 * Math.pow(timeRatio * 2, this.pow);
    } else {
      timeRatio = 1 - 0.5 * Math.pow((1 - timeRatio) * 2, this.pow);
    }

    this.value = this.begin + timeRatio * (this.end - this.begin);
    this.time += timeChange;
    if (this.time > this.duration) {
      this.init();
    }
  }
}

export function DotSphere({
  dotGap = 20,
  sphereRadius = 200,
  dotRadiusMax = 3,
  speed = 0.15,
  bgColor = "#262626",
  dotColor = "#fe7272",
  followMouse = false,
  className = "absolute inset-0 w-full h-full",
  style = {}
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    canvas: null,
    ctx: null,
    center: { x: 0, y: 0 },
    windowSize: { w: 0, h: 0 },
    circleNumber: { x: 0, y: 0 },
    posStart: { x: 0, y: 0 },
    easeX: new Ease(0.5, 2, 60, 0),
    easeY: new Ease(0.5, 2, 60, 0),
    animationId: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;
    state.canvas = canvas;
    state.ctx = ctx;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      state.windowSize = {
        w: rect.width || canvas.offsetWidth,
        h: rect.height || canvas.offsetHeight
      };

      canvas.width = state.windowSize.w;
      canvas.height = state.windowSize.h;

      state.center = {
        x: state.windowSize.w / 2,
        y: state.windowSize.h / 2
      };

      setDotParams();
    };

    const setDotParams = () => {
      state.circleNumber = {
        x: Math.floor(state.windowSize.w / dotGap) + 2,
        y: Math.floor(state.windowSize.h / dotGap) + 1
      };

      state.posStart = {
        x: Math.round((state.windowSize.w - (state.circleNumber.x - 1) * dotGap) / 2),
        y: Math.round((state.windowSize.h - (state.circleNumber.y - 1) * dotGap) / 2)
      };
    };

    const getDistance = (x, y) => {
      const distanceX = x - state.center.x;
      const distanceY = y - state.center.y;
      return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    };

    const getAlpha = (distance) => 1 - distance / sphereRadius;

    const getRadius = (alpha) => dotRadiusMax * alpha;

    const drawDots = () => {
      ctx.beginPath();
      ctx.fillStyle = bgColor;
      ctx.rect(0, 0, state.windowSize.w, state.windowSize.h);
      ctx.fill();
      ctx.closePath();

      for (let i = 0; i < state.circleNumber.x; i++) {
        for (let j = 0; j < state.circleNumber.y; j++) {
          const gapX = j % 2 === 0 ? -dotGap / 2 : 0;
          const x = state.posStart.x + gapX + i * dotGap;
          const y = state.posStart.y + j * dotGap;

          const distance = getDistance(x, y);

          if (distance <= sphereRadius) {
            const alpha = getAlpha(distance);
            const radius = getRadius(alpha);

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.fillStyle = dotColor;
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const moveCenter = (e) => {
      if (e === null) {
        state.easeX.update(speed);
        state.easeY.update(speed);
        state.center.x = state.easeX.value * state.windowSize.w;
        state.center.y = state.easeY.value * state.windowSize.h;
      } else {
        const rect = canvas.getBoundingClientRect();
        state.center.x = e.clientX - rect.left;
        state.center.y = e.clientY - rect.top;
      }
    };

    const render = () => {
      if (!followMouse) moveCenter(null);
      drawDots();
    };

    const draw = () => {
      state.animationId = requestAnimationFrame(draw);
      render();
    };

    const handleMouseMove = (e) => {
      if (followMouse) moveCenter(e);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Only run the render loop while this canvas is actually visible —
    // without this it keeps redrawing every frame for the entire session,
    // long after the user has scrolled past it.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!state.animationId) draw();
      } else if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = 0;
      }
    });
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(state.animationId);
    };
  }, [dotGap, sphereRadius, dotRadiusMax, speed, bgColor, dotColor, followMouse]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
