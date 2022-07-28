const { createWorker } = require('tesseract.js');
const path = require('path')
const { getPlayerAndCount } = require('../lib/screenshot')
const { getDmgHealth, getPlayerAttackCount, getAttackers, filterData } = require('../lib/parseData')
const robot = require('robotjs')
const ks = require('node-key-sender')
const tesseract = require("node-tesseract-ocr");
const { default: xrandr } = require('xrandr');
const { Client, GatewayIntentBits } = require('discord.js');
const { refreshClick } = require('../lib/readData');
const Jimp = require('jimp');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config()

const worker = createWorker();

const correctNames = [
  'Astær',          'BadDragons',
  'BigBadCookie',   'BiscoctusAmogus',
  'BiscoffButter',  'Bitcoin',
  'Brenguks',       'Cage',
  'ChocoMilt',      'CrunchyBiscuit',
  'DakinaMGF',      'EboyCookies',
  'EgirICookies',   'Fartlicious',
  'IcedGemBiscuit', 'Interval',
  'MarshMallow',    'Milderror',
  'NovichCookie',   'Parfait지너스',
  'RamenCookie',    'Shiguling',
  'Tatimaru',       'TheControlCastle',
  'TheRealAubrey',  'VolatileQueefs',
  'asagai',         'ridleo',
  'twinleeaf',      'xinlin'
]

const second = [
  'Astær',          'BadDragons',
  'BigBadCookie',   'BiscoctusAmogus',
  'BiscoffButter',  'Bitcoin',
  'Brenguks',       'Cage',
  'ChocoMilt',      'CrunchyBiscuit',
  'DakinaMGF',      'EboyCookies',
  'EgirICookies',   'Fartlicious',
  'IcedGemBiscuit', 'Interval',
  'MarshMallow',    'Milderror',
  'NovichCookie',   'Parfait지너스',
  'RamenCookie',    'Shiguling',
  'Tatimaru',       'TheControlCastle',
  'TheRealAubrey',  'VolatileQueefs',
  'asagai',         'ridleo',
  'twinleeaf',      'xinlin'
]

const test1 = {
  'Astær': 0,
  BadDragons: 0,
  BigBadCookie: '1',
  BiscoctusAmogus: '1',
  BiscoffButter: '1',
  Bitcoin: '1',
  Brenguks: '2',
  Cage: '2',
  ChocoMilt: '2',
  CrunchyBiscuit: '2',
  DakinaMGF: '3',
  EboyCookies: '3',
  EgirICookies: '3',
  Fartlicious: '3',
  IcedGemBiscuit: '3',
  Interval: '3',
  MarshMallow: '3',
  Milderror: '3',
  NovichCookie: '3',
  'Parfait지너스': '3',
  RamenCookie: '3',
  Shiguling: '3',
  Tatimaru: '3',
  TheControlCastle: '3',
  TheRealAubrey: '3',
  VolatileQueefs: '3',
  asagai: '3',
  ridleo: '3',
  twinleeaf: '3',
  xinlin: '3'
}

const test2 = {
  'Astær': 0,
  BadDragons: 0,
  BigBadCookie: '1',
  BiscoctusAmogus: '1',
  BiscoffButter: '1',
  Bitcoin: '1',
  Brenguks: '2',
  Cage: '2',
  ChocoMilt: '2',
  CrunchyBiscuit: '2',
  DakinaMGF: '3',
  EboyCookies: '3',
  EgirICookies: '3',
  Fartlicious: '3',
  IcedGemBiscuit: '3',
  Interval: '3',
  MarshMallow: '3',
  Milderror: '3',
  NovichCookie: '3',
  'Parfait지너스': '3',
  RamenCookie: '3',
  Shiguling: '3',
  Tatimaru: '3',
  TheControlCastle: '3',
  TheRealAubrey: '3',
  VolatileQueefs: '3',
  asagai: '3',
  ridleo: '3',
  twinleeaf: '3',
  xinlin: '3'
}

async function main() {
  await getPlayerAttackCount()
}

main()
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

// client.on('ready', async () => {
  
//   console.log(`Logged in as ${client.user.tag}!`);
//   const channel = client.channels.cache.get('999236399536537610')

//   let level = '100'
//   let newlevel = '101'
//   let name = 'Cage'
//   let damage = 25512345
//   let health = 133444555
//   let newhealth = 12312313213
//   channel.send("**Lv. " + level + "** Dragon :birb: \n **| " + name + "** has dealt **" + addCommas(damage) + "** damage.\n **| " + addCommas(health) + "** HP remaining! \n :cleanup: :cleanup: cleanup: :cleanup: :cleanup:")
//   channel.send(":cleanup: Lv.**" + level + "** Dragon has been swept! :cleanup: \n**| " + name + "** has swept the dragon with **" + addCommas(health) + "** left. :pinksalute:\n**|** Lvl. **" + newlevel + "** dragon up with **" + addCommas(newhealth) + "** hp. :RVDragon:" )
//   .then(message => console.log(`Sent message: ${message.content}`))
//   .catch(console.error);    
// })

// client.login(process.env.BOT_TOKEN)
// async function main() {
//   const initialTime = new Date()
//   await refreshClick()
//   const finalTime = new Date()
//   console.log("time elapsed: " + Math.round((finalTime - initialTime) / 1000)) 
// }



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