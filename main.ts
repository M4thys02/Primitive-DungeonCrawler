let now: number;
let delta: number;
joystickbit.initJoystickBit()
// Initialize joystickbit
class Buttons {
    repeatInterval: number
    lastSignal: number
    pressed_last: boolean
    constructor() {
        this.repeatInterval = 500
        this.lastSignal = 0
        this.pressed_last = false
    }
    
    public isPressed(time: number, b: number): boolean {
        let pressed = joystickbit.getButton(b)
        if (pressed) {
            this.lastSignal += time
            if (this.lastSignal >= this.repeatInterval) {
                this.lastSignal = 0
                return true
            }
            
        } else {
            this.lastSignal = 0
        }
        
        return false
    }
    
    public rockerChange(time: any): boolean {
        return false
    }
    
}

class Player {
    hp: number
    stamina: number
    inventory: any[]
    x: number
    y: number
    // Everything connected to player
    constructor() {
        this.hp = 3
        this.stamina = 4
        this.inventory = []
        this.x = 0
        this.y = 0
    }
    
    public update_hp(change: any) {
        this.hp += change
    }
    
    public update_stamina(change: any) {
        this.stamina += change
    }
    
    public move(dx: number, dy: number) {
        let new_x = this.x + dx
        let new_y = this.y + dy
        if (maze.mazeMap[new_y][new_x] != -1) {
            this.x = new_x
            this.y = new_y
        }
        
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
    public resetMap() {
        for (let i = 0; i < this.microbitsLEDS; i++) {
            for (let j = 0; j < this.microbitsLEDS; j++) {
                if (this.mazeMap[j][i] == 1) {
                    this.mazeMap[j][i] = 0
                }
                
            }
        }
    }
    
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
let button = new Buttons()
let last_time = 0
player.move(1, 0)
// Minimálně někde musí být tato funkce, protože jinak to dělá neskutečný bordel
function setup() {
    maze.resetMap()
    let last_time = control.millis()
    return
}

setup()
while (true) {
    now = control.millis()
    delta = now - last_time
    last_time = now
    if (button.isPressed(delta, joystickbit.JoystickBitPin.P12)) {
        maze.displayMap()
    }
    
}
