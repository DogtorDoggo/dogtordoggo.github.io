import * as THREE from 'three';

// https://dustinpfister.github.io/2022/06/17/threejs-curve/

const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS, 2: MB (memory)
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
const CAMERA_POSITION = 50;
camera.position.set(CAMERA_POSITION, CAMERA_POSITION, CAMERA_POSITION);
// camera.position.z += CAMERA_POSITION / 2;
camera.up.set(0, 0, 1); // make default coordinate z-up
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );



const axesHelper = new THREE.AxesHelper(CAMERA_POSITION * 1.2); // Creates axes with a length of 5 units
scene.add(axesHelper);

// curve 1
const points = [];
const curve = new THREE.CatmullRomCurve3( points );


// Lorenzo Attractor curve

const lorenzoPoints = [new THREE.Vector3(
  Math.random() * 3,
  Math.random() * 3,
  Math.random() * 3
)];
const lorenzoCurve = new THREE.CatmullRomCurve3( lorenzoPoints );


//
let t = 0;
const STEP_SIZE = 0.01;

function animate() {
  // requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  stats.begin();
  
  // curve 1
  points.push(verticalCurve(2, t / 2));
  t += STEP_SIZE;
  const curveGeometry = new THREE.BufferGeometry();
  curveGeometry.setFromPoints(points);
  scene.add(new THREE.Points(curveGeometry, new THREE.PointsMaterial({color: 0xff00ff, size: 0.1 })))
  
  // Lorenzo Attractor curve
  let prevPoint = lorenzoPoints.at(-1);
  let newPoint = lorenzoAttractor(10, 28, 8/3, prevPoint);
  lorenzoPoints.push(newPoint);
  const lorenzoCurveGeometry = new THREE.BufferGeometry();
  lorenzoCurveGeometry.setFromPoints(lorenzoPoints);
  scene.add(new THREE.Points(lorenzoCurveGeometry, new THREE.PointsMaterial({color: 0xff00ff, size: 0.1 })));


  camera.position.x = CAMERA_POSITION * Math.cos(t / 5);
  camera.position.y = CAMERA_POSITION * Math.sin(t / 5);
  camera.lookAt(0, 0, 0);


  stats.end();
  renderer.render( scene, camera );

}

function verticalCurve(radius, t) {
  return new THREE.Vector3(radius * Math.cos(t), radius * Math.sin(t), t);
}

function lorenzoAttractor(alpha, rho, beta, prevPoint){
  // prevPoint is THREE.Vector3
  // typical set of params for Lorenzo Attractor
  // alpha = 10;
  // rho = 28;
  // beta = 8 / 3;

  // simple Euler method
  let x = alpha * (prevPoint.y - prevPoint.x) * STEP_SIZE + prevPoint.x;
  let y = (prevPoint.x * (rho - prevPoint.z) - prevPoint.y) * STEP_SIZE + prevPoint.y;
  let z = (prevPoint.x * prevPoint.y - beta * prevPoint.z) * STEP_SIZE + prevPoint.z;

  return new THREE.Vector3(x, y, z);

}