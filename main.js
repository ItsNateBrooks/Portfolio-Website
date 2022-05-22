import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

let state = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,6.5,-6.5);
camera.lookAt(0, 5, -12.8);



const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);

pointLight.position.set(25,25,25);
scene.add(pointLight);


const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper);

const nateTexture = new THREE.TextureLoader().load('Nate.jpg');
const nate = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 1.25, 1.25),
  new THREE.MeshBasicMaterial({map:nateTexture})
);
nate.position.set(0, 5, -12.8);
scene.add(nate)

window.addEventListener('wheel', function(event){

  switch (state){
    case 0:
      if (!checkScrollDirectionIsUp(event)) {
        state = 1;
        scrollHelper(3,6.5,-8.25,7.5, 5, -8.25);
      }
    break
    case 1:
      if (checkScrollDirectionIsUp(event)) {
        state = 0;
        scrollHelper(0,6.5,-6.5,0, 5, -12.8);
      }else{
        state = 2;
        scrollHelper(-3,6.5,-8.25,-7.5, 5, -8.25);
      }  
    break
    case 2:
      if (checkScrollDirectionIsUp(event)) {
        state = 1;
        scrollHelper(3,6.5,-8.25,7.5, 5, -8.25);
      }else{
        state = 3;
        scrollHelper(3,6.5,-1.95,7.5, 5, -1.95);
      }  
    break
    case 3:
      if (checkScrollDirectionIsUp(event)) {
        state = 2;
        scrollHelper(-3,6.5,-8.25,-7.5, 5, -8.25);
      }else{
        state = 4;
        scrollHelper(-3, 6.5, -1.95,-7.5, 5, -1.95);
      }
    break
    case 4:
      if (checkScrollDirectionIsUp(event)) {
        state = 3;
        scrollHelper(3,6.5,-1.95,7.5, 5, -1.95);
      }
    break
    }
  
});

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


function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}

function createPathStrings(filename) {
  const basePath = "Clouds/";
  const baseFilename = basePath + filename;
  const fileType = ".jpg";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
  const pathStings = sides.map(side => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStings;
}

function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

let skyboxImage = "bluecloud";
const materialArray = createMaterialArray(skyboxImage);
const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

const loader = new GLTFLoader()
loader.load('Assets/scene.gltf', function(gltf){
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