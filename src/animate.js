// import {OrbitControls} from 'three';
import {Vector3, Vector2, Raycaster, Color, WebGLRenderTarget} from 'three';
import { startTimer } from "./countdown"
import { spaceshipIntroText } from "./spaceshipIntroText"
import { disableScroll, enableScroll } from "./scrollToggle"
import initSwiper from "./swiper"

let mouseX
let mouseY
let targetX
let targetY
let t = 0
let spaceshipPositionTrigger = true
let marsPositionTrigger = true
let moonStart = false
let cameraTween
let sceneTween
let picerFlagTween
let triggerTimeMoon
let firstTriggerMoon = true
let triggerTimeSphere
let firstTriggerSphere = true
let waiting = true
let moveJs
let jsLogoTween
let positionAttribute
let spaceshipSceneTrigger = false
let isInSpaceship = false
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
let returned
let firstScroll = true
let spaceshipZIndexTrigger
let marsTimer
let lightsInterval
let spaceshipTweens = []
let lightIntesnsityTimeout
let lightBackTimeOut
let particles = true
let mobile
let alphaRotation
let prevAlphaRotation

disableScroll()

initSwiper()

const [sizeW,sizeH,segW,segH] = [0.45,0.3,20,10];
let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
function isIphone() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

if(window.innerWidth<800){
    mobile = true
}

// Sound event listeners
let mainSound = $("#main-sound")[0]
$(window).focus(function() {
    $('.sound-off-icon').css("display") === "none" && mainSound.play()
    returned = true
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
    createjs.Tween.get(cameraTween.position).to({ z: 11.5, y: 1 }, 8000, createjs.Ease.getPowInOut(3));
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
        closeProjectWindows()
    }
})

// Listen to all clicks with ray caster
$("body").click((e) => {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraTween)
	const found = raycaster.intersectObjects( sceneTween.children, true )

    if(e.target.id === "enter-btn-id"){
        enableScroll()
        if(isIphone()){
            $(".backBtn").addClass("iPhoneBackBtn")
            $(".picer-project-window").addClass("iphone-picer-project-window")
            $(".sapochat-project-window").addClass("iphone-sapochat-project-window")
            $(".imagic-project-window").addClass("iphone-imagic-project-window")
        } else {
            mobile && toggleFullScreen()
        }
        $('.loading-bar-cover').css('animation', 'fade-out 2s ease').css("animation-fill-mode","both");
        setTimeout(() => {
            $(".loading-bar-cover").remove()
        }, 2000);
    }

    // Handle navbar windows & clicks
    if (e.target.innerText === "JOURNEY"){
        $('#credits-window-id').css('top') === "50px" && $('#credits-window-id').css('top', '-400px')
        $('#contact-us-window-id').css('top') === "50px" && $('#contact-us-window-id').css('top', '-400px')
        $('#journey-window-id').css('top', '50px')
    } else if(e.target.id==="canvas-id" || e.target.id==="mars-cover-div" || e.target.id==="close-journey-win"){
        $('#journey-window-id').css('top', '-400px')
    }

    if (e.target.innerText === "PROJECTS" || e.target.className === 'quick-projects-view'){
        $('.static-work-container').css('top', '0')
    } else if(e.target.id==="close-work-win"){
        $('.static-work-container').css('top', '100%')
    }

    if (e.target.innerText === "CONTACT ME"){
        $('#credits-window-id').css('top') === "50px" && $('#credits-window-id').css('top', '-400px')
        $('#journey-window-id').css('top') === "50px" && $('#journey-window-id').css('top', '-400px')
        $('#contact-us-window-id').css('top', '50px')
    } else if(e.target.id==="canvas-id" || e.target.id==="mars-cover-div" || e.target.id==="close-contact-win"){
        $('#contact-us-window-id').css('top', '-400px')
    }

    if (e.target.innerText === "CREDITS"){
        $('#contact-us-window-id').css('top') === "50px" && $('#contact-us-window-id').css('top', '-400px')
        $('#journey-window-id').css('top') === "50px" && $('#journey-window-id').css('top', '-400px')
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

    // Handle screen size toggle
    if (e.target.id==="toggle-screen-size-btn-id"){
        toggleFullScreen()
    }
     
    // Handle flag clicks
    if (found[0] && !waiting){
        $('#window-mars-animation').css('opacity', '0')
        
        if (found[0].object.userData.name==="picer-flag"){
            createjs.Tween.get(cameraTween.position).to({ x: 7.6, y: -9.3, z: 25 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true
            closeProjectWindows()

            // open window project
            setTimeout(function(){
                $('.picer-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2100);
            
        } else if (found[0].object.userData.name==="sapochat-flag"){
            createjs.Tween.get(cameraTween.position).to({ x: 10.8, y: -9.5, z: 20.7 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true
            closeProjectWindows()
            
            // Open window project
            setTimeout(function(){
                $('.sapochat-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2300);

        } else if (found[0].object.userData.name==="imagic-flag"){
            createjs.Tween.get(cameraTween.position).to({ x: 8.2, y: -9.5, z: 23 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true
            closeProjectWindows()

            // Open window project
            setTimeout(function(){
                $('.imagic-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2300);

        } else if (found[0].object.userData.name==="news-flag"){
            createjs.Tween.get(cameraTween.position).to({ x: 10.2, y: -9.5, z: 23 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true
            closeProjectWindows()

            // Open window project
            setTimeout(function(){
                $('.news-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2300);

        } else if (found[0].object.userData.name==="flappy-flag"){
            createjs.Tween.get(cameraTween.position).to({ x: 6.95, y: -9.3, z: 26.16 }, 3000, createjs.Ease.getPowInOut(3)).wait(500);
            $('.backBtn').css('opacity', '1')
            waiting = true
            closeProjectWindows()

            // Open window project
            setTimeout(function(){
                $('.flappy-project-window').css('display', 'unset').css('animation', 'scale-up 0.5s ease')
                waiting = false
            }, 2300);
        } 
    }
})

function closeProjectWindows(){
    $('.picer-project-window').css('animation', 'scale-down 0.7s ease')
    setTimeout(function(){
        $('.picer-project-window').css('display', 'none')
    }, 500);
    $('.sapochat-project-window').css('animation', 'scale-down 0.7s ease')
    setTimeout(function(){
        $('.sapochat-project-window').css('display', 'none')
    }, 500);
    $('.imagic-project-window').css('animation', 'scale-down 0.7s ease')
    setTimeout(function(){
        $('.imagic-project-window').css('display', 'none')
    }, 500);
    $('.news-project-window').css('animation', 'scale-down 0.7s ease')
    setTimeout(function(){
        $('.news-project-window').css('display', 'none')
    }, 500);
    $('.flappy-project-window').css('animation', 'scale-down 0.7s ease')
    setTimeout(function(){
        $('.flappy-project-window').css('display', 'none')
    }, 500);
}

function spaceshipScene(){
    isInSpaceship = true
    // Spaceship light animation
    function lightMoves(){
        spaceshipTweens.push(createjs.Tween.get(pointlight3Tween).to({intensity: 4}, 2000))
        spaceshipTweens.push(createjs.Tween.get(pointlight3Tween.position).to({z: 200}, 13000, createjs.Ease.getPowInOut(3)))
        lightIntesnsityTimeout = setTimeout(() => {
            spaceshipTweens.push(createjs.Tween.get(pointlight3Tween).to({intensity: 0}, 5000))
            lightBackTimeOut = setTimeout(() => {
                spaceshipTweens.push(createjs.Tween.get(pointlight3Tween.position).to({z: -200}, 500, createjs.Ease.getPowInOut(3)))
            }, 5000);
        }, 8000);
    }

    // Adds event litener to skip button
    $(".skip-travel").click(function(){
        $(".timer").text("00:00")
        startTimer()
    })
    
    // Light animation loop
    setTimeout(() => {
        lightMoves()
        lightsInterval = setInterval(() => {
            lightMoves()
        }, 20000);
    }, 2000);    
    
    // Enable scene container & animates in text
    $(".journey-text-earth").css("font-weight","400")
    $(".journey-text-spaceship").css("font-weight","1000")
    $("#about-us-container-id").css("display","unset")
    
    setTimeout(() => {
        $(".text-1").css("opacity","1")
        if(isSafari) {
            $('.lottie-scroll-safary').css('display', 'unset')
            $('.lottie-scroll').css('display', 'none')
        }
        $('#window-spaceship-animation').css('opacity', '1')
        spaceshipIntroText()
    }, 800);

    $('#window-spaceship-animation').css('display', 'unset')
    const divsHeight = $('#text-1-id').height() + $('#text-2-id').height() + $('#text-3-id').height()
        
    // Calculate page highet when doc is ready
    $("document").ready(function(){
        const totalHeight = divsHeight + 1000 + window.innerHeight + (- $('#text-1-id').height()/2)
        $("#main-scroll").css("height", `${totalHeight}`)
    })

    // Scroll event listener for animations
    $(window).scroll(function(e){
        let divHieght = $("#about-us-container-id")[0].scrollHeight
        let winHieght = window.innerHeight
        let scrollPosition = window.pageYOffset
        
        // Remove instructions window
        if(firstScroll){
            $('#window-spaceship-animation').css('opacity', '0')
            setTimeout(() => {
                $('#window-arrival-animation').css('opacity', '1')
            }, 400);
            startTimer(60, $(".timer"), 1)
            firstScroll = false
        }
        
        // How much distance client scrolled in %
        let scrollPassed = Math.round(scrollPosition / (divHieght - winHieght)  * 100)
        
        // Make stars moves faster with scroll
        acceleration = scrollPassed/5000
        afterImageTween.uniforms[ "damp" ].value = scrollPassed/110
        
        // Set timer and make faster by scrolling
        if (scrollPassed<45){
            startTimer(60, $(".timer"), 1)
        } else if(scrollPassed>45 && scrollPassed<100){
            startTimer(60, $(".timer"), 2)
        } else if (scrollPassed === 100){
            startTimer(60, $(".timer"), 4)
        }
        
        let fasterMobileDisappear = mobile ? 2 : 1

        // Text change opacity while scroll animation
        $(".text-1").css("opacity",`${-(scrollPassed/15*fasterMobileDisappear - 1)}`)
        $(".text-2").css("opacity",`${(scrollPassed^2/2)/50}`)
        if(scrollPassed>55){
            $(".text-2").css("opacity",`${-((scrollPassed-55)/8*fasterMobileDisappear - 1)}`)
            $(".text-3").css("opacity",`${(scrollPassed-55)/45}`)
        }
    })
        
    spaceshipSceneTrigger = true
}

function spaceshipEndAnimation(light,light2,sun,mainFlare,flares){

    $('.about-us-text-container').css('transition', 'all 0.4s ease-in-out')
    $('.about-us-text-container').css('opacity', '0')
    setTimeout(() => {
        $('.about-us-text-container').css('display', 'none')
    }, 400);

    for(let i=0; i<flares.length; i++){
        const flareSize = flares[i].size
        flares[i].size = 1
        createjs.Tween.get(flares[i]).to({size: flareSize}, 6000)
    }

    mainFlare.size = 1
    sun.position.set(25,23,-100)
    light.position.set(25,25,-97)

    createjs.Tween.get(light.position).to({x:25, y:25, z:-27}, 6000, createjs.Ease.getPowIn(3))
    createjs.Tween.get(mainFlare).to({size: 900}, 7000, createjs.Ease.getPowIn(3))
    createjs.Tween.get(sun.position).to({x:25, y:25, z:-30}, 6000, createjs.Ease.getPowIn(3))
    createjs.Tween.get(light2).to({intensity: 5}, 8000, createjs.Ease.getPowIn(7))

    setTimeout(() => {
        createjs.Tween.get(bloomPassTween).to({threshold: 0}, 4000, createjs.Ease.getPowIn(6))
        createjs.Tween.get(bloomPassTween).to({strength: 10}, 4000, createjs.Ease.getPowIn(6))
    }, 4000);

    setTimeout(() => {
        marsScene()
        $('.white-transision').css("display","unset")
    }, 8000)
}

function marsScene(){
    isInSpaceship = false
    clearTimeout(lightIntesnsityTimeout)
    clearTimeout(lightBackTimeOut)

    positionAttribute = picerFlagTween.geometry.getAttribute( 'position' );

    $(".journey-text-spaceship").css("font-weight","400")
    $(".journey-text-mars").css("font-weight","1000")
    $("#about-us-container-id").css("display","none")
    $("#window-arrival-animation").css("display","none")
    setTimeout(() => {
        $('.white-transision').css('animation', 'fade-out 3s ease').css("animation-fill-mode","both");
        
        // Click on flag message
        setTimeout(() => {
            $('#window-mars-animation').css('opacity', '1')
        }, 2000);

        setTimeout(() => {
            $( ".white-transision" ).remove();
        }, 3000);
    }, 1000);    
    
    afterImageTween.enabled = false
    bloomPassTween.enabled = false
    warpEffect = false
    waiting = false

    for(let i=0; i < spaceshipTweens.length; i++){
        spaceshipTweens[i].setPaused(true)
    }
}

// window.addEventListener('deviceorientation', function(e) {

//     if(isInSpaceship){
//         // camera.position.y += alphaRotation/50 - prevCamY ? prevCamY : 0
//         console.log("test")
//         alphaRotation = e.alpha

//         cameraTween.rotation.y += alphaRotation/10 - prevAlphaRotation ? prevAlphaRotation : 0
//         prevAlphaRotation = alphaRotation
//     }

// });

// Delete uneeded object after moving to mars scene
function disposeEarthScene(scene,earth,astronaut,moon){
    const disposedItems = [earth,moon]
    
    for (let i = 0; i<disposedItems.length; i++){
        scene.remove(disposedItems[i])
        disposedItems[i].geometry.dispose()
        disposedItems[i].material.dispose()
        disposedItems[i].material.map.dispose()
    }
    scene.remove(astronaut)
}

function disposeSpaceshipScene(spaceship,sun,astronaut,stars,scene){
    const disposedItems = [spaceship,sun,astronaut]

    for (let i = 0; i<disposedItems.length; i++){
        scene.remove(disposedItems[i])

        disposedItems[i].traverse( function(children) {
            if (children.isMesh){
                children.material.dispose()
                children.geometry.dispose()
            }
        });
    }

    scene.remove(stars)
    stars.geometry.dispose()
    stars.material.dispose()
}

// Updates mouse cords
function onDocumentMouseMove(e){
    mouseX = e.clientX
    mouseY = e.clientY

    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, cameraTween );
	const found = raycaster.intersectObjects( sceneTween.children, true );

    if(found[0]?.object.name==="path23"){
        createjs.Tween.get(jsLogoTween.position).to({ x: Math.random()*3 + 8.5, y: -9.5, z: Math.random()*3 + 24.6 }, 100, createjs.Ease.getPowInOut(1.2));
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        $(".small-screen-icon").css("display","unset")
        $(".full-screen-icon").css("display","none")
    } else {
        if (document.exitFullscreen) {
            $(".small-screen-icon").css("display","none")
            $(".full-screen-icon").css("display","unset")
            document.exitFullscreen();
        }
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
const vertex = new Vector3();


export function animate(clock,earth,moon,camera,astronaut,renderer,scene,mars,sun3,sunMainFlare,flares,controls,mobileControls,blackSphere,pointlight1,pointlight2,pointlight3,marsBackgroundTexture,marsBackgroundMobileTexture,backgroundTexture,backgroundMobileTexture,jsLogo,bloomPass,afterImage,picerFlag,startsCount,starsPositions,stars,starTexture,composer,spaceship){
    targetX = mouseX * .001
    targetY = mouseY * .001
    cameraTween = camera
    sceneTween = scene
    // jsLogoTween = jsLogo
    picerFlagTween = picerFlag
    afterImageTween = afterImage
    bloomPassTween = bloomPass
    pointlight3Tween = pointlight3
    marsTimer = $(".timer").get(0).innerHTML
    
    // Main clock
    const elapsedTime = clock.getElapsedTime()
    
    // Update objects
    earth.rotation.y = 0.1 * elapsedTime
    moon.rotation.y = -0.15 * elapsedTime
    
    if (astronaut){
        astronaut.position.x = -0.001 * elapsedTime
        astronaut.rotation.y = 0.2 * elapsedTime
        astronaut.rotation.z = 0.1 * elapsedTime
    }

    if(moonStart){
        t=0.18 * clockResetMoon(elapsedTime,firstTriggerMoon)
        moon.position.x = 11.4*Math.cos(t) -0.7
        moon.position.z = 11.4*Math.sin(t) -0.5
        firstTriggerMoon = false
    }
    
    // Moves the sphere from spaceship creating transision effect
    if (spaceshipPositionTrigger===false){
        blackSphere.position.x = -0.5 * clockResetSphere(elapsedTime,firstTriggerSphere) + 25
        firstTriggerSphere = false
    }
    
    // Triggers mars scene when moon is in front of the camera
    if (moon.position.x < -0.45 && spaceshipPositionTrigger){
        spaceshipScene()
        
        // Delele uneeded items
        disposeEarthScene(scene,earth,astronaut,moon)
        
        // Makes this if run once
        spaceshipPositionTrigger = false
        spaceshipZIndexTrigger = true
    }
    
    if (spaceshipSceneTrigger){
        camera.position.set(25,25,0)
        camera.lookAt(new Vector3(25,25,-1))

        stars.position.set(25, 25, -1.5)
        clockReset = elapsedTime

        pointlight1.intensity = 0
        pointlight2.intensity = 1.2
        pointlight2.position.set(25,24.9,0.6)
        pointlight2.color = new Color(0xff9393)
        pointlight3.intensity = 0
        pointlight3.position.set(-100,-40,-200)

        bloomPassTween.strength = 0.4
        bloomPassTween.threshold = 0.15

        // stars.material.map = starTexture
        // stars.material.transparent = false
        // stars.material.depthTest = false
        // stars.renderOrder = 0
            
        afterImage.enabled = true
        warpEffect = true
        spaceshipSceneTrigger = false
    }

    if(marsTimer=="00:00" && marsPositionTrigger){
        clearInterval(lightsInterval)
        spaceshipEndAnimation(pointlight1,pointlight2,sun3,sunMainFlare,flares)
        
        // Change camera position to mars
        setTimeout(() => {
            disposeSpaceshipScene(spaceship,sun3,astronaut,stars,scene)
            camera.position.set(5.3,-8,26)
            camera.lookAt(new Vector3(18,-13,20))
            if(window.innerWidth>800){
                scene.background = marsBackgroundTexture
            } else {
                scene.background = marsBackgroundMobileTexture
            }
            // Set mars lights
            pointlight1.intensity = 1
            pointlight2.intensity = 1.5
            pointlight3.position.set(-11, 20, 20)
            pointlight3.intensity = 1.8

            // Disable effects
            bloomPass.enabled = false
            afterImage.enabled = false
            particles = false
        }, 8100);
        marsPositionTrigger = false
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

    if (returned && warpEffect){
        clockReset = elapsedTime
        initialPositionAboutUs = []
        starSpeed = 0
        returned = false
    } 

    // Particle animation
    if(particles){
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
                    
                    if(starsPositions[i3+2] > 3 || starsPositions[i3+2] > 1 && starsPositions[i3+1] < 0){
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
    }
        
    // Camera movment while on earth scene
    if(targetX && moonStart===false && !mobile){
        camera.position.x = (mouse.x/50) - 0.5
        camera.position.y = (mouse.y/50) + 0.2
    }

    // Camera movment while on spaceship scene
    if(targetX && warpEffect && !mobile){
        camera.rotation.x = (mouse.y/5)
        camera.rotation.y = -(mouse.x/5) 
    }
        
    // Update Orbital Controls
    // controls.update()

    // Render
    composer.render(scene, camera)
}
    