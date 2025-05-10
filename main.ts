let now: number;
let delta: number;
joystickbit.initJoystickBit()
// Initialize joystickbit
//  class Buttons:
//      def __init__(self):
//          self.repeatInterval = 500
//          self.lastSignal = 0
//          self.pressed_last = False
//      def isPressed(self, time, b): #When specified button is pressed over specified period of time with autorepeat
//          pressed = joystickbit.get_button(b)
//          if pressed:
//              self.lastSignal += time
//              if self.lastSignal >= self.repeatInterval:
//                  self.lastSignal = 0
//                  return True
//          else:
//              self.lastSignal = 0
//          return False
class Timer {
    repeatInterval: number
    lastSignal: number
    constructor() {
        this.repeatInterval = 500
        this.lastSignal = 0
    }
    
    public timeElapsed(current_delta: number): boolean {
        this.lastSignal += current_delta
        if (this.lastSignal >= this.repeatInterval) {
            this.lastSignal = 0
            return true
        }
        
        return false
    }
    
}

class Player {
    hp: number
    stamina: number
    inventory: Image[]
    x: number
    y: number
    // Everything connected to player
    constructor() {
        this.hp = 3
        this.stamina = 4
        this.inventory = [images.createImage(`
            . . . # #
            . . # # .
            . . # . .
            # # # . .
            . # . . .
            `)]
        this.x = 0
        this.y = 0
    }
    
    public update_hp(change: number) {
        this.hp += change
        comunicator.broadcastNumber(2, change)
    }
    
    public update_stamina(change: number) {
        this.stamina += change
        comunicator.broadcastNumber(3, change)
    }
    
    public show_inv_image() {
        this.inventory[0].showImage(0)
    }
    
    public move(dx: number, dy: number) {
        let new_x = this.x + dx
        let new_y = this.y + dy
        //  serial.write_line(str(new_x)) #Only for debugging pusrposes
        //  serial.write_line(str(new_y))
        if (new_x < 0 || new_x > maze.size) {
            
        } else if (new_y < 0 || new_y > maze.size) {
            
        } else if (maze.mazeMap[new_y][new_x] == 0) {
            maze.mazeMap[this.y][this.x] = 0
            maze.mazeMap[new_y][new_x] = 2
            // player is number 2
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
        this.mazeMap = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 3, 1, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    }
    
    // Upper left
    // Upper right
    // Lower left
    // Lower right
    public resetMap() {
        for (let i = 0; i < this.microbitsLEDS; i++) {
            for (let j = 0; j < this.microbitsLEDS; j++) {
                if (this.mazeMap[j][i] != 0) {
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
    
    public broadcastNumber(new_group: number, num: number) {
        radio.setGroup(new_group)
        radio.sendNumber(num)
    }
    
}

let player = new Player()
let comunicator = new Comunicator()
let MONSTERS = [new Monster("Zombie", 3, 1), new Monster("Skeleton", 3, 2)]
let maze = new Maze()
// button = Buttons()
let last_time = 0
let x_timer = new Timer()
let y_timer = new Timer()
let game_loop = true
function setup() {
    // maze.resetMap()
    player.move(0, 0)
    maze.displayMap()
    let last_time = control.millis()
    player.show_inv_image()
    return
}

setup()
while (game_loop) {
    now = control.millis()
    delta = now - last_time
    last_time = now
    if (joystickbit.getRockerValue(joystickbit.rockerType.X) < 450 && x_timer.timeElapsed(delta)) {
        player.move(1, 0)
        maze.displayMap()
    } else if (joystickbit.getRockerValue(joystickbit.rockerType.X) > 570 && x_timer.timeElapsed(delta)) {
        player.move(-1, 0)
        maze.displayMap()
    }
    
    if (joystickbit.getRockerValue(joystickbit.rockerType.Y) < 450 && y_timer.timeElapsed(delta)) {
        player.move(0, 1)
        maze.displayMap()
    } else if (joystickbit.getRockerValue(joystickbit.rockerType.Y) > 570 && y_timer.timeElapsed(delta)) {
        player.move(0, -1)
        maze.displayMap()
    }
    
}
