joystickbit.init_joystick_bit() #Initialize joystickbit

MAZE = [[0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0],
        [0,0,0,0,0, 0,0,0,0,0]]

VISITED = [[0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,0,0,0]]

neighbors2 = [[0,0]]

number_of_exits = 0

class MazeGenerator:
    def __init__(self):
        self.microbitsLEDS = 5
        self.segments = 4
        self.exits_coordinates = [[2,0],[7,0],[2,9],[7,9],[0,2],[0,7]] # Middle coor of exit in order: UL, LL, UR, LR, up left, up right
        self.num_exits = 6
        self.size = 10
        self.maze = MAZE
        self.visited = VISITED
        self.start_x = 6
        self.start_y = 8

    def in_bounds(self, x, y):
        return 1 <= x < self.size - 1 and 1 <= y < self.size - 1

    def neighbors(self, x, y):
        result = []
        directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        for i in range(len(directions)):
            dx = directions[i][0]
            dy = directions[i][1]
            nx = x + dx
            ny = y + dy
            if self.in_bounds(nx, ny):
                result.append([nx, ny])
        return result

    def dfs(self, x, y):
        carved_cells = 0
        stack = [[x, y]]

        while len(stack) > 0:
            cx = stack[len(stack) - 1][0]
            cy = stack[len(stack) - 1][1]
            stack.pop()

            if VISITED[cy][cx] == 1:
                continue

            # Count visited neighbors BEFORE marking current cell
            count = 0
            neighbors2 = self.neighbors(cx, cy)
            for i in range(len(neighbors2)):
                nx2 = neighbors2[i][0]
                ny2 = neighbors2[i][1]
                if VISITED[ny2][nx2] == 1:
                    count += 1

            if carved_cells > 10 and count > 1:
                continue  # Skip this cell to avoid multiple connections

            MAZE[cy][cx] = 0
            VISITED[cy][cx] = 1
            carved_cells += 1

            neighbors = self.neighbors(cx, cy)

            # Shuffle neighbors
            i = len(neighbors) - 1
            while i > 0:
                j = randint(0, i)
                neighbors[i] = neighbors[j]
                neighbors[j] = neighbors[i]
                i -= 1

            for i in range(len(neighbors)):
                nx = neighbors[i][0]
                ny = neighbors[i][1]
                if VISITED[ny][nx] == 0:
                    stack.append([nx, ny])
    
    def generate_connected_maze(self):
        # Fill maze with wall
        
        for y in range(self.size):
            for x in range(self.size):
                MAZE[y][x] = 1

        for y in range(self.size):
            for x in range(self.size):
                VISITED[y][x] = 0

        self.dfs(self.start_x, self.start_y)
        MAZE[self.start_y + 1][self.start_x] = 0

    def select_exits(self):
        candidates = self.exits_coordinates[:]
        selected = []
        used_indexes = []

        for i in range(self.num_exits):
            index = randint(0, self.num_exits - 1)
            coord = candidates[index]
            y = coord[0]
            x = coord[1]

            valid = False
            if y > 0 and MAZE[y - 1][x] == 0:
                valid = True
            if y < self.size - 1 and MAZE[y + 1][x] == 0:
                valid = True
            if x > 0 and MAZE[y][x - 1] == 0:
                valid = True
            if x < self.size - 1 and MAZE[y][x + 1] == 0:
                valid = True

            if valid and index not in used_indexes:
                used_indexes.append(index)
                selected.append([y, x])

            if valid and index not in used_indexes:
                used_indexes.append(index)
                selected.append(coord)

        for i in range(len(selected)):
            y = selected[i][0]
            x = selected[i][1]
            MAZE[y][x] = 0
        
        number_of_exits = len(selected)
    
    def displayMap(self):
        for i in range(self.size):
            rowA = ""
            rowB = ""
            for j in range(self.size):
                val = self.maze[i][j]
                if j < 5:
                    rowA += str(val)
                else:
                    rowB += str(val)
            
            if i < self.size / 2:
                # Upper half
                # serial.write_line("Upper - rowA:" + rowA)
                # serial.write_line("Upper - rowB:" + rowB)
                comunicator.broadcastMessage(4, rowA + " " + str(i))  # Upper right
                comunicator.broadcastMessage(5, rowB + " " + str(i))  # Upper left
            else:
                # Lower half
                # serial.write_line("Lower - rowA:" + rowA)
                # serial.write_line("Lower - rowB:" + rowB)
                comunicator.broadcastMessage(6, rowA + " " + str(i - 5))  # Lower left
                comunicator.broadcastMessage(7, rowB + " " + str(i - 5))  # Lower right
    
    def new_level(self):
        self.generate_connected_maze()
        self.select_exits()

        player.reset_player()
        # for i in range(self.size):
        #     row = ""
        #     for j in range(self.size):
        #         val = self.maze[i][j]
        #         row += str(val)
        #     print(row)
        # print("---------------------------------------------")
        self.displayMap()


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
        self.hitpoints_pictures = [images.create_image("""
                                    . # . . .
                                    # . # . .
                                    # . . . .
                                    . # . . .
                                    . . # . .
                                    """),
                                images.create_image("""
                                    . # . . .
                                    # # # . .
                                    # # # . .
                                    . # # . .
                                    . . # . .
                                    """),
                                images.create_image("""
                                    . # . # .
                                    # . # . #
                                    # . . . #
                                    . # . # .
                                    . . # . .
                                    """),
                                images.create_image("""
                                    . # . # .
                                    # # # # #
                                    # # # # #
                                    . # # # .
                                    . . # . .
                                    """)]
        self.x = 0
        self.y = 0
        self.default_x = 6
        self.default_y = 9
    
    def update_hp(self, change):
        if (self.hp + change > (len(self.hitpoints_pictures) - 1)):
            pass
        elif (self.hp + change < 0):
            pass
        else:
            self.hp += change

        self.show_hp()
    
    def show_hp(self):
        self.hitpoints_pictures[self.hp].show_image(0)

    def reset_player(self):
        self.hp = 3
        self.show_hp()
        mazeGen.maze[self.y][self.x] = 0
        mazeGen.maze[self.default_y][self.default_x] = 2 #player is number 2
        self.x = self.default_x
        self.y = self.default_y

    def move(self, dx, dy):
        new_x = self.x + dx
        new_y = self.y + dy
        # serial.write_line(str(new_x)) #Only for debugging pusrposes
        # serial.write_line(str(new_y))
        # serial.write_line(str(maze.mazeMap[new_x][new_y]))
        if (number_of_exits == 0 and new_y > 9):
            mazeGen.new_level()
        elif (new_x < 0 or new_x > (mazeGen.size - 1)):
            mazeGen.new_level()
        elif (new_y < 0):
            mazeGen.new_level()
        elif (mazeGen.maze[new_y][new_x] == 0):
            mazeGen.maze[self.y][self.x] = 0
            mazeGen.maze[new_y][new_x] = 2 #player is number 2
            self.x = new_x
            self.y = new_y

class Monster: #Class for every monster
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.attack = attack

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
mazeGen = MazeGenerator()
#button = Buttons()

last_time = 0
x_timer = Timer()
y_timer = Timer()
game_loop = True

def setup():
    mazeGen.new_level()
    player.show_hp()
    last_time = control.millis()
    return

setup()
while game_loop:
    now = control.millis()
    delta = now - last_time
    last_time = now

    if (joystickbit.get_rocker_value(joystickbit.rockerType.X) < 450 and x_timer.timeElapsed(delta)):
        player.move(1, 0)
        mazeGen.displayMap()
    elif (joystickbit.get_rocker_value(joystickbit.rockerType.X) > 570 and x_timer.timeElapsed(delta)):
        player.move(-1, 0)
        mazeGen.displayMap()

    if (joystickbit.get_rocker_value(joystickbit.rockerType.Y) < 450 and y_timer.timeElapsed(delta)):
        player.move(0, 1)
        mazeGen.displayMap()
    elif (joystickbit.get_rocker_value(joystickbit.rockerType.Y) > 570 and y_timer.timeElapsed(delta)):
        player.move(0, -1)
        mazeGen.displayMap()
    
    if (input.button_is_pressed(Button.A)):
        setup()
