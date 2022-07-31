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
// const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config()
const membersID = require('../id.json')


const a = {
  Milderror: 3,
  MarshMallow: 3,
  Interval: 3,
  Shiguling: 3,
  DakinaMGF: 3,
  VolatileQueefs: 3,
  'Astær': 3,
  ChocoMilt: 3,
  Tatimaru: 3,
  BiscoctusAmogus: '3',
  ridleo: '3',
  Cage: '1',
  xinlin: '3',
  Bitcoin: '3',
  EgirlCookies: '3',
  Fartlicious: '3',
  IcedGemBiscuit: '3',
  'Parfait지너스': '3',
  asagai: '3',
  EboyCookies: '3',
  BiscoffButter: '3',
  BadDragons: '3',
  twinleeaf: '3',
  Brenguks: '3',
  TheControlCastle: '3',
  RamenCookie: '3',
  NovichCookie: '3',
  CrunchyBiscuit: '3',
  TheRealAubrey: '3',
  BigBadCookie: '3'
}



// let zeros = ''
// let ones = ''
// let twos = ''
// let threes = ''

// for (const name in a) {
//   console.log(a[name])
//   if (a[name] == 0) zeros += "• " + name + "\n"
//   if (a[name] == 1) ones += "• " + name + "\n"
//   if (a[name] == 2) twos += "• " + name + "\n"
//   if (a[name] == 3) threes += "• " + name + "\n"
// }

// let output = "0/3: \n" + zeros + "\n1/3: \n" + ones + "\n2/3:\n" + twos + "\n3/3:\n" + threes
// console.log(output)

let output = ''
// for (let i = 0; 5 > i; i++) {
//   output += " "
// }
console.log(output.length)

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