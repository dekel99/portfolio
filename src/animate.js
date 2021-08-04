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
let waiting = false
let moveJs
let jsLogoTween

// Raycaster
const raycaster = new Raycaster()
const mouse = new Vector2();

// Detect mouse move for homepage earth effect
document.addEventListener("mousemove", onDocumentMouseMove)
window.addEventListener("deviceorientation", handleOrientation, true);


// View our project button event listener
$(".view-btn").click(() => {
    moonStart = true
    createjs.Tween.get(cameraTween.position).to({ z: 11.5, y: 1 }, 8000, createjs.Ease.getPowInOut(3)).wait(500);
    $('.heading-container').css('animation', 'fade-out 0.5s ease').css("animation-fill-mode","both");
    $('.picer-project-window-container').css('display', 'unset')
    $('.backBtn').css('display', 'unset')

    setTimeout(() => {
        $( ".heading-container" ).remove();
    }, 500);
})

// Go back button event listener
$(".backBtn").click(() => {
    if (!waiting){
        createjs.Tween.get(cameraTween.position).to({ x: 5.3, y: -8, z: 26 }, 3000, createjs.Ease.getPowInOut(3));
        $('.backBtn').css('opacity', '0')
    
        // Project window close
        $('.picer-project-window').css('animation', 'scale-down 0.7s ease')
        setTimeout(function(){
            $('.picer-project-window').css('display', 'none')
        }, 500);
        $('.sapochat-project-window').css('animation', 'scale-down 0.7s ease')
        setTimeout(function(){
            $('.sapochat-project-window').css('display', 'none')
        }, 500);
    }
})

// Listen to all clicks with ray caster
$("body").click((e) => {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, cameraTween );
	const found = raycaster.intersectObjects( sceneTween.children, true );

    if (found[0] && !waiting){
        if (found[0].object.name==="Flag_Flag_Mat_0"){
            waiting = true
            createjs.Tween.get(cameraTween.position).to({ x: 7.6, y: -9.3, z: 25 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')

            // open window project
            $('.picer-project-window').css('display', 'none')
            setTimeout(function(){
                $('.picer-project-window').css('display', 'unset').css('animation', 'scale-up 0.7s ease')
                waiting = false
            }, 2100);

        } else if (found[0].object.name==="Flag_Flag_Mat_1"){
            createjs.Tween.get(cameraTween.position).to({ x: 10.8, y: -9.5, z: 20.7 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true

            // Open window project
            $('.picer-project-window').css('animation', 'scale-down 0.7s ease')
            setTimeout(function(){
                $('.picer-project-window').css('display', 'none')
            }, 500);
            setTimeout(function(){
                $('.sapochat-project-window').css('display', 'unset').css('animation', 'scale-up 0.7s ease')
                waiting = false
            }, 2300);
        }
    }
})



// Delete uneeded object after moving to mars scene
function disposeEarthScene(scene,earth,astronaut,moon){
    const disposedItems = [earth,moon]

    for (let i = 0; i<disposedItems.length; i++){
        scene.remove(disposedItems[i])
        disposedItems[i].geometry.dispose()
        disposedItems[i].material.dispose()
    }
    scene.remove(astronaut)
}

// Updates mouse cords
function onDocumentMouseMove(e){
    mouseX = e.clientX
    mouseY = e.clientY

    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, cameraTween );
	const found = raycaster.intersectObjects( sceneTween.children, true );

    if(found[0] && found[0].object.name==="path23"){
        createjs.Tween.get(jsLogoTween.position).to({ x: Math.random()*3 + 8.5, y: -9.5, z: Math.random()*3 + 24.6 }, 100, createjs.Ease.getPowInOut(1.2));
    }
}

function handleOrientation(e){
    var absolute = e.absolute;
    var alpha = e.alpha;
    var beta = e.beta;
    var gamma = e.gamma;

    mouseX = alpha
    mouseY = beta
}

// Moon clock ticks only when this runs
function clockResetMoon(elapsedTime, firstTriggerMoon){
    if(firstTriggerMoon){
        triggerTimeMoon = elapsedTime
    } 
    return elapsedTime-triggerTimeMoon
}

// Sphere clock ticks only when this runs
function clockResetSphere(elapsedTime,firstTriggerSphere){
    if(firstTriggerSphere){
        triggerTimeSphere = elapsedTime
    }
    return elapsedTime - triggerTimeSphere
}

export function animate(clock,earth,moon,camera,astronaut,renderer,scene,mars,controls,blackSphere,pointlight1,pointlight3,marsBackgroundTexture,jsLogo){
    targetX = mouseX * .001
    targetY = mouseY * .001
    cameraTween = camera
    sceneTween = scene
    jsLogoTween = jsLogo

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
        t=0.18 * clockResetMoon(elapsedTime,firstTriggerMoon) //0.18
        moon.position.x = 11.4*Math.cos(t) -0.7
        moon.position.z = 11.4*Math.sin(t) -0.5
        firstTriggerMoon = false
    }
    
    if (moon.position.x < -0.45 && changePositionTrigger){
        controls.target = new Vector3(18,-13,20);
        camera.position.set(5.3,-8,26)
        camera.lookAt(new Vector3(18,-13,20))
        scene.background = marsBackgroundTexture
        pointlight1.intensity = 1
        pointlight3.intensity = 1.5
        disposeEarthScene(scene,earth,astronaut,moon)    
        changePositionTrigger = false
    }

    if(jsLogo){
        jsLogo.rotation.z = 0.4 * elapsedTime
    }

    if (astronaut){
        astronaut.position.x = -0.001 * elapsedTime
        astronaut.rotation.y = 0.2 * elapsedTime
        astronaut.rotation.z = 0.1 * elapsedTime
    } 

    // if(targetX && moonStart===false){
    //     camera.position.x = -0.6 + (targetX/13)
    //     camera.position.y = 0.15 + (targetY/13)
    // }


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
}
