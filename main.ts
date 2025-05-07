joystickbit.initJoystickBit()
// Initialize joystickbit
class Player {
    hp: number
    stamina: number
    inventory: any[]
    x: number
    y: number
    validMovement: any[][]
    // Everything connected to player
    constructor() {
        this.hp = 3
        this.stamina = 4
        this.inventory = []
        this.x = 0
        this.y = 0
        this.validMovement = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    }
    
    public move_left() {
        basic.showNumber(8)
    }
    
}

class Monster {
    name: string
    hp: number
    attack: number
    // Class for every monster
    constructor(name: string, hp: number, attack: number) {
        this.name = name
        this.hp = hp
        this.attack = attack
    }
    
}

class Maze {
    size: number
    microbitsLEDS: number
    mazeMap: number[][]
    // Class for maze handling
    constructor() {
        this.size = 10
        this.microbitsLEDS = 5
        this.mazeMap = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    }
    
    // Upper left
    // Upper right
    // Lower left
    // Lower right
    public displayMap() {
        let row: string;
        for (let i = 0; i < this.microbitsLEDS; i++) {
            row = ""
            for (let j = 0; j < this.microbitsLEDS; j++) {
                row += "" + this.mazeMap[j][i]
            }
            // basic.show_string(row) #Only for debbuging purposes
            if (i <= 4) {
                comunicator.broadcastMessage(4, row + " " + ("" + i))
            } else if (i > 4 && i < 10) {
                comunicator.broadcastMessage(5, row + " " + ("" + i))
            } else if (i > 9 && i < 15) {
                comunicator.broadcastMessage(6, row + " " + ("" + i))
            } else {
                comunicator.broadcastMessage(7, row + " " + ("" + i))
            }
            
        }
    }
    
}

class Comunicator {
    defaultRadioGroup: number
    // Handle comunication between Microbits
    constructor() {
        this.defaultRadioGroup = 1
    }
    
    public broadcastMessage(new_group: number, message: string) {
        radio.setGroup(new_group)
        radio.sendString(message)
    }
    
}

let player = new Player()
let comunicator = new Comunicator()
let MONSTERS = [new Monster("Zombie", 3, 1), new Monster("Skeleton", 3, 2)]
let maze = new Maze()
function setup() {
    return
}

while (true) {
    maze.displayMap()
}
