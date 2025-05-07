joystickbit.init_joystick_bit() #Initialize joystickbit

class Player: #Everything connected to player
    def __init__(self):
        self.hp = 3
        self.stamina = 4
        self.inventory = []
        self.x = 0
        self.y = 0
        self.validMovement = [[-1, 0], [1, 0], [0, -1], [0, 1]]

    def move_left(self):
        basic.show_number(8)

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

def setup():
    return

while True:
    maze.displayMap()
