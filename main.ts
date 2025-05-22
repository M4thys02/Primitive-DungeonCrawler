let now: number;
let delta: number;
joystickbit.initJoystickBit()
// Initialize joystickbit
let MAZE = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
let VISITED = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
let neighbors2 = [[0, 0]]
let number_of_exits = 0
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
    
    public neighbors(x: number, y: number): number[][] {
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
        let cx: number;
        let cy: number;
        let count: number;
        let neighbors2: number[][];
        let i: number;
        let nx2: number;
        let ny2: number;
        let neighbors: number[][];
        let j: number;
        let nx: number;
        let ny: number;
        let carved_cells = 0
        let stack = [[x, y]]
        while (stack.length > 0) {
            cx = stack[stack.length - 1][0]
            cy = stack[stack.length - 1][1]
            _py.py_array_pop(stack)
            if (VISITED[cy][cx] == 1) {
                continue
            }
            
            //  Count visited neighbors BEFORE marking current cell
            count = 0
            neighbors2 = this.neighbors(cx, cy)
            for (i = 0; i < neighbors2.length; i++) {
                nx2 = neighbors2[i][0]
                ny2 = neighbors2[i][1]
                if (VISITED[ny2][nx2] == 1) {
                    count += 1
                }
                
            }
            if (carved_cells > 10 && count > 1) {
                continue
            }
            
            //  Skip this cell to avoid multiple connections
            MAZE[cy][cx] = 0
            VISITED[cy][cx] = 1
            carved_cells += 1
            neighbors = this.neighbors(cx, cy)
            //  Shuffle neighbors
            i = neighbors.length - 1
            while (i > 0) {
                j = randint(0, i)
                neighbors[i] = neighbors[j]
                neighbors[j] = neighbors[i]
                i -= 1
            }
            for (i = 0; i < neighbors.length; i++) {
                nx = neighbors[i][0]
                ny = neighbors[i][1]
                if (VISITED[ny][nx] == 0) {
                    stack.push([nx, ny])
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
    
    public select_exits() {
        let i: number;
        let index: number;
        let coord: number[];
        let y: number;
        let x: number;
        let valid: boolean;
        let candidates = this.exits_coordinates.slice(0)
        let selected = []
        let used_indexes = []
        for (i = 0; i < this.num_exits; i++) {
            index = randint(0, this.num_exits - 1)
            coord = candidates[index]
            y = coord[0]
            x = coord[1]
            valid = false
            if (y > 0 && MAZE[y - 1][x] == 0) {
                valid = true
            }
            
            if (y < this.size - 1 && MAZE[y + 1][x] == 0) {
                valid = true
            }
            
            if (x > 0 && MAZE[y][x - 1] == 0) {
                valid = true
            }
            
            if (x < this.size - 1 && MAZE[y][x + 1] == 0) {
                valid = true
            }
            
            if (valid && used_indexes.indexOf(index) < 0) {
                used_indexes.push(index)
                selected.push([y, x])
            }
            
            if (valid && used_indexes.indexOf(index) < 0) {
                used_indexes.push(index)
                selected.push(coord)
            }
            
        }
        for (i = 0; i < selected.length; i++) {
            y = selected[i][0]
            x = selected[i][1]
            MAZE[y][x] = 0
        }
        let number_of_exits = selected.length
    }
    
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
        this.select_exits()
        player.reset_player()
        monster.spawn()
        //  for i in range(self.size):
        //      row = ""
        //      for j in range(self.size):
        //          val = self.maze[i][j]
        //          row += str(val)
        //      print(row)
        //  print("---------------------------------------------")
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
    monsterInterval: number
    lastSignal: number
    lastChange: number
    constructor() {
        this.repeatInterval = 500
        this.monsterInterval = 1000
        this.lastSignal = 0
        this.lastChange = 0
    }
    
    public timeElapsed(current_delta: number): boolean {
        this.lastSignal += current_delta
        if (this.lastSignal >= this.repeatInterval) {
            this.lastSignal = 0
            return true
        }
        
        return false
    }
    
    public timeElapsedMonster(current_delta: number): boolean {
        this.lastChange += current_delta
        if (this.lastChange >= this.monsterInterval) {
            this.lastChange = 0
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
        this.default_x = 6
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
        if (number_of_exits == 0 && new_y > 9) {
            mazeGen.new_level()
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
    x: number
    y: number
    directions: number[][]
    dir: number
    // Class for every monster
    constructor() {
        this.x = -1
        this.y = -1
        this.directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]
        this.dir = 0
    }
    
    public move() {
        let nx: number;
        let ny: number;
        let left_dir = (this.dir + 3) % 4
        let forward_dir = this.dir
        let right_dir = (this.dir + 1) % 4
        let back_dir = (this.dir + 2) % 4
        for (let direction of [left_dir, forward_dir, right_dir, back_dir]) {
            let [dx, dy] = this.directions[direction]
            nx = this.x + dx
            ny = this.y + dy
            if (MAZE[ny][nx] == 0) {
                this.x = nx
                this.y = ny
                this.dir = direction
                break
            }
            
        }
    }
    
    public spawn() {
        while (true) {
            this.x = randint(1, MAZE[0].length - 2)
            this.y = randint(1, MAZE.length - 2)
            if (MAZE[this.y][this.x] == 0) {
                MAZE[this.y][this.x] = 3
                break
            }
            
        }
    }
    
    public attackPlayer(x_pos: number, y_pos: number) {
        if (this.x == x_pos && this.y == y_pos) {
            player.update_hp(-1)
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
let mazeGen = new MazeGenerator()
// button = Buttons()
let last_time = 0
let x_timer = new Timer()
let y_timer = new Timer()
let monsterTimer = new Timer()
let game_loop = true
let monster = new Monster()
function setup() {
    mazeGen.new_level()
    player.show_hp()
    let last_time = control.millis()
    monster.spawn()
    return
}

setup()
while (game_loop) {
    now = control.millis()
    delta = now - last_time
    last_time = now
    if (monsterTimer.timeElapsedMonster(delta)) {
        MAZE[monster.y][monster.x] = 0
        monster.move()
        monster.attackPlayer(player.x, player.y)
        MAZE[monster.y][monster.x] = 3
    }
    
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
