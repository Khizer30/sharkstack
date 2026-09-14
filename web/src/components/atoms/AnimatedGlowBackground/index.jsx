import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { colors } from "@/constants/colors";

const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
    pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
    noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;

    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity * 0.15);

    float glow = 1.0 - length(uv - 0.5) * 1.4;
    glow = clamp(pow(max(glow, 0.0), 1.5), 0.0, 1.0);

    gl_FragColor = vec4(color, glow * 0.85 + 0.15);
  }
`;

function ShaderPlane({ color1, color2 }) {
  const mesh = useRef(null);
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: 1.0 },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) }
    }),
    [color1, color2]
  );

  useFrame((state) => {
    uniforms.time.value = state.clock.elapsedTime;
    uniforms.intensity.value = 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function EnergyRing({ radius = 1, position = [0, 0, 0], color = "#F05A28", speed = 1 }) {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * speed;
    mesh.current.material.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 3) * 0.12;
  });

  return (
    <mesh ref={mesh} position={position}>
      <ringGeometry args={[radius * 0.85, radius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ShaderPlane color1={colors.primary} color2={colors.secondary} />
      <EnergyRing radius={2.6} position={[0, 0, -0.1]} color={colors.primary} speed={0.25} />
      <EnergyRing radius={1.7} position={[0.6, 0.4, -0.2]} color={colors.primary} speed={-0.4} />
      <EnergyRing radius={3.4} position={[-0.4, -0.3, -0.3]} color={colors.secondary} speed={0.18} />
    </>
  );
}

export default function AnimatedGlowBackground({ style }) {
  return (
    <div style={{ width: "100%", height: "100%", ...style }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
