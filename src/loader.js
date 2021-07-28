import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three/src/loaders/TextureLoader.js"

var sun3
var astronaut

const GLTFloader = new GLTFLoader();
const textureLoader = new TextureLoader()

const textureFlare0 = textureLoader.load( "/textures/lens-flare0.png" );
const textureFlare1 = textureLoader.load( "/textures/lens-flare1.png" );
const earthTexture = textureLoader.load("/textures/8k_earth_nightmap.jpg")
const sunTexture = textureLoader.load("/textures/8k_sun.jpg")
const moonTexture = textureLoader.load("/textures/8k_moon.jpg")
const backgroundTexture = textureLoader.load("/textures/8k_stars_milky_way.jpg")

GLTFloader.load("/textures/astronaut/scene.gltf", function(gltf){
    // const astronautSettings = gltf.scene.children[0]
        astronaut = gltf.scene
        astronaut.scale.set(0.0001, 0.0001, 0.0001)
        astronaut.position.set(0.3,0.2,1.5)
    })
 GLTFloader.load("/textures/sun/scene.gltf", function(gltf){
        sun3 = gltf.scene
        sun3.position.set(3.2,2.05,-20)
})
    



console.log(sun3)
export default {textureFlare0, textureFlare1, earthTexture, sunTexture, moonTexture, backgroundTexture, sun3, astronaut}