import "./style.css";
import * as THREE from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let pages = {
  donate: { name: 'donate-page', buttons: ['donate-button-text', 'donate-button-footer'], target: { x: 10, y: 30, z: -18 } },
  contact: { name: 'contact-page', buttons: ['contact-button', 'contact-button-text', 'contact-button-footer'], target: { x: 20, y: 25, z: -15 } },
  team: { name: 'team-page', buttons: ['team-button', 'team-button-text', 'team-button-footer'], target: { x: -10, y: -30, z: 18 } },
  home: {
    name: 'home-page',
    buttons: ['home-button', 'home-button-footer'],
    target: { x: 0, y: 0, z: 0 },
    endRotation: new THREE.Euler(0, 0, 0, 'XYZ')
  },
}

let pageCounter = {};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

// Window Resize
window.addEventListener('resize', reportWindowSize);

function reportWindowSize() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Transition Function
function doTransition(homePage, contactPage, back) {
  let times = 0;
  let times2 = 0;
  window.scrollBy(0, -10000);
  homePage.addEventListener("animationend", () => {
    if (times === 0) {
      homePage.classList.remove('fade-out');
      if (back === false) {
        contactPage.style.cssText = '';
      } else {
        contactPage.style.cssText = '';
      }
      contactPage.classList.add('fade-in');

      if (back === false) {
        homePage.style.cssText = "display: none;"
      } else {
        homePage.style.cssText = "display: none;"
      }

      contactPage.addEventListener("animationend", () => {
        if (times2 === 0) {
          contactPage.classList.remove('fade-in');
          times2 += 1;
        }
      }, true);

      document.getElementById('body').appendChild(contactPage);
      times += 1;
    }

  }, true);

  homePage.classList.add('fade-out');
}

// Torus

const geometry = new THREE.TorusGeometry(10, 2, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

function addGeometry() {
  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
  const torus = new THREE.Mesh(geometry, material);
  torus.position.set(-10, -30, 18)

  scene.add(torus);
}

addGeometry();

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill(undefined, undefined, undefined)
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill(undefined, undefined, undefined).forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("https://2cousins.org/space.jpg");
scene.background = spaceTexture;

// Avatar

const logoTexture = new THREE.TextureLoader().load("https://2cousins.org/logo.png");

const logo = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: logoTexture })
);

logo.rotation.x += 20;
logo.rotation.y -= 20;
logo.rotation.z += 20;

scene.add(logo);

// Moon

const moonTexture = new THREE.TextureLoader().load("https://the-nova-system.github.io/extra-assets/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("https://the-nova-system.github.io/extra-assets/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 20;
moon.position.setX(-10);

logo.position.z = -5;
logo.position.x = 2;

// Scroll Animation

function getDocHeight() {
  const D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  );
}

function onMouseWheel(ev) {
  ev.preventDefault();
  const top = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  logo.rotation.y += 0.01;
  logo.rotation.z += 0.01;

  if (top < 0 && $(window).scrollTop() + $(window).height() < getDocHeight()) {
    if (location.hash.split('#')[1] === 'blog') {
      camera.position.x += ev.deltaY / 500;
      camera.rotation.y += ev.deltaY / -2000;
      camera.position.z += ev.deltaY / -100;
    } else {
      camera.position.x += ev.deltaY / 500;
      camera.rotation.y += ev.deltaY / 2000;
      camera.position.z += ev.deltaY / 100;
    }
  }
}

window.addEventListener('wheel', onMouseWheel, false);

// Page Load Function
window.onload = function() {
  for (const key in pages) {
    if (pages.hasOwnProperty(key)) {
      if (location.hash === '#' + key && location.hash !== '#home') {
        animateToPage(pages['home']['name'], pages[key]['name'], pages[key]['target'], key);
      }

      const buttonElements = pages[key]['buttons'];

      for (let i = 0; i < buttonElements.length; i++) {
        const buttonElement = document.getElementById(buttonElements[i]);

        buttonElement.onclick = function() {
          location.hash = '#' + key;
          return false;
        }
      }
    }
  }
}

// Animate to page

function animateToPage(input, output, target, name, finalRotation) { //'home-page', 'contact-page'
  if (pageCounter[name] === undefined) {
    pageCounter[name] = 0;
  }

  if (pageCounter[name] === -1) {
    pageCounter[name] = 0;
  } else {
    requestAnimationFrame(animateToPage.bind(this, input, output, target, name));

    if (pageCounter[name] === 0) {
      let back;
      back = name === 'home';
      doTransition(document.getElementById(input), document.getElementById(output), back);

      let position = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
      const tween = new TWEEN.Tween(position).to(target, 2000);
      tween.easing(TWEEN.Easing.Quadratic.InOut)
      tween.onUpdate(function() {
        camera.position.x = position.x;
        camera.position.y = position.y;
        camera.position.z = position.z;
      });


      let startRotation = new THREE.Euler().copy(camera.rotation);
      camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
      let endRotation;
      if (finalRotation === undefined) {
        endRotation = new THREE.Euler().copy(camera.rotation);
      } else {
        endRotation = finalRotation;
      }
      camera.rotation.copy(startRotation);
      const rotationTween = new TWEEN.Tween(startRotation).to({
        x: endRotation.x,
        y: endRotation.y,
        z: endRotation.z
      }, 2000);
      rotationTween.easing(TWEEN.Easing.Quadratic.InOut);
      rotationTween.onUpdate(function() {
        camera.rotation.x = startRotation.x;
        camera.rotation.y = startRotation.y;
        camera.rotation.z = startRotation.z;
      });

      tween.onComplete(function() {
        pageCounter[name] = -1;
        if (name === 'blog') {
          // fetchPosts();
        }
      });

      tween.start();
      rotationTween.start();
    }

    pageCounter[name] += 1;
    TWEEN.update();

    renderer.render(scene, camera);
  }
}

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // controls.update();

  renderer.render(scene, camera);
}

// handle user clicking back button on browser

let hashHistory = [window.location.hash]

if (hashHistory[0] === '') {
  hashHistory[0] = '#home';
}

window.onhashchange = function() {
  hashHistory.push(window.location.hash);
  console.log(hashHistory);
  console.log('hash boi changed');

  let previousPage = hashHistory[hashHistory.length - 2].substring(1) + '-page';
  let currentPage = hashHistory[hashHistory.length - 1].substring(1) + '-page';
  let key = hashHistory[hashHistory.length - 1].substring(1);

  if (previousPage !== currentPage) {
    animateToPage(previousPage, pages[key]['name'], pages[key]['target'], key, pages[key]['endRotation']);
  }
}


animate();
