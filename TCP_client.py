from socket import *
serverName = "localhost"
serverPort = 81
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName,serverPort))
stop = False
while not stop:
    #Send to server
    message = input("Input lowercase sentence:")
    clientSocket.send(message.encode())
    #Receive from server
    if(message.upper() == "BYE"):
        stop = True
    else:
        modifiedMessage = clientSocket.recv(2048)
        print('From server: ' + modifiedMessage.decode())
clientSocket.close()