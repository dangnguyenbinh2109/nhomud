from socket import *
serverPort = 81
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(('', serverPort))
serverSocket.listen(1)
print ("The server is ready to receive:")
stop = False
while not stop:
    connectionSocket, clientAddress = serverSocket.accept()
    print(f"Connected to client {clientAddress}")
    #while not stop:
    message = connectionSocket.recv(2048)
    print("From client: " + message.decode())
    modifiedMessage = message.decode().upper()
    if(modifiedMessage == "BYE"):
        stop = True
    else:
        connectionSocket.send(modifiedMessage.encode())