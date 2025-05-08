joystickbit.init_joystick_bit() #Initialize joystickbit

class Buttons:
    def __init__(self):
        self.repeatInterval = 500
        self.lastSignal = 0
        self.pressed_last = False

    
    def isPressed(self, time, b):
        pressed = joystickbit.get_button(b)
        if pressed:
            self.lastSignal += time
            if self.lastSignal >= self.repeatInterval:
                self.lastSignal = 0
                return True
        else:
            self.lastSignal = 0
        return False

    def rockerChange(self, time):
        return False

class Player: #Everything connected to player
    def __init__(self):
        self.hp = 3
        self.stamina = 4
        self.inventory = []
        self.x = 0
        self.y = 0
    
    def update_hp(self, change):
        self.hp += change

    def update_stamina(self, change):
        self.stamina += change

    def move(self, dx, dy):
        new_x = self.x + dx
        new_y = self.y + dy
        if (maze.mazeMap[new_y][new_x] != -1):
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
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,1],
                        
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
                if self.mazeMap[j][i] == 1:
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


player = Player()
comunicator = Comunicator()
MONSTERS = [Monster("Zombie", 3, 1), Monster("Skeleton", 3, 2)]
maze = Maze()
button = Buttons()
last_time = 0

player.move(1, 0) #Minimálně někde musí být tato funkce, protože jinak to dělá neskutečný bordel

def setup():
    maze.resetMap()
    last_time = control.millis()
    return

setup()
while True:
    now = control.millis()
    delta = now - last_time
    last_time = now

    if (button.isPressed(delta, joystickbit.JoystickBitPin.P12)):
        maze.displayMap()
