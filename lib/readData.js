const robot = require("robotjs");
const tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng",
  oem: 3,
  psm: 3,
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

  return text

}


async function refreshClick() {
  robot.moveMouse(3034, 727)
  await sleep(2000)
  robot.mouseClick()
  robot.moveMouse(3691, 79)
  await sleep(2000)
  robot.mouseClick()
  robot.moveMouse(2613, 313)
  await sleep(2000)
  robot.mouseClick()
  robot.mouseClick()
  await sleep(1000)
  robot.mouseClick()
  robot.mouseClick()
}


function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}


module.exports = {
  sleep,
  refreshClick,
  readInfo
}