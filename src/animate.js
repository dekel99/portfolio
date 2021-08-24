// import {OrbitControls} from 'three';
import {Vector3, Vector2, Raycaster, Color} from 'three';

let mouseX
let mouseY
let targetX
let targetY
let t = 0
let changePositionTrigger = true
let moonStart = false
let cameraTween
let sceneTween
let picerFlagTween
let triggerTimeMoon
let firstTriggerMoon = true
let triggerTimeSphere
let firstTriggerSphere = true
let waiting = false
let moveJs
let jsLogoTween
let positionAttribute
let aboutUsScene = false
let way = []
let warpEffect = false
let starSpeed = 0
let initialPosition = []
let initialPositionAboutUs = []
let acceleration = 0
let clockReset
let starClock
let afterImageTween
let bloomPassTween
let pointlight3Tween
let gammaRotation
let alphaRotation
let prevAlpha
const [sizeW,sizeH,segW,segH] = [0.45,0.3,20,10];


// Sound event listeners
let mainSound = $("#main-sound")[0]
$(window).focus(function() {
    $('.sound-off-icon').css("display") === "none" && mainSound.play()
});
$(window).blur(function() {
    mainSound.pause()
});

// Raycaster
const raycaster = new Raycaster()
const mouse = new Vector2();

// Detect mouse move for homepage earth effect
document.addEventListener("mousemove", onDocumentMouseMove)
// window.addEventListener("deviceorientation", handleOrientation, true);

// View our project button event listener
$(".view-btn").click(() => {
    moonStart = true
    createjs.Tween.get(cameraTween.position).to({ z: 11.5, y: 1 }, 8000, createjs.Ease.getPowInOut(3)).wait(500);
    $('.heading-container').css('animation', 'fade-out 0.5s ease').css("animation-fill-mode","both");
    $('.picer-project-window-container').css('display', 'unset')
    $('.backBtn').css('display', 'unset')

    createjs.Tween.get(mainSound).to({ volume: 0.1 }, 8000,createjs.Ease.getPowInOut(3))

    setTimeout(() => {
        $("#moon-pass")[0].play()
    }, 6700);

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

    if(e.target.id === "enter-btn-id"){
        mainSound.play()
        $('.loading-bar-cover').css('animation', 'fade-out 2s ease').css("animation-fill-mode","both");
        setTimeout(() => {
            $( ".loading-bar-cover" ).remove();
        }, 2000);
    }

    // Handle navbar windows & clicks
    if (e.target.innerText === "CONTACT US"){
        $('#credits-window-id').css('top') === "50px" && $('#credits-window-id').css('top', '-400px')
        $('#contact-us-window-id').css('top', '50px')
    } else if(e.target.id==="canvas-id" || e.target.id==="mars-cover-div" || e.target.id==="close-contact-win"){
        $('#contact-us-window-id').css('top', '-400px')
    }

    if (e.target.innerText === "ABOUT US"){

        $("document").ready(function(){
            const divsHeight = $('#text-1-id').height() + $('#text-2-id').height() + $('#text-3-id').height()
            const totalHeight = divsHeight + 1000 + window.innerHeight + (- $('#text-1-id').height()/2)// - ($('#text-3-id').height()/2)
            
            console.log(divsHeight)

            $("#main-scroll").css("height", `${totalHeight}`)
        })


        $(window).scroll(function(e){
            let divHieght = $("#about-us-container-id")[0].scrollHeight
            let winHieght = window.innerHeight
            let scrollPosition = window.pageYOffset
        
            // How much distance client scrolled in %
            let scrollPassed = Math.round(scrollPosition / (divHieght - winHieght)  * 100)

            // Make stars moves faster with scroll
            acceleration = scrollPassed/10000
            afterImageTween.uniforms[ "damp" ].value = scrollPassed/110


            $(".text-1").css("opacity",`${-(scrollPassed/20 - 1)}`)
            $(".text-2").css("opacity",`${(scrollPassed)/50}`)
            if(scrollPassed>55){
                $(".text-2").css("opacity",`${-((scrollPassed-55)/20 - 1)}`)
                $(".text-3").css("opacity",`${(scrollPassed-55)/45}`)
            }
        })
        aboutUsScene = true
    }

    if (e.target.innerText === "CREDITS"){
        $('#contact-us-window-id').css('top') === "50px" && $('#contact-us-window-id').css('top', '-400px')
        $('#credits-window-id').css('top', '50px')
    } else if(e.target.id==="canvas-id" || e.target.id==="mars-cover-div" || e.target.id==="close-credits-win"){
        $('#credits-window-id').css('top', '-400px')
    }

    // Handle mute click
    if (e.target.id==="mute-btn-id"){
        if($('.sound-off-icon').css("display") === "none"){
            $('.sound-on-icon').css('display', 'none') 
            $('.sound-off-icon').css('display', 'unset') 
            mainSound.pause()
        } else {
            $('.sound-on-icon').css('display', 'unset') 
            $('.sound-off-icon').css('display', 'none') 
            mainSound.play()
        }
    }
     
    // Handle flag clicks
    if (found[0] && !waiting){
        $('.instructions-window').css('opacity', '0')
        
        if (found[0].object.userData.name==="picer-flag"){
            waiting = true
            createjs.Tween.get(cameraTween.position).to({ x: 7.6, y: -9.3, z: 25 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            
            // open window project
            setTimeout(function(){
                $('.picer-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2100);
            
        } else if (found[0].object.userData.name==="sapochat-flag"){
            createjs.Tween.get(cameraTween.position).to({ x: 10.8, y: -9.5, z: 20.7 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true
            
            // Open window project
            $('.picer-project-window').css('animation', 'scale-down 0.5s ease')
            setTimeout(function(){
                $('.picer-project-window').css('display', 'none')
            }, 500);
            setTimeout(function(){
                $('.sapochat-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2300);

        } else if (found[0].object.userData.name==="about-me-flag"){
            createjs.Tween.get(bloomPassTween).to({threshold: 0}, 2000);
            createjs.Tween.get(bloomPassTween).to({strength: 10}, 2000);

            function lightMoves(){
                createjs.Tween.get(pointlight3Tween).to({intensity: 4}, 2000);
                createjs.Tween.get(pointlight3Tween.position).to({z: 200}, 13000, createjs.Ease.getPowInOut(3));
                setTimeout(() => {
                    createjs.Tween.get(pointlight3Tween).to({intensity: 0}, 5000);
                    setTimeout(() => {
                        createjs.Tween.get(pointlight3Tween.position).to({z: -200}, 500, createjs.Ease.getPowInOut(3));
                    }, 5000);
                }, 8000);

            }

            setTimeout(() => {
                $('.white-transision').css("display","unset")
                
                setTimeout(() => {
                    $("document").ready(function(){
                        const divsHeight = $('#text-1-id').height() + $('#text-2-id').height() + $('#text-3-id').height()
                        const totalHeight = divsHeight + 1000 + window.innerHeight + (- $('#text-1-id').height()/2)// - ($('#text-3-id').height()/2)
                        
                        console.log(divsHeight)
            
                        $("#main-scroll").css("height", `${totalHeight}`)
                    })
            
                    $(window).scroll(function(e){
                        let divHieght = $("#about-us-container-id")[0].scrollHeight
                        let winHieght = window.innerHeight
                        let scrollPosition = window.pageYOffset
                    
                        // How much distance client scrolled in %
                        let scrollPassed = Math.round(scrollPosition / (divHieght - winHieght)  * 100)
            
                        // Make stars moves faster with scroll
                        acceleration = scrollPassed/10000
                        afterImageTween.uniforms[ "damp" ].value = scrollPassed/110
            
            
                        $(".text-1").css("opacity",`${-(scrollPassed/20 - 1)}`)
                        $(".text-2").css("opacity",`${(scrollPassed)/50}`)
                        if(scrollPassed>55){
                            $(".text-2").css("opacity",`${-((scrollPassed-55)/20 - 1)}`)
                            $(".text-3").css("opacity",`${(scrollPassed-55)/45}`)
                        }
                    })
                
                    aboutUsScene = true
                    $('.white-transision').css('animation', 'fade-out 2s ease').css("animation-fill-mode","both");
                }, 300);

                setTimeout(() => {
                    lightMoves()
                    setInterval(() => {
                        lightMoves()
                    }, 20000);
                    $( ".white-transision" ).remove();
                }, 2000);
            }, 2000);
            
        }
    }
})

// Scroll event listener
// document.onwheel = wheel

// function wheel(e){
//     if (e.deltaY > 0){
//         acceleration += 0.001
//     } else {
//         acceleration -= 0.001
//     }

// }         

window.addEventListener('deviceorientation', function(e) {
    gammaRotation = e.gamma ? e.gamma * (Math.PI / 180) : 0;
    alphaRotation = e.alpha ? e.alpha * (Math.PI / 180) : 0;

    console.log(e.alpha,e.gamma)
    // gammaRotation = e.alpha
    // alphaRotation = e.alpha

});

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


// Flag movement config
const h = 0.4
const v = 0.5
const w = 0.2
const s = 0.9

setTimeout(() => {
    positionAttribute = picerFlagTween.geometry.getAttribute( 'position' );
}, 100);
const vertex = new Vector3();

export function animate(clock,earth,moon,camera,astronaut,renderer,scene,mars,controls,mobileControls,blackSphere,pointlight1,pointlight2,pointlight3,marsBackgroundTexture,marsBackgroundMobileTexture,backgroundTexture,backgroundMobileTexture,jsLogo,bloomPass,afterImage,picerFlag,startsCount,starsPositions,stars,composer){
    targetX = mouseX * .001
    targetY = mouseY * .001
    cameraTween = camera
    sceneTween = scene
    // jsLogoTween = jsLogo
    picerFlagTween = picerFlag
    afterImageTween = afterImage
    bloomPassTween = bloomPass
    pointlight3Tween = pointlight3


    const elapsedTime = clock.getElapsedTime()

    // Update objects
    earth.rotation.y = 0.1 * elapsedTime
    moon.rotation.y = -0.15 * elapsedTime
    
    // Moves the sphere from mars creating transision effect
    if (changePositionTrigger===false){
        blackSphere.position.x = -4 * clockResetSphere(elapsedTime,firstTriggerSphere) + 8.2
        blackSphere.position.z = -6 * clockResetSphere(elapsedTime,firstTriggerSphere) + 25
        firstTriggerSphere = false
    }
    
    if(moonStart){
        t=0.18 * clockResetMoon(elapsedTime,firstTriggerMoon)
        moon.position.x = 11.4*Math.cos(t) -0.7
        moon.position.z = 11.4*Math.sin(t) -0.5
        firstTriggerMoon = false
    }
    
    // Triggers mars scene when moon is in front of the camera
    if (moon.position.x < -0.45 && changePositionTrigger){

        // Change camera position to mars
        // controls.target = new Vector3(18,-13,20);
        camera.position.set(5.3,-8,26)
        camera.lookAt(new Vector3(18,-13,20))
        if(window.innerWidth>800){
            scene.background = marsBackgroundTexture
        } else {
            scene.background = marsBackgroundMobileTexture
        }
        // Set mars lights
        pointlight1.intensity = 1
        pointlight3.position.set(-11, 20, 20)
        pointlight3.intensity = 1.8
        bloomPass.strength = 0

        // Click on flag message
        setTimeout(() => {
            $('.instructions-window').css('opacity', '1')
        }, 1500);

        // Delele uneeded items
        disposeEarthScene(scene,earth,astronaut,moon)
        
        // Makes this if run once
        changePositionTrigger = false
    }

    
    // if(jsLogo){
    //     jsLogo.rotation.z = 6.4 * elapsedTime
    // }
    
    if (astronaut){
        astronaut.position.x = -0.001 * elapsedTime
        astronaut.rotation.y = 0.2 * elapsedTime
        astronaut.rotation.z = 0.1 * elapsedTime
    } 
    
    // Flags movment
    if(positionAttribute){
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
    }    

    if (aboutUsScene){
        camera.position.set(25,25,0)
        camera.lookAt(new Vector3(25,25,-1))

        // controls.target = new Vector3(25,25,-1)
        stars.position.set(25, 25, -1.5)
        clockReset = elapsedTime
        // controls.enabled = false

        pointlight1.intensity = 0
        pointlight2.intensity = 1.2
        pointlight2.position.set(25,24.9,0.6)
        pointlight2.color = new Color(0xff9393)
        pointlight3.intensity = 0
        pointlight3.position.set(-100,-40,-200)

        bloomPassTween.strength = 0.4
        bloomPassTween.threshold = 0.15
            
        afterImage.enabled = true
        $("#about-us-container-id").css("display","unset")

        if(window.innerWidth>800){
            scene.background = backgroundTexture
        } else {
            scene.background = backgroundMobileTexture
        }
        
        warpEffect = true
        aboutUsScene = false
    }


    // Particle animation
    starSpeed += acceleration
    starClock = elapsedTime - clockReset

    for ( let i = 0; i < startsCount ; i++ ) {
        const i3 = i * 3

        if (!way[i3]){
            way[i3] = (Math.random() - 0.5)
            way[i3+1] = (Math.random() - 0.5)
            way[i3+2] = (Math.random() - 0.5)
            initialPosition[i3] = starsPositions[i3] 
            initialPosition[i3+1] = starsPositions[i3 +1] 
            initialPosition[i3+2] = starsPositions[i3 +2] 
        } else if (warpEffect){
            if(!initialPositionAboutUs[i3+2]){  
                initialPositionAboutUs[i3+2] = (Math.random() - 0.5) * 6
            } else {
                starsPositions[i3+2] = initialPositionAboutUs[i3+2] + starClock + starSpeed

                if(starsPositions[i3+2] > 3){
                    initialPositionAboutUs[i3+2] = -3 - starClock - starSpeed
                }
            }
        } else {
            starsPositions[i3] = initialPosition[i3] + way[i3] * (elapsedTime / 50)
            starsPositions[i3+1] = initialPosition[i3+1] + way[i3+1] * (elapsedTime / 50)
            starsPositions[i3+2] = initialPosition[i3+2] + way[i3+2] * (elapsedTime / 50)
        }
    }

    stars.geometry.attributes.position.needsUpdate = true;

    if(targetX && moonStart===false && !gammaRotation){

        camera.position.x = (mouse.x/50) - 0.5
        camera.position.y = (mouse.y/50) + 0.2
    }


    if(targetX && warpEffect===true && !gammaRotation){
        camera.rotation.x = (mouse.y/5)
        camera.rotation.y = -(mouse.x/5) 
    }

    // console.log(gammaRotation)
    if(gammaRotation && moonStart===false && prevAlpha - alphaRotation >! 1 || prevAlpha - alphaRotation <! -1){
        camera.position.x = gammaRotation/10 - 0.5
        camera.position.y = alphaRotation/10 + 0.2
        
        prevAlpha = alphaRotation
    }
        
    // Update Orbital Controls
    // controls.update()
    // mobileControls && mobileControls.update()
    // Render
    // renderer.render(scene, camera)
    composer.render(scene, camera)

    }
    