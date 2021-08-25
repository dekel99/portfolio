import * as THREE from 'three'
import * as dat from 'dat.gui'  
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SMAAPass }  from 'three/examples/jsm/postprocessing/SMAAPass';
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three/src/loaders/TextureLoader.js"
import { Lensflare, LensflareElement } from './lensflare.js'
import { WebGLRenderer } from 'three';
import { animate } from './animate';
import Stats from 'stats.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { DeviceOrientationControls } from '../node_modules/three/examples/jsm/controls/DeviceOrientationControls'
import './style.css'

// Show fps config
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

let sun3
let astronaut
let mars
let barProgress = 0
let jsLogo
let mobileControls
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
const backgroundMobileTexture = textureLoader.load("/textures/8k_stars_milky_way-mobile.jpg")
const marsBackgroundTexture = textureLoader.load("/textures/mars-sky.jpg")
const marsBackgroundMobileTexture = textureLoader.load("/textures/mars-sky-mobile.jpg")
const picerImgTexture = textureLoader.load("/textures/picer-flag.jpeg")
const sapochatImgTexture = textureLoader.load("/textures/sapochat-flag.jpeg")
const aboutMeImgTexture = textureLoader.load("/textures/about-me-flag.jpg")



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

    mars.position.set(1,1,1)
    setTimeout(() => {
        mars.position.set(20.5,-15,20)
    }, 300);
    scene.add( mars )
})
GLTFloader.load("/textures/spaceship/scene.gltf", function(gltf){
    let spaceship = gltf.scene

    spaceship.traverse( function(children) {
        if (children.isMesh){
            let spaceshipMaterial = children.material 
            spaceshipMaterial.polygonOffset = true
            spaceshipMaterial.polygonOffsetUnits = -100000
            spaceshipMaterial.polygonOffsetFactor = -100000
        }
    });

    spaceship.scale.set(0.2,0.2,0.2)
    spaceship.rotation.y = 1.57
    spaceship.position.set(25,24.92,0.1)
    scene.add( spaceship )

    const spaceshipFolder = gui.addFolder("spaceship")
    spaceshipFolder.add(spaceship.position,"x").min(24).max(26).step(0.01)
    spaceshipFolder.add(spaceship.position,"y").min(24).max(26).step(0.01)
    spaceshipFolder.add(spaceship.position,"z").min(-1).max(1).step(0.01)
    spaceshipFolder.add(spaceship.rotation,"y").min(1).max(2).step(0.01)
    spaceshipFolder.add(spaceship.rotation,"z").min(0).max(3).step(0.01)
    spaceshipFolder.add(spaceship.rotation,"x").min(0).max(3).step(0.01)


})
// GLTFloader.load("/textures/3d-logos/mongoDB-logo.glb", function(gltf){
//     jsLogo = gltf.scene
//     jsLogo.scale.set(0.1, 0.1, 0.1)
//     jsLogo.position.set(8.7,-9.6,24.6)
//     jsLogo.rotation.z = (1)
//     jsLogo.rotation.x = (1.55)
//     // scene.add( jsLogo )
// })

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

//----------------------------- Geometry -----------------------------------
const geometry = new THREE.SphereBufferGeometry(1,60,60)
const moonGeometry = new THREE.SphereBufferGeometry(0.5,40,40)
const blackSphereGeometry = new THREE.SphereBufferGeometry(3,30,30)
const poleGeometry = new THREE.CylinderGeometry(0.008,0.008,1.1,16,1);
const flagGeometry = new THREE.PlaneGeometry(sizeW,sizeH,segW,segH);


//----------------------------- Materials ----------------------------------
const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture,})
const moonMaterial = new THREE.MeshStandardMaterial({map: moonTexture})
const blackSphereMaterial = new THREE.MeshBasicMaterial()
const poleMaterial = new THREE.MeshPhongMaterial();
const flagMaterial = new THREE.MeshLambertMaterial({map: picerImgTexture});
const flag2Material =  new THREE.MeshLambertMaterial({map: sapochatImgTexture});
const flag3Material =  new THREE.MeshLambertMaterial({map: aboutMeImgTexture});


// picer flag material config
flagMaterial.color = new THREE.Color(0xC1C1C1)

// sapochat flag material config
flag2Material.color = new THREE.Color(0xC1C1C1)

// about me flag material config
flag3Material.color = new THREE.Color(0xC1C1C1)

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
const aboutMeFlag = new THREE.Mesh(flagGeometry,flag3Material);
const picerPole = new THREE.Mesh(poleGeometry,poleMaterial)
const sapochatPole = picerPole.clone()
const aboutMePole = picerPole.clone()

// earthMaterial.polygonOffset = true
// earthMaterial.polygonOffsetUnits = -10000
// earthMaterial.polygonOffsetFactor = -10000

scene.add(picerFlag)
scene.add(sapochatFlag)
scene.add(aboutMeFlag)
scene.add(picerPole)
scene.add(sapochatPole)
scene.add(aboutMePole)
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
light2Folder.add(pointlight2.position,"x").min(-80).max(80).step(0.01)
light2Folder.add(pointlight2.position,"y").min(-80).max(80).step(0.01)
light2Folder.add(pointlight2.position,"z").min(-80).max(80).step(0.01)
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
light3Folder.add(pointlight3.position,"x").min(-80).max(80).step(0.01)
light3Folder.add(pointlight3.position,"y").min(-80).max(80).step(0.01)
light3Folder.add(pointlight3.position,"z").min(-80).max(80).step(0.01)
light3Folder.add(pointlight3,"intensity").min(0).max(10).step(0.01)

const light3Color = { color: 0xff0000}
light3Folder.addColor(light3Color, "color")
    .onChange(() => {
        pointlight3.color.set(light3Color.color)
    })

//Lensflare
const lensflare = new Lensflare();
let sunMainFlare = new LensflareElement( textureFlare0, 700, 0 )
lensflare.addElement( sunMainFlare );
lensflare.addElement( new LensflareElement( textureFlare1, 60, 0.6 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 70, 0.7 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 120, 0.9 ) );
lensflare.addElement( new LensflareElement( textureFlare1, 70, 1 ) );
pointlight1.add( lensflare )

//------------------------------- Window size ---------------------------------

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

    // Update composer
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.setSize(sizes.width, sizes.height)
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
controls.enabled = false
// let controls
// ------------------------------- Renderer ---------------------------------------
 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.initTexture(mars)

// -------------------------------user data-------------------------------------

picerFlag.userData = {name: "picer-flag"}
sapochatFlag.userData = {name: "sapochat-flag"}
aboutMeFlag.userData = {name: "about-me-flag"}

//---------------------------------position----------------------------------

earth.position.set(-0.7,-0.5,0)
moon.position.set(4,1,4)
blackSphere.position.set(8.2,-9.2,25)

picerPole.position.set(8.515,-9.98,24.09)
picerFlag.position.set(8.6,-9.6,24.3)
picerFlag.rotation.y = -1.2

sapochatPole.position.set(11.865,-10.18,19.69)
sapochatFlag.position.set(11.95,-9.8,19.9)
sapochatFlag.rotation.y = -1.2

aboutMePole.position.set(16.865,-9.18,16.69)
aboutMeFlag.position.set(17.15,-7.85,17.43)
aboutMeFlag.rotation.y = -1.2
aboutMeFlag.scale.set(3.5,3.5,3.5)
aboutMePole.scale.set(3.5,3.5,3.5)

// JS breakpoints 
if(window.innerWidth<800){
    camera.position.set(-0.7, 0.18, 2.7)
    camera.lookAt(0,0.5,0)
    scene.background = backgroundMobileTexture
    sunMainFlare.size = 500
    // mobileControls = new DeviceOrientationControls(camera)
} else if (window.innerWidth<1500){}

// Active only when test on mars
// controls.target = new THREE.Vector3(18,-13,20)
// camera.position.set(5.3,-8,26)
// camera.lookAt(new THREE.Vector3(18,-13,20))
// scene.background = marsBackgroundTexture
// pointlight1.intensity = 1
// pointlight3.intensity = 1.8
// pointlight3.position.set(-11, 20, 20)
// blackSphere.position.set(1,1,1)

//------------------------------- Paricles ---------------------------------
let starGeo
let stars

// Geometry
starGeo = new THREE.BufferGeometry()
const startsCount = 1000

// Texture
let starTexture = textureLoader.load("/textures/particle.png")

// Stars material
let starMaterial = new THREE.PointsMaterial({
    color: "white",
    size: 0.01,
    alphaMap: starTexture,
    transparent: true,
    depthWrite: false
})

// Create array
const starsPositions = new Float32Array(startsCount * 3)

// Stars position
for ( let i = 0; i < startsCount; i++ ) {
    let i3 = i * 3
    starsPositions[i3] = (Math.random() - 0.5) * 3
    starsPositions[i3+1] = (Math.random() - 0.5) * 3
    starsPositions[i3+2] = (Math.random() - 0.5) * 12.4
}

// Push positions
starGeo.setAttribute( 'position', new THREE.BufferAttribute( starsPositions, 3 ) );

// Particles mesh
stars = new THREE.Points(starGeo, starMaterial)
stars.position.set(-0.5, 0.2, 5)
scene.add(stars)


//--------------------------------Post processing---------------------------------

// Render target
let RenderTargerClass = null

// if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2){
//     RenderTargerClass = THREE.WebGLMultisampleRenderTarget
//     console.log("using WebGLMultisampleRenderTarget")
// } else {
    RenderTargerClass = THREE.WebGLRenderTarget
    console.log("using WebGLRenderTarget")
// }

const renderTarget = new RenderTargerClass(
    800,
    600,
    {
        // minFilter: THREE.LinearFilter,
        // magFilter: THREE.LinearFilter,
        // format: THREE.RGBAFormat,
        // encoding: THREE.sRGBEncoding
    }
)

// Composer
const composer = new EffectComposer(renderer, renderTarget)
composer.addPass (new RenderPass(scene,camera))
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
composer.setSize(sizes.width, sizes.height)

// Passes
const bloomPass = new UnrealBloomPass({x: sizes.height, y: sizes.width}, 0.2, 0 ,0.5)
composer.addPass(bloomPass)

const afterImage = new AfterimagePass(0)
afterImage.enabled = false
composer.addPass(afterImage)

if (renderer.getPixelRatio() < 1.5){ // && !renderer.capabilities.isWebGL2){
    const smaaPass = new SMAAPass(sizes.width, sizes.height)
    composer.addPass(smaaPass)
    smaaPass.enabled = true
    console.log("SMAA enabled")
}

// gui
const bloomPassFolder = gui.addFolder("Effect")
bloomPassFolder.add(bloomPass,"strength").min(0).max(4).step(0.01)
bloomPassFolder.add(bloomPass,"threshold").min(0).max(4).step(0.01)
bloomPassFolder.add(bloomPass,"radius").min(-4).max(4).step(0.01)
bloomPassFolder.add(bloomPass.resolution,"x").min(0).max(2000).step(0.01)

// ---------------------------- Frame requests -----------------------------
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin();

    animate(clock,earth,moon,camera,astronaut,renderer,scene,mars,controls,mobileControls,blackSphere,pointlight1,pointlight2,pointlight3,marsBackgroundTexture,marsBackgroundMobileTexture,backgroundTexture,backgroundMobileTexture,jsLogo,bloomPass,afterImage,picerFlag,startsCount,starsPositions,stars,composer)

    // composer.render(scene, camera)

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()