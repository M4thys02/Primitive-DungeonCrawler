let now: number;
let delta: number;
joystickbit.initJoystickBit()
// Initialize joystickbit
let MAZE = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
let VISITED = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
let dirs = [[0, 0]]
let neighbors2 = [[0, 0]]
class MazeGenerator {
    microbitsLEDS: number
    segments: number
    exits_coordinates: number[][]
    num_exits: number
    size: number
    maze: number[][]
    visited: number[][]
    start_x: number
    start_y: number
    constructor() {
        this.microbitsLEDS = 5
        this.segments = 4
        this.exits_coordinates = [[2, 0], [7, 0], [2, 9], [7, 9], [0, 2], [0, 7]]
        //  Middle coor of exit in order: UL, LL, UR, LR, up left, up right
        this.num_exits = 6
        this.size = 10
        this.maze = MAZE
        this.visited = VISITED
        this.start_x = 6
        this.start_y = 8
    }
    
    public in_bounds(x: any, y: any) {
        return 1 <= x && x < this.size - 1 && (1 <= y && y < this.size - 1)
    }
    
    public neighbors(x: number, y: number): any[] {
        let dx: any;
        let dy: any;
        let nx: any;
        let ny: any;
        let result = []
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        for (let i = 0; i < directions.length; i++) {
            dx = directions[i][0]
            dy = directions[i][1]
            nx = x + dx
            ny = y + dy
            if (this.in_bounds(nx, ny)) {
                result.push([nx, ny])
            }
            
        }
        return result
    }
    
    public dfs(x: number, y: number) {
        let j: number;
        let tmp: number[];
        let nx: number;
        let ny: number;
        let count: number;
        let nx2: number;
        let ny2: number;
        MAZE[y][x] = 0
        VISITED[y][x] = 1
        _py.py_array_clear(dirs)
        for (let n of this.neighbors(x, y)) {
            dirs.push(n)
        }
        let i = dirs.length - 1
        // Shuffle algorithm
        while (i > 0) {
            j = randint(0, i)
            tmp = dirs[i]
            dirs[i] = dirs[j]
            dirs[j] = tmp
            i -= 1
        }
        for (let d of dirs.slice(0)) {
            nx = d[0]
            ny = d[1]
            if (!VISITED[ny][nx]) {
                //  Carve path only if it leads to unvisited area
                count = 0
                _py.py_array_clear(neighbors2)
                for (let m of this.neighbors(nx, ny)) {
                    neighbors2.push(m)
                }
                for (j = 0; j < neighbors2.length; j++) {
                    nx2 = neighbors2[j][0]
                    ny2 = neighbors2[j][1]
                    if (VISITED[ny2][nx2]) {
                        count += 1
                    }
                    
                }
                if (count <= 1) {
                    this.dfs(nx, ny)
                }
                
            }
            
        }
    }
    
    public generate_connected_maze() {
        let y: number;
        let x: number;
        //  Fill maze with wall
        for (y = 0; y < this.size; y++) {
            for (x = 0; x < this.size; x++) {
                MAZE[y][x] = 1
            }
        }
        for (y = 0; y < this.size; y++) {
            for (x = 0; x < this.size; x++) {
                VISITED[y][x] = 0
            }
        }
        this.dfs(this.start_x, this.start_y)
        MAZE[this.start_y + 1][this.start_x] = 0
    }
    
    //  def select_exits(self):
    //      candidates = self.exits_coordinates[:]
    //      selected = []
    //      used_indexes = []
    //      for i in range(self.num_exits):
    //          index = randint(0, self.num_exits - 1)
    //          coord = candidates[index]
    //          y = coord[0]
    //          x = coord[1]
    //          # Zkontroluj, zda alespoň jeden soused není zeď
    //          valid = False
    //          if y > 0 and MAZE[y - 1][x] == 0:
    //              valid = True
    //          if y < self.size - 1 and MAZE[y + 1][x] == 0:
    //              valid = True
    //          if x > 0 and MAZE[y][x - 1] == 0:
    //              valid = True
    //          if x < self.size - 1 and MAZE[y][x + 1] == 0:
    //              valid = True
    //          if valid and index not in used_indexes:
    //              used_indexes.append(index)
    //              selected.append([y, x])
    //          if valid and index not in used_indexes:
    //              used_indexes.append(index)
    //              selected.append(coord)
    //      for i in range(len(selected)):
    //          y = selected[i][0]
    //          x = selected[i][1]
    //          MAZE[y][x] = 0
    public displayMap() {
        let rowA: string;
        let rowB: string;
        let val: number;
        for (let i = 0; i < this.size; i++) {
            rowA = ""
            rowB = ""
            for (let j = 0; j < this.size; j++) {
                val = this.maze[i][j]
                if (j < 5) {
                    rowA += "" + val
                } else {
                    rowB += "" + val
                }
                
            }
            if (i < this.size / 2) {
                //  Upper half
                //  serial.write_line("Upper - rowA:" + rowA)
                //  serial.write_line("Upper - rowB:" + rowB)
                comunicator.broadcastMessage(4, rowA + " " + ("" + i))
                //  Upper right
                comunicator.broadcastMessage(5, rowB + " " + ("" + i))
            } else {
                //  Upper left
                //  Lower half
                //  serial.write_line("Lower - rowA:" + rowA)
                //  serial.write_line("Lower - rowB:" + rowB)
                comunicator.broadcastMessage(6, rowA + " " + ("" + (i - 5)))
                //  Lower left
                comunicator.broadcastMessage(7, rowB + " " + ("" + (i - 5)))
            }
            
        }
    }
    
    //  Lower right
    public new_level() {
        this.generate_connected_maze()
        player.reset_player()
        //  self.select_exits()
        console.log(MAZE[0][0])
        this.displayMap()
    }
    
}

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
    default_x: number
    default_y: number
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
        this.default_x = 7
        this.default_y = 9
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
        mazeGen.maze[this.y][this.x] = 0
        mazeGen.maze[this.default_y][this.default_x] = 2
        // player is number 2
        this.x = this.default_x
        this.y = this.default_y
    }
    
    public move(dx: number, dy: number) {
        let new_x = this.x + dx
        let new_y = this.y + dy
        //  serial.write_line(str(new_x)) #Only for debugging pusrposes
        //  serial.write_line(str(new_y))
        //  serial.write_line(str(maze.mazeMap[new_x][new_y]))
        if (new_y > 9) {
            
        } else if (new_x < 0 || new_x > mazeGen.size - 1) {
            mazeGen.new_level()
        } else if (new_y < 0) {
            mazeGen.new_level()
        } else if (mazeGen.maze[new_y][new_x] == 0) {
            mazeGen.maze[this.y][this.x] = 0
            mazeGen.maze[new_y][new_x] = 2
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
let mazeGen = new MazeGenerator()
// button = Buttons()
let last_time = 0
let x_timer = new Timer()
let y_timer = new Timer()
let game_loop = true
function setup() {
    mazeGen.new_level()
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
        mazeGen.displayMap()
    } else if (joystickbit.getRockerValue(joystickbit.rockerType.X) > 570 && x_timer.timeElapsed(delta)) {
        player.move(-1, 0)
        mazeGen.displayMap()
    }
    
    if (joystickbit.getRockerValue(joystickbit.rockerType.Y) < 450 && y_timer.timeElapsed(delta)) {
        player.move(0, 1)
        mazeGen.displayMap()
    } else if (joystickbit.getRockerValue(joystickbit.rockerType.Y) > 570 && y_timer.timeElapsed(delta)) {
        player.move(0, -1)
        mazeGen.displayMap()
    }
    
    if (input.buttonIsPressed(Button.A)) {
        setup()
    }
    
}
