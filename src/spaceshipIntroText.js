let spaceshipFirstText = ""

export function spaceshipIntroText(){
    let textToInsert = $(".text-1").text()
    $(".text-1").text("")

    for(let i=0; i<textToInsert.length; i++){
        setTimeout(() => {
            spaceshipFirstText += textToInsert[i]
            $(".text-1").text(`${spaceshipFirstText}`)
        }, 80 * (i+1));
    }
}