const screenshot = require('screenshot-desktop')
const path = require('path')
const Jimp = require('jimp')
const robot = require('robotjs')
const ks = require('node-key-sender')
const { time } = require('console')

// https://github.com/ben   cevans/screenshot-desktop/blob/main/examples/multiScreens.js
// for some reason it doesn't work on my ubuntu distri?

async function healthImage() {
    const filePath = path.join(__dirname, "../", "images/healthAndLevel.png")
    const healthPath = path.join(__dirname, "../", "images/health.png")
    const levelPath = path.join(__dirname, "../", "images/lvl.png")
    let paths = [levelPath, healthPath]
    // emulator is at display 2, screenshot that instead
    try {
        // await fs.mkdirSync(path.join(__dirname, "../images/"))
        const displays = await screenshot.listDisplays()
        const display = displays[1]
        // screenshots display 2 here.
        await screenshot({ screen: display.id, filename: filePath })
        
        // x = 2843, y = 925
        // x = 3151, y = 927
        // offsets are specific to full screen assuming 1920x1080
        await sleep(3000)
        // await crop(filePath, levelPath, healthPath)
        cropLevelHealth(filePath, levelPath, healthPath)

        return paths 

    } catch (e) {
        console.error(e)
    }
}

async function getPlayerAndCount() {
    // coordinates of 'today's participants': x - 3143, 217
    // open up contribution UI
    await openMacro()
    const displays = await screenshot.listDisplays()
    const display = displays[1]
    try {
        for (let x = 1; 6 >= x; x++) {
            // main screenshot
            let fName = "contriInfo" + x + ".png"
            let filePath = path.join(__dirname, "../images/contributions/", fName)
            
            // player screenshot
            let pfName = "playerInfo" + x + ".png"
            let pfPath = path.join(__dirname, "../images/contributions/", pfName)

            // player's attacks screenshot
            let contriName = "playerContri" + x + ".png"
            let contriPath = path.join(__dirname, "../images/contributions/", contriName)

            // screenshot and crop
            await screenshot({ screen: display.id, filename: filePath })
            await cropBattles(filePath, pfPath, contriPath)

            // scroll
            if (x !=6) {
                await scrollContri()
                await sleep(1800)     
            } 
            else break
             
        }

        await closeUIs()



    } catch (e) {
        console.error(e)
    }
    

}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

function cropBattles(filePath, playerPath, battlesPath) {
    Jimp.read(filePath)
    .then(pImg => {
        return pImg
        .crop(520, 288, 335, 590)
        .write(playerPath)
    })

    Jimp.read(filePath)
    .then(battleImg => {
        return battleImg
        .crop(864, 290, 180, 587)
        .write(battlesPath)
    })
}

// scrolls by enabling the macro.
async function scrollContri() {
  robot.moveMouse(3505, 476)
  robot.mouseClick()
}

// opens the contribution window then the macro by enabling crtl + 8
async function openMacro() {
    robot.moveMouse(3143, 217)
    await sleep(250)
    robot.mouseClick()
    ks.sendCombination(['control', '8'])
    await sleep(250)
    robot.moveMouse(2952, 447)
    robot.mouseToggle("down")
    robot.dragMouse(3421, 346)
    robot.mouseToggle("up")
}

async function closeUIs() {
    // closes macro window
    robot.moveMouse(3588, 353)
    await sleep(250)
    robot.mouseClick()
    // closes guild battle status ui
    robot.moveMouse(3405, 137)
    await sleep(250)
    robot.mouseClick()

}


function cropLevelHealth(filePath, levelPath, healthPath) {
    Jimp.read(filePath)
    .then(levelImg => {
        return levelImg
        .crop(923, 780, 340, 100)
        .write(levelPath)
    })
    .catch(err => {
        console.error(err)
    })

    Jimp.read(filePath)
    .then(healthImg => {
        return healthImg
        .crop(928, 915, 320, 50)
        .write(healthPath)
    })
    .catch(err => {
        console.error(err)
    })
}



module.exports = {
    healthImage,
    crop: cropLevelHealth,
    getPlayerAndCount
}