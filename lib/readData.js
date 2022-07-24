const fs = require('fs');
const path = require('path')
const robot = require("robotjs");
const { createWorker } = require('tesseract.js');
const { healthImage } = require('../lib/screenshot')

// image variable should contain the image path. 
// screenshot image > save into /images/<image>.png
async function readHealthLevel(image, options) {

  const worker = createWorker()
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  if (options === 'lvl') {
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789Lv.',
    });
  }
  else if (options === 'hp') {
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789()%',
    });
  }
  
  const { data: { text } } = await worker.recognize(image);
  await worker.terminate();
  return text
}


async function getDmgHealth() {
  let state = []
  
  const imagePath = await healthImage()
  let level = await readHealthLevel(imagePath[0], 'lvl')
  level = level.replace(/(\r\n|\n|\r)/gm, "");
  level = level.slice(3)
  state.push(level)   
  let health = await readHealthLevel(imagePath[1], 'hp') 
  health = health.substring(0, health.indexOf('('))  
  state.push(health)
  console.log(state)

  return state
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
  readHealthLevel,
  sleep,
  refreshClick,
  getDmgHealth
}