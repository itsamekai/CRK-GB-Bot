const { refreshClick, getDmgHealth, sleep} = require('../lib/readData') 
const { Client, GatewayIntentBits } = require('discord.js');
const moment = require('moment')
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

require('dotenv').config()

// for refresh state
let currentLevel, currentHealth 

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // GH: 1000021815147634718
    // test: 999236399536537610
    const testChannel = client.channels.cache.get('1000021815147634718')
    // get data for once.
    console.log("---Initializing first data---")
    const initialValues = await getDmgHealth()
    currentLevel = initialValues[0]
    currentHealth = initialValues[1]
    let x = 1
    while (true) {
      await sleep(55000)
      console.log("---checking drag status now, count= " + x + "---")
      try {
        x++
        await refreshClick()
        await sleep(1000)
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
          // testChannel.send(damage + " damage has been done. Level " + newLevel + " dragon is now up with " + newHealth + " HP.")
          testChannel.send("Level " + newLevel + " dragon is now up with " + addCommas(newHealth) + " HP.")
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);
          
          // dragon is damaged
        } else if (damage > 0 && levelValue === 0) {
          currentHealth = newHealth
          testChannel.send(addCommas(damage) + " damage has been dealt to Lv." + currentLevel + " dragon. " + addCommas(newHealth) + " HP left.")
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);      
        }

        else {
          const time = Date.now()
          console.log("no change to drag, timestamp: " + moment(time).format("DD MM YYYY hh:mm:ss"))
        }        
        
      } catch (e) {
        console.error(e)
      }
    }
  });
  client.login(process.env.BOT_TOKEN)
  



  function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



// test()