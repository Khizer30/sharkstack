import { useEffect, useRef } from "react";
import * as THREE from "three";
import { colors } from "@/constants/colors";

const hexToVec3 = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uAmbient;
  uniform vec3 uAccent;
  uniform bool uDisableCenterDimming;
  varying vec2 vUv;

  #define t uTime
  mat2 m(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  float map(vec3 p) {
    p.xz *= m(t * 0.4);
    p.xy *= m(t * 0.3);
    vec3 q = p * 2. + t;
    return length(p + vec3(sin(t * 0.7))) * log(length(p) + 1.0)
         + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
  }

  void main() {
    vec2 fragCoord = vUv * uResolution;
    vec2 uv = fragCoord / min(uResolution.x, uResolution.y) - vec2(.9, .5);
    uv.x += .4;
    vec3 col = vec3(0.0);
    float d = 2.5;

    for (int i = 0; i <= 5; i++) {
      vec3 p = vec3(0, 0, 5.) + normalize(vec3(uv, -1.)) * d;
      float rz = map(p);
      float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

      vec3 base = uAmbient + uAccent * f * 5.0;
      col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
      d += min(rz, 1.0);
    }

    float dist = distance(fragCoord, uResolution * 0.5);
    float radius = min(uResolution.x, uResolution.y) * 0.5;
    float dim = uDisableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

    vec3 result = col;
    if (!uDisableCenterDimming) {
      result = mix(col * 0.3, col, dim);
    }

    gl_FragColor = vec4(result, 1.0);
  }
`;

export default function InteractiveNebulaShader({ disableCenterDimming = false, fixed = false, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2() },
      uAmbient: { value: hexToVec3(colors.bgBrand) },
      uAccent: { value: hexToVec3(colors.primary) },
      uDisableCenterDimming: { value: disableCenterDimming }
    };

    const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    const onMouseMove = (e) => {
      uniforms.uMouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    onResize();

    const renderFrame = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        renderer.setAnimationLoop(entry.isIntersecting ? renderFrame : null);
      },
      { rootMargin: "300px" }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      container.removeChild(renderer.domElement);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [disableCenterDimming]);

  return (
    <div
      ref={containerRef}
      className={`${fixed ? "fixed" : "absolute"} inset-0 ${className}`}
      style={{ background: colors.bgBrand }}
      aria-label="Interactive nebula background"
    />
  );
}
