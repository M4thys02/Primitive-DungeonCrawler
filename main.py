joystickbit.init_joystick_bit() #Initialize joystickbit

DEFAULT_MAZE_MAP = [[1,1,1,1,1, 1,1,1,1,1], # Upper half
                    [1,0,0,0,0, 0,0,0,0,1], # Upper => U
                    [1,0,0,0,0, 0,0,0,0,1],
                    [1,0,0,0,0, 0,0,0,0,1],
                    [1,0,0,0,0, 0,0,0,0,1],
                    
                    [1,0,0,0,0, 0,0,0,0,1], # Lower half
                    [1,0,0,0,0, 0,0,0,0,1], # Lower => L
                    [1,0,0,0,0, 0,0,0,0,1],
                    [1,0,0,0,0, 0,0,0,0,1],
                    [1,1,1,1,1, 1,0,0,0,1]]

# class Buttons:
#     def __init__(self):
#         self.repeatInterval = 500
#         self.lastSignal = 0
#         self.pressed_last = False

    
#     def isPressed(self, time, b): #When specified button is pressed over specified period of time with autorepeat
#         pressed = joystickbit.get_button(b)
#         if pressed:
#             self.lastSignal += time
#             if self.lastSignal >= self.repeatInterval:
#                 self.lastSignal = 0
#                 return True
#         else:
#             self.lastSignal = 0
#         return False

class Timer:
    def __init__(self):
        self.repeatInterval = 500
        self.lastSignal = 0

    def timeElapsed(self, current_delta):
        self.lastSignal += current_delta
        if self.lastSignal >= self.repeatInterval:
            self.lastSignal = 0
            return True
        return False

class Player: #Everything connected to player
    def __init__(self):
        self.hp = 3
        self.stamina = 4
        self.inventory = [images.create_image("""
            . . . # #
            . . # # .
            . . # . .
            # # # . .
            . # . . .
            """)]
        self.x = 0
        self.y = 0
    
    def update_hp(self, change):
        self.hp += change
        comunicator.broadcastNumber(2, change)

    def update_stamina(self, change):
        self.stamina += change
        comunicator.broadcastNumber(3, change)
    
    def show_inv_image(self):
        self.inventory[0].show_image(0)

    def reset_position(self):
        default_x = 7
        default_y = 9
        maze.mazeMap[self.y][self.x] = 0
        maze.mazeMap[default_y][default_x] = 2 #player is number 2
        self.x = 7
        self.y = 9

    def move(self, dx, dy):
        new_x = self.x + dx
        new_y = self.y + dy
        # serial.write_line(str(new_x)) #Only for debugging pusrposes
        # serial.write_line(str(new_y))
        # serial.write_line(str(maze.mazeMap[new_x][new_y]))
        if (new_y > 9):
            pass
        elif (new_x < 0 or new_x > (maze.size - 1)):
            maze.new_level()
        elif (new_y < 0):
            maze.new_level()
        elif (maze.mazeMap[new_y][new_x] == 0):
            maze.mazeMap[self.y][self.x] = 0
            maze.mazeMap[new_y][new_x] = 2 #player is number 2
            self.x = new_x
            self.y = new_y

class Monster: #Class for every monster
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.attack = attack

class Maze: #Class for maze handling
    def __init__(self):
        self.size = 10
        self.microbitsLEDS = 5
        self.segments = 4
        self.exits_coordinates = [[2,0],[7,0],[2,9],[7,9],[0,2],[0,7]] # Middle coor of exit in order: UL, LL, UR, LR, up left, up right
        self.num_exits = 6
        self.mazeMap = [[0,0,0,0,0, 0,0,0,0,0], # Upper half
                        [0,0,0,0,0, 0,0,0,0,0],
                        [0,0,0,0,0, 0,0,0,0,0],
                        [0,0,0,0,0, 0,0,0,0,0],
                        [0,0,0,0,0, 0,0,0,0,0],
                        
                        [0,0,0,0,0, 0,0,0,0,0], #Lower half
                        [0,0,0,0,0, 0,0,0,0,0],
                        [0,0,0,0,0, 0,0,0,0,0],
                        [0,0,0,0,0, 0,0,0,0,0],
                        [0,0,0,0,0, 0,0,0,0,0]]
    
    def resetMap(self):
        self.mazeMap = []
        for row in DEFAULT_MAZE_MAP:
            new_row = []
            for val in row:
                new_row.append(val)
            self.mazeMap.append(new_row)
    
    def displayMap(self):
        for i in range(self.size):
            rowA = ""
            rowB = ""
            for j in range(self.size):
                val = self.mazeMap[i][j]
                if j < 5:
                    rowA += str(val)
                else:
                    rowB += str(val)
            
            if i < self.size / 2:
                # Upper half
                serial.write_line("Upper - rowA:" + rowA)
                serial.write_line("Upper - rowB:" + rowB)
                comunicator.broadcastMessage(4, rowA + " " + str(i))  # Upper right
                comunicator.broadcastMessage(5, rowB + " " + str(i))  # Upper left
            else:
                # Lower half
                serial.write_line("Lower - rowA:" + rowA)
                serial.write_line("Lower - rowB:" + rowB)
                comunicator.broadcastMessage(6, rowA + " " + str(i - 5))  # Lower left
                comunicator.broadcastMessage(7, rowB + " " + str(i - 5))  # Lower right

    def select_exits(self):
        candidates = self.exits_coordinates[:]
        selected = []
        used_indexes = []

        for i in range(self.num_exits):
            index = randint(0, self.num_exits - 1)
            selected.append(candidates[index])
            if index not in used_indexes:
                used_indexes.append(index)
                selected.append(self.exits_coordinates[index])
        
        for i in range(len(selected)):
            self.mazeMap[selected[i][0]][selected[i][1]] = 0
    
    def new_level(self):
        self.resetMap()
        player.reset_position()
        self.select_exits()
        self.displayMap()

class Comunicator: #Handle comunication between Microbits
    def __init__(self):
        self.defaultRadioGroup = 1

    def broadcastMessage(self, new_group, message):
        radio.set_group(new_group)
        radio.send_string(message)
    
    def broadcastNumber(self, new_group, num):
        radio.set_group(new_group)
        radio.send_number(num)

player = Player()
comunicator = Comunicator()
MONSTERS = [Monster("Zombie", 3, 1), Monster("Skeleton", 3, 2)]
maze = Maze()
#button = Buttons()

last_time = 0
x_timer = Timer()
y_timer = Timer()
game_loop = True

def setup():
    maze.new_level()
    player.show_inv_image()
    last_time = control.millis()
    return

setup()
while game_loop:
    now = control.millis()
    delta = now - last_time
    last_time = now

    if (joystickbit.get_rocker_value(joystickbit.rockerType.X) < 450 and x_timer.timeElapsed(delta)):
        player.move(1, 0)
        maze.displayMap()
    elif (joystickbit.get_rocker_value(joystickbit.rockerType.X) > 570 and x_timer.timeElapsed(delta)):
        player.move(-1, 0)
        maze.displayMap()

    if (joystickbit.get_rocker_value(joystickbit.rockerType.Y) < 450 and y_timer.timeElapsed(delta)):
        player.move(0, 1)
        maze.displayMap()
    elif (joystickbit.get_rocker_value(joystickbit.rockerType.Y) > 570 and y_timer.timeElapsed(delta)):
        player.move(0, -1)
        maze.displayMap()
    
    if (input.button_is_pressed(Button.A)):
        setup()
