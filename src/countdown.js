let currentTime
let displayTime
let timerInterval
let speedIncreaseChange

export function startTimer(duration, display, speedIncrease) {
    if($(".timer").get(0).innerHTML=="00:00"){
        clearInterval(timerInterval)
    } else {
        if (speedIncreaseChange !== speedIncrease){
            // Clears interval if exists
            timerInterval && clearInterval(timerInterval)
            
            // Creats new interval if timer is not 0
            timerInterval = currentTime !==0 && setInterval(function () {
        
                currentTime = currentTime ? currentTime - 1 : duration - 1
                displayTime = currentTime < 10 ? "0" + currentTime : currentTime
                display.text("00:" + `${displayTime}`)
                
                if (currentTime === 0) {
                    clearInterval(timerInterval)
                }
            }, 1000 / speedIncrease);
        }
        speedIncreaseChange = speedIncrease
    }
}
