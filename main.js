import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

//setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,6.5,-8.8);
camera.lookAt(0, 5, -12.8);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

//Setup light, light helper, and grid helper
const pointLight = new THREE.PointLight(0xffffff);

pointLight.position.set(25,25,25);
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper);//, gridHelper

//Camera Control
let state = 0;
window.addEventListener('wheel', function(event){

  switch (state){
    case 0:
      if (!checkScrollDirectionIsUp(event) && !subState) {
        state = 1;
        scrollHelper(3,6.5,-8.25,7.5, 5, -8.25);
      }
    break
    case 1:
      if (checkScrollDirectionIsUp(event)&& !subState) {
        state = 0;
        scrollHelper(0,6.5,-8.8,0, 5, -12.8);
      }else{
        state = 2;
        scrollHelper(-3,6.5,-8.25,-7.5, 5, -8.25);
      }  
    break
    case 2:
      if (checkScrollDirectionIsUp(event)&& !subState) {
        state = 1;
        scrollHelper(3,6.5,-8.25,7.5, 5, -8.25);
      }else{
        state = 3;
        scrollHelper(3,6.5,-1.95,7.5, 5, -1.95);
      }  
    break
    case 3:
      if (checkScrollDirectionIsUp(event)&& !subState) {
        state = 2;
        scrollHelper(-3,6.5,-8.25,-7.5, 5, -8.25);
      }else{
        state = 4;
        scrollHelper(-3, 6.5, -1.95,-7.5, 5, -1.95);
      }
    break
    case 4:
      if (checkScrollDirectionIsUp(event)&& !subState) {
        state = 3;
        scrollHelper(3,6.5,-1.95,7.5, 5, -1.95);
      }
    break
    }
  
});

let subState = false;
window.addEventListener('mousedown', function(event){

  switch (state){
    case 0:
      if (subState) {
        subState = false;
        scrollHelper(0,6.5,-8.8,0, 5, -12.8);
      }else{
        subState = true;
        scrollHelper(1.5, 5, -11.8,1.5, 5, -12.8);
      }
    break/*
    case 1:
      if (subState) {
        state = 0;
        scrollHelper(0,6.5,-8.8,0, 5, -12.8);
      }else{
        state = 2;
        scrollHelper(-3,6.5,-8.25,-7.5, 5, -8.25);
      }  
    break
    case 2:
      if (subState) {
        state = 1;
        scrollHelper(3,6.5,-8.25,7.5, 5, -8.25);
      }else{
        state = 3;
        scrollHelper(3,6.5,-1.95,7.5, 5, -1.95);
      }  
    break
    case 3:
      if (subState) {
        state = 2;
        scrollHelper(-3,6.5,-8.25,-7.5, 5, -8.25);
      }else{
        state = 4;
        scrollHelper(-3, 6.5, -1.95,-7.5, 5, -1.95);
      }
    break
    case 4:
      if (subState) {
        state = 3;
        scrollHelper(3,6.5,-1.95,7.5, 5, -1.95);
      }
    break*/
    }
  
});

// Helper function for Camera Controls
function scrollHelper(pox,poy,poz,lax,lay,laz) {
  gsap.to(camera.position, {
    x: pox,
    y: poy,
    z: poz,
    duration: 1,
    onUpdate: function(){
      camera.lookAt(lax, lay, laz);
    }
  });
}

// Helper function to check if user is scrolling up or down with mouse wheel
function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}

//Nate Object (object with my face on it) loading
const nateTexture = new THREE.TextureLoader().load('Nate.jpg');
const nate = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 1.25, 1.25),
  new THREE.MeshBasicMaterial({map:nateTexture})
);
nate.position.set(0, 5, -12.8);
scene.add(nate)

//Text loading

//Adds skybox
let skyboxImage = "bluecloud";
const materialArray = createMaterialArray(skyboxImage);
const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

//Skybox helper to load sky assets
function createPathStrings(filename) {
  const basePath = "Assets/clouds/";
  const baseFilename = basePath + filename;
  const fileType = ".jpg";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
  const pathStings = sides.map(side => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStings;
}

//Skybox helper to create geometry
function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}


//Loads room 3d model
const roomloader = new GLTFLoader()
roomloader.load('Assets/models/building/scene.gltf', function(gltf){
  console.log(gltf)
  const root = gltf.scene;
  root.castShadow = true;
  root.receiveShadow = false;
  root.scale.set(0.05,0.05,0.05)
  scene.add(root)
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + + "% loaded")
}, function(error){
  console.log("An error occurred")
})

//frame 3d model
//======================================
const frameloader = new GLTFLoader()
frameloader.load('Assets/models/frame/scene.gltf', function(gltf){
  console.log(gltf)
  const root = gltf.scene;
  root.castShadow = true;
  root.receiveShadow = false;
  root.position.set(1.5, 5, -12.8);
  root.rotation.z = 51.8355;
  root.scale.set(0.5,0.5,0.5)
  scene.add(root)
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + + "% loaded")
}, function(error){
  console.log("An error occurred")
})

//first myInfo Object (object with my name and contact info) loading 
const myInfoTexture = new THREE.TextureLoader().load('Assets/myInfo/myInfo1.PNG');
const myInfo = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 1.25, 1.25),
  new THREE.MeshBasicMaterial({map:myInfoTexture})
);
myInfo.scale.set(0.8,0.6 ,0)
myInfo.position.set(1.5, 5, -12.8);
scene.add(myInfo)

//Animate or Loop function
function animate(){
  requestAnimationFrame(animate);

  nate.rotation.y += 0.005;
  skybox.rotation.y += 0.0001;

  renderer.render(scene,camera);
}

animate()


/*
//REMOVED FEATURES
//Orbital Controls
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 5, -12.8);

//inside animate() - STILL Orbital Controls
//controls.update();

//Ambient Light
//const ambientLight = new THREE.AmbientLight(0xffffff);

//Misc Features made while learning Three.js
//Donut
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial( {color: 0xFF6348});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus)

//Stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}
Array(200).fill().forEach(addStar)

//Coords for camera positions and lookats
camera.position.set(0,6.5,-6.5);    - 0
camera.position.set(3,6.5,-8.25);   - 1 
camera.position.set(-3,6.5,-8.25);  - 2
camera.position.set(3,6.5,-1.95);   - 3
camera.position.set(-3, 6.5, -1.95);- 4

camera.lookAt(0, 5, -12.8);   - 0
camera.lookAt(7.5, 5, -8.25); - 1
camera.lookAt(-7.5, 5, -8.25);- 2
camera.lookAt(7.5, 5, -1.95); - 3
camera.lookAt(-7.5, 5, -1.95);- 4
*/