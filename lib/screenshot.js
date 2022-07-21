const screenshot = require('screenshot-desktop')
const path = require('path')
const sharp = require('sharp')
const Jimp = require('jimp')


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
        await screenshot({ screen: display.id, filename: filePath})
        
        // x = 2843, y = 925
        // x = 3151, y = 927
        // offsets are specific to full screen assuming 1920x1080
        await sleep(3000)
        // await crop(filePath, levelPath, healthPath)
        crop(filePath, levelPath, healthPath)

        return paths 

    } catch (e) {
        console.error(e)
    }
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }


function crop(filePath, levelPath, healthPath) {
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
        .crop(935, 915, 320, 50)
        .write(healthPath)
    })
    .catch(err => {
        console.error(err)
    })
}



module.exports = {
    healthImage,
    crop
}