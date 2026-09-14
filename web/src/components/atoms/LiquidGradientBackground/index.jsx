import { useEffect, useRef } from "react";
import * as THREE from "three";
import { colors } from "@/constants/colors";

const hexToVec3 = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

class TouchTexture {
  constructor() {
    this.size = 64;
    this.width = 64;
    this.height = 64;
    this.maxAge = 64;
    this.radius = 0.1;
    this.speed = 1 / 64;
    this.trail = [];
    this.last = null;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }
  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      const f = p.force * this.speed * (1 - p.age / this.maxAge);
      p.x += p.vx * f;
      p.y += p.vy * f;
      p.age++;
      if (p.age > this.maxAge) this.trail.splice(i, 1);
      else this.drawPoint(p);
    }
    this.texture.needsUpdate = true;
  }
  addTouch(point) {
    let force = 0,
      vx = 0,
      vy = 0;
    if (this.last) {
      const dx = point.x - this.last.x,
        dy = point.y - this.last.y;
      if (dx === 0 && dy === 0) return;
      const d = Math.sqrt(dx * dx + dy * dy);
      vx = dx / d;
      vy = dy / d;
      force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }
  drawPoint(p) {
    const pos = { x: p.x * this.width, y: (1 - p.y) * this.height };
    let intensity =
      p.age < this.maxAge * 0.3
        ? Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2))
        : -((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) * (1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7) - 2));
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const radius = this.radius * this.width;
    this.ctx.shadowOffsetX = this.size * 5;
    this.ctx.shadowOffsetY = this.size * 5;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - this.size * 5, pos.y - this.size * 5, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

const VERTEX = `varying vec2 vUv; void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vUv = uv; }`;

const FRAGMENT = `
  uniform float uTime, uSpeed, uIntensity, uGrainIntensity, uGradientSize, uColor1Weight, uColor2Weight;
  uniform vec2 uResolution;
  uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6, uDarkNavy;
  uniform sampler2D uTouchTexture;
  varying vec2 vUv;
  float grain(vec2 uv, float t) { return fract(sin(dot(uv * uResolution * 0.5 + t, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0; }
  vec3 getGradientColor(vec2 uv, float time) {
    vec2 c1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
    vec2 c2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
    vec2 c3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
    vec2 c4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
    vec2 c5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
    vec2 c6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
    float i1 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c1));
    float i2 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c2));
    float i3 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c3));
    float i4 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c4));
    float i5 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c5));
    float i6 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c6));
    vec3 color = vec3(0.0);
    color += uColor1 * i1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
    color += uColor2 * i2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
    color += uColor3 * i3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
    color += uColor4 * i4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
    color += uColor5 * i5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
    color += uColor6 * i6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(lum), color, 1.35);
    color = pow(color, vec3(0.92));
    float brightness = length(color);
    color = mix(uDarkNavy, color, max(brightness * 1.2, 0.15));
    return color;
  }
  void main() {
    vec2 uv = vUv;
    vec4 t = texture2D(uTouchTexture, uv);
    uv.x -= (t.r * 2.0 - 1.0) * 0.8 * t.b;
    uv.y -= (t.g * 2.0 - 1.0) * 0.8 * t.b;
    vec2 center = vec2(0.5);
    float dist = length(uv - center);
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * t.b;
    uv += vec2(ripple);
    vec3 color = getGradientColor(uv, uTime);
    color += grain(uv, uTime) * uGrainIntensity;
    color = clamp(color, vec3(0.0), vec3(1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function LiquidGradientBackground({ dark = true, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer = null,
      camera = null,
      scene = null,
      mesh = null,
      uniforms = null;
    let touchTexture = null,
      clock = null;
    let onMouseMove = null,
      onResize = null;
    let animId = 0;
    let isVisible = false;
    let pendingTouch = null;

    const getViewSize = () => {
      const fov = (camera.fov * Math.PI) / 180;
      const height = Math.abs(camera.position.z * Math.tan(fov / 2) * 2);
      return { width: height * camera.aspect, height };
    };

    const tick = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      if (pendingTouch) {
        touchTexture.addTouch(pendingTouch);
        pendingTouch = null;
      }
      const delta = Math.min(clock.getDelta(), 0.1);
      touchTexture.update();
      uniforms.uTime.value += delta;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    function init() {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
      camera.position.z = 50;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(dark ? colors.bgBrand : colors.bgLight);

      touchTexture = new TouchTexture();

      uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uColor1: { value: hexToVec3(colors.primary) },
        uColor2: { value: hexToVec3(colors.secondary) },
        uColor3: { value: hexToVec3(colors.primary) },
        uColor4: { value: hexToVec3(colors.secondary) },
        uColor5: { value: hexToVec3(colors.primary) },
        uColor6: { value: hexToVec3(colors.secondary) },
        uDarkNavy: { value: hexToVec3(colors.bgBrand) },
        uSpeed: { value: 1.2 },
        uIntensity: { value: 1.8 },
        uGrainIntensity: { value: 0.08 },
        uGradientSize: { value: 0.45 },
        uColor1Weight: { value: 0.5 },
        uColor2Weight: { value: 1.8 },
        uTouchTexture: { value: touchTexture.texture }
      };

      const viewSize = getViewSize();
      const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      clock = new THREE.Clock();

      onMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        pendingTouch = {
          x: (e.clientX - rect.left) / container.clientWidth,
          y: 1 - (e.clientY - rect.top) / container.clientHeight
        };
      };

      onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
        const vs = getViewSize();
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
      };

      container.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", onResize);

      if (isVisible) tick();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!renderer) init();
          else if (!animId) tick();
        } else if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (onMouseMove) container.removeEventListener("mousemove", onMouseMove);
      if (onResize) window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      }
    };
  }, [dark]);

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />;
}
