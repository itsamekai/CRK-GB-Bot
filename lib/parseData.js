const { healthImage, getPlayerAndCount } = require('../lib/screenshot')
const { readInfo } = require('../lib/readData')
const membersID = require('../id.json')

const correctNames = [
    'Astær',          'BadDragons',
    'BigBadCookie',   'BiscoctusAmogus',
    'BiscoffButter',  'Bitcoin',
    'Brenguks',       'Cage',
    'ChocoMilt',      'CrunchyBiscuit',
    'DakinaMGF',      'EboyCookies',
    'EgirlCookies',   'Fartlicious',
    'IcedGemBiscuit', 'Interval',
    'MarshMallow',    'Milderror',
    'NovichCookie',   'Parfait지너스',
    'RamenCookie',    'Shiguling',
    'Tatimaru',       'TheControlCastle',
    'TheRealAubrey',  'VolatileQueefs',
    'asagai',         'ridleo',
    'twinleeaf',      'xinlin'
  ]
  

// get hp and level of drag
async function getDmgHealth() {
    let state = []
    
    const imagePath = await healthImage()
    let level = await readInfo(imagePath[0], 'lvl')
    level = level.replace(/(\r\n|\n|\r)/gm, "");
    level = level.slice(3)
    state.push(level)   
    let health = await readInfo(imagePath[1], 'hp') 
    health = health.replace(/(\r\n|\n|\r)/gm, "");
    health = health.substring(0, health.indexOf('('))
    state.push(health)
    console.log(state)
  
    return state
  }

async function getPlayerAttackCount() {

    let player = []
    let count = []
    let x, y;
    let status = false
    while (x != 30 || y != 30 || !status) {
        let imagePath = await getPlayerAndCount()
        try {
            for (let i = 0; imagePath.players.length > i; i++) {
              let playerT = await readInfo(imagePath.players[i], 'others')
              let attackT = await readInfo(imagePath.attacks[i], 'contri')
              let filteredPlayers = filterData(playerT)
              let filteredAttacks = filterAttackData(attackT)
              for (let x = 0; filteredAttacks.length > x; x++) {
                // console.log(filteredPlayers[x], filteredAttacks[x])
                if (filteredPlayers[x].includes('Parfait')) {
                  player.push("Parfait지너스")
                } else if (filteredPlayers[x].includes('Astzer') || filteredPlayers[x].includes('Astaer') || filteredPlayers[x].includes('Astazer')) {
                    player.push("Astær")
                } else if (filteredPlayers[x].includes('Marshmiallow') || filteredPlayers[x].includes('MarshMiallow')) {
                    player.push('MarshMallow')
                } else if (filteredPlayers[x].includes('EgirICookies') || filteredPlayers[x].includes('EgirLCookies')) {
                    player.push('EgirlCookies')
                } else player.push(filteredPlayers[x])
                count.push(filteredAttacks[x])
              }
            }
        
          } catch (e) { 
            console.log(e.message)
          }

        x = player.length
        y = count.length
        console.log(player.length)
        console.log(count.length)
        // temp is used to check player names
        const temp = player.slice().sort()
        console.log(JSON.stringify(correctNames) === JSON.stringify(temp))
        console.log(temp)


        if (x != 30 || y != 30) {
            console.log("data not read properly. retrying.")
            player = []
            count = []

        } else if (JSON.stringify(correctNames) === JSON.stringify(temp)) {
            status = true
            console.log("data read properly.")

        } else {
            console.log("one or more of the names are not read properly, retrying")
            player = []
            count = []
        }
        
        
    }

    // put them in a dict side by side
    let dict = {}
    for (let i = 0; player.length > i; i++) {
        dict[player[i]] = count[i]
    }
    console.log(dict)

    return dict
    
}

function getAttackers(original, after) {
    console.log("original: \n")
    console.log(original)
    console.log("after: \n")
    console.log(after)
    let attacked = []
    let output = ''
    for (const name in original) {
        console.log(name)
        if (original[name] != after[name]) {
            // console.log(original[name], after[name])
            attacked.push(name)
        }
    }

    console.log(attacked)
    attacked.forEach(e => {
        output += e + ", "
    })
    output = output.substring(0, output.length - 2)
    return output
}

function filterData(array) {
    let filtered;
    filtered = array.split(/\r?\n/)
    const final = filtered.filter(e => {
        return e !== ''
    })
    return final
}

function filterAttackData(array) {
    let filtered;
    let finalised = []
    filtered = array.split(/\r?\n/)
    let final = filtered.filter(e => {
        return e !== ''
    })
    final.forEach(e => {
        if (e.length > 3) {
            finalised.push(0)
        } else {
            finalised.push(e.charAt(0))
        }
    })

    return finalised
}

function outputAttackCount(dict) {
    
    let zeros = ''
    let ones = ''
    let twos = ''
    
    for (const name in dict) {
    //   console.log(a[name])
      if (dict[name] == 0) zeros += "• " + name + "\n"
      if (dict[name] == 1) ones += "• " + name + "\n"
      if (dict[name] == 2) twos += "• " + name + "\n"
    }
    
    let output = "0/3: \n" + zeros + "\n1/3: \n" + ones + "\n2/3:\n" + twos
    
    return output
}

// takes in a dict, compare who needs to be pinged (0/3, 1/3, 2/3 only)
async function pingOutput(client, dict) {
    let output = ''
    for (const name in dict) {
        if (dict[name] != 3) {
          let id = membersID.members[name]
           let person = await client.users.fetch(id)
           output += person.toString() + " " 
        }
    }
    if (output.length === 0) {
        return "Everyone has done their attacks."
    } else {
        output += "\n\n Reminder to slap the dragon or Salah slaps you <:frogangry:983741860298256425> jk we love you all"
        // output += "\n\nmy test subjects hello"
    }
  
    return output
    
  }




  module.exports = {
    getDmgHealth,
    getPlayerAttackCount,
    getAttackers,
    filterData,
    outputAttackCount, 
    pingOutput
  }
  

