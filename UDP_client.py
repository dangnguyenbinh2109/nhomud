from socket import *
serverName = "localhost"
serverPort = 50000
clientSocket = socket(AF_INET, SOCK_DGRAM)
stop = False
while not stop:
    #Send to server
    message = input("Input lowercase sentence:")
    clientSocket.sendto(message.encode(),(serverName, serverPort))
    #Receive from server
    if(message.upper() == "BYE"):
        stop = True
    else:
        modifiedMessage, serverAddress = clientSocket.recvfrom(2048)
        print(f"Receive {modifiedMessage.decode()} from {serverAddress}")
clientSocket.close()