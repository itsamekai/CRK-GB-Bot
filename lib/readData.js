const robot = require("robotjs");
const tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng",
  oem: 3,
  psm: 3,
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
}

const levelConfig = {
  lang: "eng",
  oem: 3,
  psm: 3,
  tessedit_char_whitelist: '0123456789Lv.'
}

const healthConfig = {
  lang: "eng",
  oem: 3,
  psm: 3,
  tessedit_char_whitelist: '0123456789()%'
}

const contriConfig = {
  lang: "eng",
  oem: 3,
  psm: 3
}


// reads info with OCR tesseract
async function readInfo(image, options) {

  let text;

  if (options === 'lvl') {
    text = await tesseract.recognize(image, levelConfig)
  }
  else if (options === 'hp') {
    text = await tesseract.recognize(image, healthConfig)
  }

  else if (options === 'others') {
    text = await tesseract.recognize(image, config)
  }
  else if (options === 'contri') {
    text = await tesseract.recognize(image, contriConfig)
  }

  return text

}


async function refreshClick() {
  robot.moveMouse(3034, 727)
  await sleep(250)
  robot.mouseClick()
  robot.moveMouse(3691, 79)
  await sleep(500)
  robot.mouseClick()
  robot.moveMouse(2613, 313)
  await sleep(1500)
  for (let x = 0; 20 > x; x++) {
    robot.mouseClick()
  }
}


function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}


module.exports = {
  sleep,
  refreshClick,
  readInfo
}