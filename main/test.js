const { createWorker } = require('tesseract.js');
const path = require('path')
const { getPlayerAndCount } = require('../lib/screenshot')
const { getDmgHealth, getPlayerAttackCount, getAttackers, filterData } = require('../lib/parseData')
const robot = require('robotjs')
const ks = require('node-key-sender')
const tesseract = require("node-tesseract-ocr");
const { default: xrandr } = require('xrandr');

const worker = createWorker();
// // const rectangle = { left: 914, top: 915, width: 320, height: 50 };
// const rectangle = { left: 924, top: 922, width: 309, height: 31 };
// // left is the distance from the upper-left corner of the bounding box, to the left border of the image.
// // top is the distance from the upper-left corner of the bounding box, to the top border of the image.
// // width and height are the width and height of the bounding box.
// // const rectangle = { left: 1051, top: 797, width: 208, height: 65 };

// https://github.com/tesseract-ocr/tesseract/blob/main/doc/tesseract.1.asc


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


async function main() {
  try {
    let imagePath = path.join(__dirname, "../images/lvl.png")
    let text = await tesseract.recognize(imagePath, levelConfig)
    console.log(text)

  } catch (e) {
    console.log(e.message)
  }
}

// async function main() {

//   let imagePath = await getPlayerAndCount()

//   try {
//     let player = []
//     let count = []
//     for (let i = 0; imagePath.players.length > i; i++) {
//       let playerT = await tesseract.recognize(imagePath.players[i], config)
//       let attackT = await tesseract.recognize(imagePath.attacks[i], config)
//       console.log(playerT)
//       let filteredPlayers = filterData(playerT)
//       let filteredAttacks = filterData(attackT)
//       for (let x = 0; filteredAttacks.length > x; x++) {
//         if (filteredPlayers[x].includes('Parfait')) {
//           player.push("Parfait지너스")
//         } else player.push(filteredPlayers[x])

//         count.push(filteredAttacks[x])
//       }
//     }

//   } catch (e) { 
//     console.log(e.message)
//   }
// }

async function test() {
  let imagePath = await getPlayerAndCount()

  // players: playerPath,
  // attacks: attackPath
  console.log(imagePath)
  try {
    let playerText = await tesseract.recognize(imagePath.players, playerAndCountConfig)
    let contriText = await tesseract.recognize(imagePath.attacks, playerAndCountConfig)
    // console.log(playerText)
    playerText = playerText.split(/\r?\n/)
    console.log(playerText)

    console.log("\n")
    console.log(contriText)
  } catch (e) {
    console.error(e)
  }
}

// test()
// main()

let level = 

function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function sortObject(unsorted) {
  const ordered = Object.keys(unsorted).sort().reduce(
    (obj, key) => { 
      obj[key] = unsorted[key]; 
      return obj;
    }, 
    {}
  );
  return ordered
}