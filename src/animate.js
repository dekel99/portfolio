import {OrbitControls} from 'three';
/**
 * Animate
 */

 document.addEventListener("mousemove", onDocumentMouseMove)

//  $(".view-btn").click(() => {
//      animateCamera=true
//      createjs.Tween.get(camera.position).wait(500).to({ z: 5 }, 1500, createjs.Ease.getPowInOut(3)).wait(500);
//     })

 let mouseX
 let mouseY
 let targetX
 let targetY
 let t = 0
 let trigger = true
 
 
 function onDocumentMouseMove(e){
     mouseX = e.clientX
     mouseY = e.clientY
 }

export function animate(clock,earth,moon,camera,astronaut,renderer,scene,moonStart,mars,controls){
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    earth.rotation.y = 0.1 * elapsedTime
    moon.rotation.y = -0.15 * elapsedTime
    
    t+=0.002
    // console.log(moon.position)
    if (moon.position.x < -0.45 && trigger){
        controls.target = mars.position.clone();
        camera.lookAt(mars.position.clone())
        // camera.position.set(0,-0.5,0.5)
        trigger = false
    }

    if(moonStart){
        moon.position.x = 4*Math.cos(t) -0.7
        moon.position.z = 4*Math.sin(t) -0.5
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

    // if(targetX){
    //     camera.position.x = -0.6 + (targetX/13)
    //     camera.position.y = 0.15 + (targetY/13)
    // }


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
}
