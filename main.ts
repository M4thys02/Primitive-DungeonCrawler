let now: number;
let delta: number;
joystickbit.initJoystickBit()
// Initialize joystickbit
let DEFAULT_MAZE_MAP = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 0, 0, 0, 1]]
//  Upper half
//  Upper => U
//  Lower half
//  Lower => L
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
    hitpoints_pictures: Image[]
    x: number
    y: number
    // Everything connected to player
    constructor() {
        this.hp = 3
        this.hitpoints_pictures = [images.createImage(`
                                    . # . . .
                                    # . # . .
                                    # . . . .
                                    . # . . .
                                    . . # . .
                                    `), images.createImage(`
                                    . # . . .
                                    # # # . .
                                    # # # . .
                                    . # # . .
                                    . . # . .
                                    `), images.createImage(`
                                    . # . # .
                                    # . # . #
                                    # . . . #
                                    . # . # .
                                    . . # . .
                                    `), images.createImage(`
                                    . # . # .
                                    # # # # #
                                    # # # # #
                                    . # # # .
                                    . . # . .
                                    `)]
        this.x = 0
        this.y = 0
    }
    
    public update_hp(change: any) {
        if (this.hp + change > this.hitpoints_pictures.length - 1) {
            
        } else if (this.hp + change < 0) {
            
        } else {
            this.hp += change
        }
        
        this.show_hp()
    }
    
    public show_hp() {
        this.hitpoints_pictures[this.hp].showImage(0)
    }
    
    public reset_player() {
        this.hp = 3
        this.show_hp()
        let default_x = 7
        let default_y = 9
        maze.mazeMap[this.y][this.x] = 0
        maze.mazeMap[default_y][default_x] = 2
        // player is number 2
        this.x = 7
        this.y = 9
    }
    
    public move(dx: number, dy: number) {
        let new_x = this.x + dx
        let new_y = this.y + dy
        //  serial.write_line(str(new_x)) #Only for debugging pusrposes
        //  serial.write_line(str(new_y))
        //  serial.write_line(str(maze.mazeMap[new_x][new_y]))
        if (new_y > 9) {
            
        } else if (new_x < 0 || new_x > maze.size - 1) {
            maze.new_level()
        } else if (new_y < 0) {
            maze.new_level()
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
    segments: number
    exits_coordinates: number[][]
    num_exits: number
    mazeMap: number[][]
    // Class for maze handling
    constructor() {
        this.size = 10
        this.microbitsLEDS = 5
        this.segments = 4
        this.exits_coordinates = [[2, 0], [7, 0], [2, 9], [7, 9], [0, 2], [0, 7]]
        //  Middle coor of exit in order: UL, LL, UR, LR, up left, up right
        this.num_exits = 6
        this.mazeMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    }
    
    //  Upper half
    // Lower half
    public resetMap() {
        let new_row: any[];
        this.mazeMap = []
        for (let row of DEFAULT_MAZE_MAP) {
            new_row = []
            for (let val of row) {
                new_row.push(val)
            }
            this.mazeMap.push(new_row)
        }
    }
    
    public displayMap() {
        let rowA: string;
        let rowB: string;
        let val: number;
        for (let i = 0; i < this.size; i++) {
            rowA = ""
            rowB = ""
            for (let j = 0; j < this.size; j++) {
                val = this.mazeMap[i][j]
                if (j < 5) {
                    rowA += "" + val
                } else {
                    rowB += "" + val
                }
                
            }
            if (i < this.size / 2) {
                //  Upper half
                serial.writeLine("Upper - rowA:" + rowA)
                serial.writeLine("Upper - rowB:" + rowB)
                comunicator.broadcastMessage(4, rowA + " " + ("" + i))
                //  Upper right
                comunicator.broadcastMessage(5, rowB + " " + ("" + i))
            } else {
                //  Upper left
                //  Lower half
                serial.writeLine("Lower - rowA:" + rowA)
                serial.writeLine("Lower - rowB:" + rowB)
                comunicator.broadcastMessage(6, rowA + " " + ("" + (i - 5)))
                //  Lower left
                comunicator.broadcastMessage(7, rowB + " " + ("" + (i - 5)))
            }
            
        }
    }
    
    //  Lower right
    public select_exits() {
        let i: number;
        let index: number;
        let candidates = this.exits_coordinates.slice(0)
        let selected = []
        let used_indexes = []
        for (i = 0; i < this.num_exits; i++) {
            index = randint(0, this.num_exits - 1)
            selected.push(candidates[index])
            if (used_indexes.indexOf(index) < 0) {
                used_indexes.push(index)
                selected.push(this.exits_coordinates[index])
            }
            
        }
        for (i = 0; i < selected.length; i++) {
            this.mazeMap[selected[i][0]][selected[i][1]] = 0
        }
    }
    
    public new_level() {
        this.resetMap()
        player.reset_player()
        this.select_exits()
        this.displayMap()
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
    maze.new_level()
    player.show_hp()
    let last_time = control.millis()
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
    
    if (input.buttonIsPressed(Button.A)) {
        setup()
    }
    
}
