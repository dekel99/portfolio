// import {OrbitControls} from 'three';
import {Vector3, Vector2, Raycaster} from 'three';

let mouseX
let mouseY
let targetX
let targetY
let t = 0
let changePositionTrigger = true
let moonStart = false
let cameraTween
let sceneTween
let triggerTimeMoon
let firstTriggerMoon = true
let triggerTimeSphere
let firstTriggerSphere = true

// Raycaster
const raycaster = new Raycaster()
const mouse = new Vector2();

document.addEventListener("mousemove", onDocumentMouseMove)
$(".view-btn").click(() => {
    moonStart = true
    createjs.Tween.get(cameraTween.position).to({ z: 11.5, y: 1 }, 8000, createjs.Ease.getPowInOut(3)).wait(500);
    $('.heading-container').css('animation', 'fade-out 0.5s ease').css("animation-fill-mode","both");
    setTimeout(() => {
        $( ".heading-container" ).remove();
    }, 500);
})
$(".backBtn").click(() => {
    createjs.Tween.get(cameraTween.position).to({ x: 5.3, y: -8, z: 26 }, 3000, createjs.Ease.getPowInOut(3));
    $('.backBtn').css('display', 'none')
})

$("body").click((e) => {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, cameraTween );
	const found = raycaster.intersectObjects( sceneTween.children, true );


    if (found[0].object.name==="Flag_Flag_Mat_0"){
        createjs.Tween.get(cameraTween.position).to({ x: 7.6, y: -9.2, z: 25 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
        $('.backBtn').css('display', 'unset')

    } else if (found[0].object.name==="Flag_Flag_Mat_1"){
        createjs.Tween.get(cameraTween.position).to({ x: 10.8, y: -9.5, z: 20.7 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
        $('.backBtn').css('display', 'unset');
    }

})

function onDocumentMouseMove(e){
    mouseX = e.clientX
    mouseY = e.clientY

}

function clockResetMoon(elapsedTime, firstTriggerMoon){
    if(firstTriggerMoon){
        triggerTimeMoon = elapsedTime
    } 
    return elapsedTime-triggerTimeMoon
}

function clockResetSphere(elapsedTime,firstTriggerSphere){
    if(firstTriggerSphere){
        triggerTimeSphere = elapsedTime
    }
    return elapsedTime - triggerTimeSphere
}

export function animate(clock,earth,moon,camera,astronaut,renderer,scene,mars,controls,blackSphere,pointlight1,pointlight3,marsBackgroundTexture){
    targetX = mouseX * .001
    targetY = mouseY * .001
    cameraTween = camera
    sceneTween = scene

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    earth.rotation.y = 0.1 * elapsedTime
    moon.rotation.y = -0.15 * elapsedTime
    
    if (changePositionTrigger===false){
        blackSphere.position.x = -3 * clockResetSphere(elapsedTime,firstTriggerSphere) + 8.2
        blackSphere.position.z = -4 * clockResetSphere(elapsedTime,firstTriggerSphere) + 25
        firstTriggerSphere = false
    }
    
    if(moonStart){
        t=0.18 * clockResetMoon(elapsedTime,firstTriggerMoon) 
        moon.position.x = 11.4*Math.cos(t) -0.7
        moon.position.z = 11.4*Math.sin(t) -0.5
        firstTriggerMoon = false
    }
    
    if (moon.position.x < -0.45 && changePositionTrigger){
        // setTimeout(() => {
            controls.target = new Vector3(18,-13,20);
            camera.position.set(5.3,-8,26)
            camera.lookAt(new Vector3(18,-13,20))

            scene.background = marsBackgroundTexture
            pointlight1.intensity = 1
            pointlight3.intensity = 1.5    
        // }, 900);
        changePositionTrigger = false
    }

    if (astronaut){
        astronaut.position.x = -0.001 * elapsedTime
        astronaut.rotation.y = 0.2 * elapsedTime
        astronaut.rotation.z = 0.1 * elapsedTime
    } 

    // if (animateCamera){
    //     // camera.lookAt(new THREE.Vector3(2,5,3))
    //     if(camera.position.z<5){
    //         camera.position.z += 0.006
    //         camera.position.y += 0.001
    //     }

    // }

    if(targetX && moonStart===false){
        camera.position.x = -0.6 + (targetX/13)
        camera.position.y = 0.15 + (targetY/13)
    }


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
}
