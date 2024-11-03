import * as THREE from "three";
import { FlyControls } from 'three/addons/controls/FlyControls.js'

function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas as HTMLCanvasElement,
});


const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set( 0, 0, 10 );

const controls = new FlyControls( camera, renderer.domElement );
controls.movementSpeed = 100;
controls.rollSpeed = Math.PI / 6;
controls.autoForward = false;
controls.dragToLook = true;


const scene = new THREE.Scene();

scene.background = new THREE.Color("lightblue");

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function makeInstance(
  geometry: THREE.BufferGeometry,
  color: THREE.ColorRepresentation,
  x: number
) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}

const cubes = [
  makeInstance(geometry, "blue", 0),
  makeInstance(geometry, "blue", -2),
  makeInstance(geometry, "blue", 2),
];

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

renderer.render(scene, camera);

function render(time: number) {
  time *= 0.001; // convert time to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, ndx) => {
    const speed = 3;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);
  
  controls.update(0.01)

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

var floorTexture = new THREE.TextureLoader().load( '../public/tulip.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  //color: new THREE.Color("purple"),
  side: THREE.DoubleSide
});
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var mesh = new THREE.Mesh(floorGeometry, floorMaterial);
mesh.rotation.x = - Math.PI / 2;
mesh.position.y = -3;
mesh.receiveShadow = true;
scene.add( mesh );



