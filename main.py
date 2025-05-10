joystickbit.init_joystick_bit() #Initialize joystickbit

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
        

    def move(self, dx, dy):
        new_x = self.x + dx
        new_y = self.y + dy
        # serial.write_line(str(new_x)) #Only for debugging pusrposes
        # serial.write_line(str(new_y))
        if (new_x < 0 or new_x > maze.size):
            pass
        elif (new_y < 0 or new_y > maze.size):
            pass
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
        self.mazeMap = [[0,0,0,0,0], #Upper left
                        [0,0,0,0,0],
                        [0,0,1,0,0],
                        [0,1,3,1,0],
                        [0,0,1,0,0],
                        
                        [0,0,0,0,0], #Upper right
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        
                        [0,0,0,0,0], #Lower left
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        
                        [0,0,0,0,0], #Lower right
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0]]
    
    def resetMap(self):
        for i in range(self.microbitsLEDS):
            for j in range(self.microbitsLEDS):
                if self.mazeMap[j][i] != 0:
                    self.mazeMap[j][i] = 0
    
    def displayMap(self):
        for i in range(self.microbitsLEDS):
            row = ""
            for j in range(self.microbitsLEDS):
                row += str(self.mazeMap[j][i])
            #basic.show_string(row) #Only for debbuging purposes

            if i <= 4:
                comunicator.broadcastMessage(4, row + " " + str(i))
            elif i > 4 and i < 10:
                comunicator.broadcastMessage(5, row + " " + str(i))
            elif i > 9 and i < 15:
                comunicator.broadcastMessage(6, row + " " + str(i))
            else:
                comunicator.broadcastMessage(7, row + " " + str(i))

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
    #maze.resetMap()
    player.move(0,0)
    maze.displayMap()
    last_time = control.millis()

    player.show_inv_image()
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
