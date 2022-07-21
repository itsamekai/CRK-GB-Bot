const fs = require('fs');
const path = require('path')
const robot = require("robotjs");
const { createWorker } = require('tesseract.js');
const { healthImage, crop } = require('../lib/screenshot')

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

async function getData() {
  // [0] is health, [1] is lvl
  let state = []
  console.log("getting data")
  
  const imagePaths = await healthImage()  
  let level = await readHealthLevel(imagePaths[0], 'lvl')
  level = level.substring(3)
  state.push(level)   
  let health = await readHealthLevel(imagePaths[1], 'hp') 
  health = health.substring(0, health.indexOf('('))  
  state.push(health)
  // const deletePath = path.join(__dirname, "../images/")

  // await fs.rmSync(deletePath, {
  //   recursive: true
  // })

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
  getData,
  sleep,
  refreshClick
}