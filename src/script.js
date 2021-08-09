import * as THREE from 'three'
import * as dat from 'dat.gui'  
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three/src/loaders/TextureLoader.js"
import { Lensflare, LensflareElement } from './lensflare.js'
import { animate } from './animate';
import Stats from 'stats.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import './style.css'

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

var sun3
var astronaut
var mars
// var flag
// var flag2
// var flag3
// var flagMixer
// var flag2Mixer
var barProgress = 0
var jsLogo
const [sizeW,sizeH,segW,segH] = [0.45,0.3,20,10];

// Tweenjs improved fps
createjs.Ticker.timingMode = createjs.Ticker.RAF;

// Scene
const scene = new THREE.Scene()

// Loading
const loadingManager = new THREE.LoadingManager(
    () => {
        $('.enter-btn').css('opacity', '1')
        $('.earth-lottie').css('opacity', '0')
        $('.loading-heading').css('opacity', '0')
    },

    (itemUrl, itemsLoaded, itemsTotal) => {
        barProgress = itemsLoaded / itemsTotal * 100
        $('.loading-bar').css('width', `${barProgress}%`);
    }
)
const GLTFloader = new GLTFLoader(loadingManager);
const textureLoader = new TextureLoader(loadingManager)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/' );
GLTFloader.setDRACOLoader( dracoLoader );

const textureFlare0 = textureLoader.load( "/textures/lens-flare0.png" );
const textureFlare1 = textureLoader.load( "/textures/lens-flare1.png" );
const earthTexture = textureLoader.load("/textures/8k_earth_nightmap.jpg")
const moonTexture = textureLoader.load("/textures/8k_moon.jpg")
const backgroundTexture = textureLoader.load("/textures/8k_stars_milky_way.jpg")
const marsBackgroundTexture = textureLoader.load("/textures/mars-sky.jpg")
const picerImgTexture = textureLoader.load("/textures/picer-flag.jpeg")
const sapochatImgTexture = textureLoader.load("/textures/sapochat-flag.jpeg")


GLTFloader.load("/textures/astronaut/scene.gltf", function(gltf){
    astronaut = gltf.scene
    astronaut.scale.set(0.0001, 0.0001, 0.0001)
    astronaut.position.set(0.5,0.1,1.7)
    scene.add( astronaut )
})
GLTFloader.load("/textures/sun/scene.gltf", function(gltf){
    sun3 = gltf.scene
    sun3.position.set(3.2,2.05,-20)
    scene.add( sun3 )
})
GLTFloader.load("/textures/mars/scene.gltf", function(gltf){
    mars = gltf.scene
    mars.scale.set(0.71, 0.7, 0.7)
    mars.position.set(20.5,-15,20)
    scene.add( mars )
})
// GLTFloader.load("/textures/flag/scene.gltf", function(gltf){
//     flag = gltf.scene
//     // flag3 = gltf.scene.clone();
//     // console.log(flag3)

//     flag.scale.set(0.03, 0.03, 0.03)
//     flag.position.set(8.7,-10.5,24.5)
//     flag.rotation.y = 0.3
//     scene.add( flag )

//     // flag3.scale.set(0.03, 0.03, 0.03)
//     // flag3.position.set(8.7,-9.5,23.5)
//     // flag3.rotation.y = 0.3
//     // scene.add( flag3 )

//     flagMixer = new THREE.AnimationMixer( gltf.scene );
//     var action = flagMixer.clipAction( gltf.animations[0] );
// 	action.play();
// })
// GLTFloader.load("/textures/flag2/scene.gltf", function(gltf){
//     flag2 = gltf.scene
//     flag2.scale.set(0.03, 0.03, 0.03)
//     flag2.position.set(12,-10.8,20)
//     flag2.rotation.y = 0.3
//     scene.add( flag2 )

//     flag2Mixer = new THREE.AnimationMixer( gltf.scene );
//     var action = flag2Mixer.clipAction( gltf.animations[0] );
// 	action.play();
// })
GLTFloader.load("/textures/tech-used/JS_logo.glb", function(gltf){
    jsLogo = gltf.scene
    jsLogo.scale.set(0.1, 0.1, 0.1)
    jsLogo.position.set(8.7,-9.6,24.6)
    jsLogo.rotation.z = (1)
    jsLogo.rotation.x = (1.55)
    // scene.add( jsLogo )
})

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

//----------------------------- Geometry -----------------------------------
const geometry = new THREE.SphereBufferGeometry(1,60,60)
const moonGeometry = new THREE.SphereBufferGeometry(0.5,60,60)
const blackSphereGeometry = new THREE.SphereBufferGeometry(3,30,30)
const poleGeometry = new THREE.CylinderGeometry(0.008,0.008,1.1,16,1);
const flagGeometry = new THREE.PlaneGeometry(sizeW,sizeH,segW,segH);


//----------------------------- Materials ----------------------------------
const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture})
const moonMaterial = new THREE.MeshStandardMaterial({map: moonTexture})
const blackSphereMaterial = new THREE.MeshBasicMaterial()
const poleMaterial = new THREE.MeshPhongMaterial();
const flagMaterial = new THREE.MeshLambertMaterial({map: picerImgTexture});
const flag2Material =  new THREE.MeshLambertMaterial({map: sapochatImgTexture});

// picer flag material config
flagMaterial.color = new THREE.Color(0xC1C1C1)

// sapochat flag material config
flag2Material.color = new THREE.Color(0xC1C1C1)

// picerPole material config
poleMaterial.color = new THREE.Color(0x282828)
poleMaterial.specular = new THREE.Color(0x282828)
poleMaterial.shininess = 30

// black sphere material config
blackSphereMaterial.color = new THREE.Color(0x0)

// moon material config 
moonMaterial.color = new THREE.Color(0x282828)

// earth gui
const earthMaterialFolder = gui.addFolder("Earth materiel")
earthMaterialFolder.add(earthMaterial, "metalness")
earthMaterialFolder.add(earthMaterial, "roughness")

const materialColor = { color: 0xff0000}
earthMaterialFolder.addColor(materialColor, "color")
    .onChange(() => {
        earthMaterial.color.set(materialColor.color)
    })


// moon gui
const moonMaterialFolder = gui.addFolder("Moon materiel")
const moonMaterialColor = { color: 0xff0000}
moonMaterialFolder.addColor(moonMaterialColor, "color")
    .onChange(() => {
        moonMaterial.color.set(moonMaterialColor.color)
    })
//-------------------------------- Mesh -------------------------------------
const earth = new THREE.Mesh(geometry,earthMaterial)
const moon = new THREE.Mesh(moonGeometry,moonMaterial)
const blackSphere = new THREE.Mesh(blackSphereGeometry,blackSphereMaterial)
const picerFlag = new THREE.Mesh(flagGeometry,flagMaterial);
const sapochatFlag = new THREE.Mesh(flagGeometry,flag2Material);
const picerPole = new THREE.Mesh(poleGeometry,poleMaterial)
const sapochatPole = picerPole.clone()


scene.add(picerFlag)
scene.add(sapochatFlag)
scene.add(picerPole)
scene.add(sapochatPole)
scene.add(earth)
scene.add(moon)
scene.add(blackSphere)
scene.background = backgroundTexture

// -----------------------------Lights----------------------------------

//**** Light 1 (sunlight)****
const pointlight1 = new THREE.PointLight(0xffffff, 4)
pointlight1.position.set(2.95,2.2,-18.9)
scene.add(pointlight1)

// gui
const light1Folder = gui.addFolder("Light 1")
light1Folder.add(pointlight1.position,"x").min(-20).max(20).step(0.01)
light1Folder.add(pointlight1.position,"y").min(-20).max(20).step(0.01)
light1Folder.add(pointlight1.position,"z").min(-20).max(20).step(0.01)
light1Folder.add(pointlight1,"intensity").min(0).max(10).step(0.01)

const light1Color = { color: 0xff0000}
light1Folder.addColor(light1Color, "color")
    .onChange(() => {
        pointlight1.color.set(light1Color.color)
    })

const pointLightHelper = new THREE.PointLightHelper(pointlight1, 1.5)
// scene.add(pointLightHelper)

//**** Light 2 ****
const pointlight2 = new THREE.PointLight(0xffffff, 1.5)
pointlight2.position.x = 1.47
pointlight2.position.y = 1
pointlight2.position.z = 2.2
scene.add(pointlight2)

// gui
const light2Folder = gui.addFolder("Light 2")
light2Folder.add(pointlight2.position,"x").min(-6).max(6).step(0.01)
light2Folder.add(pointlight2.position,"y").min(-6).max(6).step(0.01)
light2Folder.add(pointlight2.position,"z").min(-6).max(6).step(0.01)
light2Folder.add(pointlight2,"intensity").min(0).max(10).step(0.01)

const light2Color = { color: 0xffffff}
light2Folder.addColor(light2Color, "color")
    .onChange(() => {
        pointlight2.color.set(light2Color.color)
    })

const pointLightHelper2 = new THREE.PointLightHelper(pointlight2, 1)
// scene.add(pointLightHelper2)

//**** Light 3 ****
const pointlight3 = new THREE.PointLight(0xffffff, 4)
pointlight3.position.x = 3
pointlight3.position.y = 2
pointlight3.position.z = -2
scene.add(pointlight3)

// gui
const light3Folder = gui.addFolder("Light 3")
light3Folder.add(pointlight3.position,"x").min(-40).max(40).step(0.01)
light3Folder.add(pointlight3.position,"y").min(-40).max(40).step(0.01)
light3Folder.add(pointlight3.position,"z").min(-40).max(40).step(0.01)
light3Folder.add(pointlight3,"intensity").min(0).max(10).step(0.01)

const light3Color = { color: 0xff0000}
light3Folder.addColor(light3Color, "color")
    .onChange(() => {
        pointlight3.color.set(light3Color.color)
    })

// Light 4 (Mars light)
// const marsLight = new THREE.RectAreaLight( 0xffffff, 1, 10, 10);
// marsLight.position.set( 6, 0 ,22 );
// marsLight.intensity = 10
// marsLight.lookAt(20.5,-15,20 )

// // scene.add( marsLight );
// // scene.add( marsLight.target );

// // light helper
// const marsLightHelper = new THREE.PointLightHelper(marsLight)
// // scene.add( marsLightHelper );

// // gui
// const light4Folder = gui.addFolder("Mars Light")
// light4Folder.add(marsLight.position,"x").min(-10).max(50).step(0.01)
// light4Folder.add(marsLight.position,"y").min(-10).max(50).step(0.01)
// light4Folder.add(marsLight.position,"z").min(-10).max(50).step(0.01)
// light4Folder.add(marsLight,"intensity").min(0).max(50).step(0.01)


//Lensflare


const lensflare = new Lensflare();
lensflare.addElement( new LensflareElement( textureFlare0, 700, 0 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 60, 0.6 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 70, 0.7 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 120, 0.9 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 70, 1 ) );
pointlight1.add( lensflare )

//-------------------------------END LIGHTS---------------------------------

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//-------------------------------- Camera --------------------------------
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-0.5, 0.2, 2)
scene.add(camera)

// gui 
const cameraFolder = gui.addFolder("Camera")
cameraFolder.add(camera.position,"x").min(-50).max(50).step(0.01)
cameraFolder.add(camera.position,"y").min(-50).max(50).step(0.01)
cameraFolder.add(camera.position,"z").min(-50).max(50).step(0.01)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// -------------------------------user data-------------------------------
picerFlag.userData = {name: "picer-flag"}
sapochatFlag.userData = {name: "sapochat-flag"}

//---------------------------------position----------------------------------
earth.position.set(-0.7,-0.5,0)
moon.position.set(4,1,4)
blackSphere.position.set(8.2,-9.2,25)
picerPole.position.set(8.515,-9.98,24.09)
picerFlag.position.set(8.6,-9.6,24.3)
picerFlag.rotation.y = -1.2

sapochatPole.position.set(11.915,-10.18,19.59)
sapochatFlag.position.set(12,-9.8,19.8)
sapochatFlag.rotation.y = -1.2

// JS breakpoints 
if(window.innerWidth<800){
    camera.position.set(-0.7, 0.13, 3)
    camera.lookAt(0,0.5,0)
} else if (window.innerWidth<1500){

}

// Active only when test on mars
// controls.target = new THREE.Vector3(18,-13,20);
// camera.position.set(5.3,-8,26)
// camera.lookAt(new THREE.Vector3(18,-13,20))
// scene.background = marsBackgroundTexture
// pointlight1.intensity = 1
// pointlight3.intensity = 1.8
// pointlight3.position.set(-11, 20, 20)
// blackSphere.position.set(1,1,1)

//--------------------------------END CAMERA---------------------------------
// event listener
const h = 0.4
const v = 0.5
const w = 0.2
const s = 0.9


const positionAttribute = picerFlag.geometry.getAttribute( 'position' );
const vertex = new THREE.Vector3();
// vertex.fromBufferAttribute( positionAttribute, [3] )
// console.log(positionAttribute)

const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin();

    animate(clock,earth,moon,camera,astronaut,renderer,scene,mars,controls,blackSphere,pointlight1,pointlight3,marsBackgroundTexture,jsLogo)

    // Play flag animation
    // var delta = clock.getDelta() * 10;
    // if ( flagMixer ) flagMixer.update( delta )
    // if ( flag2Mixer ) flag2Mixer.update( delta )
    // if ( newFlagMixer ) newFlagMixer.update ( delta )

    for (let y=0; y<segH+1; y++) {
        for (let x=0; x<segW+1; x++) {
            const index = x + y * (segW+1);
            vertex.fromBufferAttribute( positionAttribute, index )
            const time = Date.now() * s / 50;
            vertex.z = Math.sin(h * x + v * y - time) * w * x / 100
            picerFlag.geometry.attributes.position.setZ(index, vertex.z)
        }
    }
    picerFlag.geometry.attributes.position.needsUpdate = true;
    picerFlag.geometry.computeVertexNormals();
    
    renderer.render(scene, camera)

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()