const { refreshClick, sleep} = require('../lib/readData') 
const { getDmgHealth, getPlayerAttackCount, getAttackers } = require('../lib/parseData')
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const moment = require('moment')
require('dotenv').config()

// for refresh state
let currentLevel, currentHealth 

client.on('ready', async () => {

    console.log(`Logged in as ${client.user.tag}!`);
    // GH: 1000021815147634718
    // test: 999236399536537610
    const testChannel = client.channels.cache.get('1000021815147634718')
    
    console.log("---Initializing first data---")
    // for calculating time elapsed
    const initialTime = new Date()
    // get player and player attack counts
    let attackCounts = await getPlayerAttackCount()
    let sortedAttacks = sortObject(attackCounts)
    console.log("sorted attacks original state:\n" + JSON.stringify(sortedAttacks))

    // get hp and level
    const initialValues = await getDmgHealth()
    currentLevel = initialValues[0]
    currentHealth = initialValues[1]

    const finalTime = new Date()
    console.log("time elapsed at initialization: " + Math.round((finalTime - initialTime) / 1000)) 
    let x = 1
    while (true) {
      await sleep(30000)
      console.log("---checking drag status now, count= " + x + "---")
      try {
        const startTime = new Date()
        x++
        await refreshClick()
        await sleep(250)

         // 0 = health, 1 = level, 2 = damage dealt, 3 = level difference
        const values = await getDmgHealth()
        let newLevel = values[0]
        let newHealth = values[1]
        let damage = Math.abs(currentHealth - newHealth)
        let levelValue = Math.abs(currentLevel - newLevel)
        console.log("damage: " + addCommas(damage))
        console.log("level diff: " + levelValue)

        // dragon is defeated
        if (damage > 0 && levelValue > 0) {
          // let totalDamage 
          // need to add total damage with drag hp
          currentLevel = newLevel
          currentHealth = newHealth
          let newCount = await getPlayerAttackCount()
          let sortedNewCount = sortObject(newCount)
          let attackers = getAttackers(sortedAttacks, sortedNewCount)
          sortedAttacks = sortedNewCount
          let oldLvl = currentLevel - 1
          testChannel.send("Level " + oldLvl + " dragon has been swept by " + attackers + ". Lv " + newLevel + " dragon is now up with " + addCommas(newHealth) + " HP.")
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);
          
          // dragon is damaged
        } else if (damage > 0 && levelValue === 0) {
          currentHealth = newHealth
          let newCount = await getPlayerAttackCount()
          let sortedNewCount = sortObject(newCount)
          let attackers = getAttackers(sortedAttacks, sortedNewCount)
          sortedAttacks = sortedNewCount
          testChannel.send(attackers + " has dealt " + addCommas(damage) + " damage to Lv." + currentLevel + " dragon. " + addCommas(newHealth) + " HP left.")
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);      
        }

        else {
          const time = Date.now()
          console.log("no change to drag, timestamp: " + moment(time).format("DD MM YYYY hh:mm:ss"))
        }
        
        let endTime = new Date()
        console.log("time elapsed: " + Math.round((endTime - startTime) / 1000)) 
        
      } catch (e) {
        console.error(e)
      }
    }
  });
  client.login(process.env.BOT_TOKEN)
  



  function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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



// test()