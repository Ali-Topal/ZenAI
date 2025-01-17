import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const noise = `
// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}`;

class Landscape extends THREE.Mesh {
  constructor() {
    let g = mergeGeometries([
      new THREE.PlaneGeometry(1, 1, 250, 500),
      new THREE.PlaneGeometry(1, 1, 250, 500)
    ], true).rotateX(Math.PI * -0.5);
    
    let ms = Array.from({length: 2}, (_, idx) => {
      let m = new THREE.MeshBasicMaterial({
        color: idx < 0.5 ? 0x000000 : 0xffffff,
        side: idx < 0.5 ? THREE.FrontSide : THREE.BackSide,
        onBeforeCompile: shader => {
          shader.uniforms.time = gu.time;
          shader.uniforms.hasShift = {value: idx};
          shader.vertexShader = `
            uniform float hasShift;
            uniform float time;
            
            varying float river;
            varying float vHasShift;
            
            ${noise}
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
            
              vHasShift = hasShift;
              
              float t = time * PI;
              
              vec3 pos = vec3(modelMatrix * vec4(position, 1));
              
              float treeNoise = abs(snoise((pos.xz - vec2(0., t)) * 0.25));
              treeNoise = pow(treeNoise, 0.5);
              
              float riverNoise = snoise(vec2(0, pos.z - t) * 0.05);
              riverNoise = smoothstep(5., 7., abs(pos.x + riverNoise * 2.5));
              
              transformed.y += treeNoise * 2.5 * riverNoise;
              transformed.y += hasShift * 0.05;
              
              river = riverNoise;
            `
          );
          
          shader.fragmentShader = `
            varying float vHasShift;
            varying float river;
            
            ${shader.fragmentShader}
          `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            
            diffuseColor.rgb = vHasShift < 0.5 && river < 0.01 ? vec3(1) : diffuseColor.rgb;
            `
          );
        }
      });
      return m;
    });
    
    super(g, ms);
    this.scale.set(50, 1, 50);
  }
}

class Sun extends THREE.Mesh {
  constructor() {
    let g = new THREE.PlaneGeometry(50, 50);
    let m = new THREE.MeshBasicMaterial({
      color: "red",
      onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.fragmentShader = `
          uniform float time;
          ${shader.fragmentShader}
        `.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
            
            vec2 lUv = (vUv - 0.5) * 2.;
            float val = 0.;
            float lenUv = length(lUv);
            float tShift = fract(time * 0.5);
            val = max(val, 1. - step(0.3, lenUv)); // central circle
            val = max(val, step(0.3 + (tShift * 0.7), lenUv) - step(0.35 + (tShift * 0.65), lenUv)); // ripple
            
            val = 1. - min(val, step(0.025, lUv.y));
            val = min(val, step(0.05, lUv.y));
            
            diffuseColor.rgb = vec3(val);
          `
        );
      }
    });
    m.defines = {"USE_UV": ""};
    super(g, m);
    this.position.z = -25;
  }
}

// Add color tracking functionality
function updateTextColor() {
  const heroText = document.querySelector('.hero h1');
  if (!heroText) return;
  
  // Get the camera's position relative to the landscape
  const cameraY = camera.position.y;
  const landscapeY = landscape.position.y;
  
  // If camera is below the landscape, background appears white
  if (cameraY < landscapeY + 2) {
    heroText.style.color = '#000000';
  } else {
    heroText.style.color = '#ffffff';
  }
}

let gu = {
  time: {
    value: 0
  }
};

let dpr = Math.min(devicePixelRatio, 1);
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
let camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0.25, 1).setLength(30);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth * dpr, innerHeight * dpr);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth * dpr, innerHeight * dpr);
});

let controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

let light = new THREE.DirectionalLight(0xffffff, Math.PI);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, Math.PI * 0.5));

let landscape = new Landscape();
scene.add(landscape);
let sun = new Sun();
scene.add(sun);

let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  t += dt;
  gu.time.value = t;
  controls.update();
  renderer.render(scene, camera);
  updateTextColor(); // Add color update to animation loop
}); 