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
    // testChannel.send("test: <a:cleanup:968974523938508821> <:pinksalute:966121040692539422> <a:RVDragon:1001399138623164476> ")
    console.log("---Initializing first data---")
    // for calculating time elapsed
    const initialTime = new Date()
    // get player and player attack counts
    let attackCounts = {}
    let sortedAttacks = {}
    attackCounts = await getPlayerAttackCount()
    sortedAttacks = sortObject(attackCounts)
    console.log("sorted attacks original state:")
    console.log(sortedAttacks)

    // get hp and level
    const initialValues = await getDmgHealth()
    currentLevel = initialValues[0]
    currentHealth = initialValues[1]

    const finalTime = new Date()
    console.log("time elapsed at initialization: " + Math.round((finalTime - initialTime) / 1000)) 
    let x = 1
    while (true) {
      await sleep(10000)
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
          let beforeHealth = currentHealth
          currentLevel = newLevel
          currentHealth = newHealth
          let newCount = await getPlayerAttackCount()
          let sortedNewCount = sortObject(newCount)
          let attackers = getAttackers(sortedAttacks, sortedNewCount)
          sortedAttacks = sortedNewCount
          let oldLvl = currentLevel - 1

          testChannel.send("<a:cleanup:968974523938508821> Lv.**" + oldLvl + "** Dragon has been swept! <a:cleanup:968974523938508821>\n**| " 
          + attackers + "** has swept the dragon with **" + addCommas(beforeHealth) + "** left. <:pinksalute:966121040692539422>\n**|** Lvl. **" 
          + newLevel + "** dragon up with **" + addCommas(newHealth) + "** hp. <a:RVDragon:1001399138623164476>" )
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);
          
          // dragon is damaged
        } else if (damage > 0 && levelValue === 0) {
          currentHealth = newHealth
          let newCount = await getPlayerAttackCount()
          let sortedNewCount = sortObject(newCount)
          let attackers = getAttackers(sortedAttacks, sortedNewCount)
          sortedAttacks = sortedNewCount
          let cleanupEmote = "<a:cleanup:968974523938508821> <a:cleanup:968974523938508821> <a:cleanup:968974523938508821> <a:cleanup:968974523938508821> <a:cleanup:968974523938508821>"
          testChannel.send("**Lvl " + currentLevel + "** Dragon <a:RVDragon:1001399138623164476> \n **| " 
          + attackers + "** has dealt **" + addCommas(damage) + "** damage.\n **| " 
          + addCommas(newHealth) 
          + "** HP remaining! \n" + cleanupEmote)
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