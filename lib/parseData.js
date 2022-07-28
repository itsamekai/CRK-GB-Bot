const { healthImage, getPlayerAndCount } = require('../lib/screenshot')
const { readInfo } = require('../lib/readData')

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
              let attackT = await readInfo(imagePath.attacks[i], 'others')
              let filteredPlayers = filterData(playerT)
              let filteredAttacks = filterAttackData(attackT)
              for (let x = 0; filteredAttacks.length > x; x++) {
                console.log(filteredPlayers[x], filteredAttacks[x])
                if (filteredPlayers[x].includes('Parfait')) {
                  player.push("Parfait지너스")
                } else if (filteredPlayers[x].includes('Astzer') || filteredPlayers[x].includes('Astaer') || filteredPlayers[x].includes('Astazer')) {
                    player.push("Astær")
                } else if (filteredPlayers[x].includes('Marshmiallow')) {
                    player.push('MarshMallow')
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


        if (x != 30 || y != 30) {
            console.log("data not read properly. retrying.")
            player = []
            count = []

        } else if (JSON.stringify(correctNames) === JSON.stringify(temp)) {
            status = true
            console.log("player: ")
            console.log(player)

        } else {
            console.log("one or more of the names are not read properly, retrying")
            console.log(player)
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
    let attacked = []
    let output = ''
    for (const name in original) {
        console.log(name)
        if (original[name] != after[name]) {
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















  module.exports = {
    getDmgHealth,
    getPlayerAttackCount,
    getAttackers,
    filterData
  }
  

