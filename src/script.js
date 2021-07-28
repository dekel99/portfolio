import * as THREE from 'three'
import * as dat from 'dat.gui'  
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three/src/loaders/TextureLoader.js"
import { Lensflare, LensflareElement } from './lensflare.js'
import { animate } from './animate';
import './style.css'

var sun3
var astronaut
var mars
createjs.Ticker.timingMode = createjs.Ticker.RAF;

// Scene
const scene = new THREE.Scene()

// Loading
const GLTFloader = new GLTFLoader();
const textureLoader = new TextureLoader()

const textureFlare0 = textureLoader.load( "/textures/lens-flare0.png" );
const textureFlare1 = textureLoader.load( "/textures/lens-flare1.png" );
const earthTexture = textureLoader.load("/textures/8k_earth_nightmap.jpg")
const sunTexture = textureLoader.load("/textures/8k_sun.jpg")
const moonTexture = textureLoader.load("/textures/8k_moon.jpg")
const backgroundTexture = textureLoader.load("/textures/8k_stars_milky_way.jpg")

GLTFloader.load("/textures/astronaut/scene.gltf", function(gltf){
    astronaut = gltf.scene
    astronaut.scale.set(0.0001, 0.0001, 0.0001)
    astronaut.position.set(0.3,0.2,1.5)
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
    console.log(mars)
    scene.add( mars )
})


// import items from './loader';
// scene.add( sun3 )
// scene.add( astronaut )

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Objects
const geometry = new THREE.SphereBufferGeometry(1,60,60)
const sunGeometry = new THREE.SphereBufferGeometry(5,60,60)
const sun2Geometry = new THREE.SphereBufferGeometry(3,60,60)
const moonGeometry = new THREE.SphereBufferGeometry(0.5,60,60)

//----------------------------- Materials ----------------------------------
const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture})
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture})
const sun2Material = new THREE.MeshStandardMaterial()
const moonMaterial = new THREE.MeshStandardMaterial({map: moonTexture})

// sun 2 material config
sun2Material.metalness = 0.8
sun2Material.roughness = 0.3
sun2Material.color = new THREE.Color(0x202020)

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

// sun 2 gui
const sunMaterialFolder = gui.addFolder("Sun materiel")
sunMaterialFolder.add(sun2Material, "metalness").min(-2).max(2).step(0.01)
sunMaterialFolder.add(sun2Material, "roughness")

const sunMaterialColor = { color: 0xff0000}
sunMaterialFolder.addColor(sunMaterialColor, "color")
    .onChange(() => {
        sun2Material.color.set(sunMaterialColor.color)
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
const sun = new THREE.Mesh(sunGeometry,sunMaterial)
const sun2 = new THREE.Mesh(sun2Geometry,sun2Material)
const moon = new THREE.Mesh(moonGeometry,moonMaterial)

scene.add(earth)
// scene.add(sun)
// scene.add(sun2)
scene.add(moon)
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
const pointlight2 = new THREE.PointLight(0xffffff, 1)
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
light3Folder.add(pointlight3.position,"x").min(-20).max(20).step(0.01)
light3Folder.add(pointlight3.position,"y").min(-20).max(20).step(0.01)
light3Folder.add(pointlight3.position,"z").min(-20).max(20).step(0.01)
light3Folder.add(pointlight3,"intensity").min(0).max(10).step(0.01)

const light3Color = { color: 0xff0000}
light3Folder.addColor(light3Color, "color")
    .onChange(() => {
        pointlight3.color.set(light3Color.color)
    })


//Lensflare
const lensflare = new Lensflare();
// lensflare.addElement( new LensflareElement( textureFlare1, 512, 0 ) );
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
camera.position.x = -0.5
camera.position.y = 0.2
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



//---------------------------------position----------------------------------
earth.position.set(-0.7,-0.5,0)
sun.position.set(5,0,-20)
sun2.position.set(3,2,-20)
moon.position.set(4,1,2)

//--------------------------------END CAMERA---------------------------------
let moonStart = false
// event listener
$(".view-btn").click(() => {
    moonStart = true
    createjs.Tween.get(camera.position).wait(500).to({ z: 4.15, y: 1 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
})



const clock = new THREE.Clock()

const tick = () =>
{
    animate(clock,earth,moon,camera,astronaut,renderer,scene,moonStart,mars,controls)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()