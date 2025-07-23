from socket import *
serverPort = 50000
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverSocket.bind(('', serverPort))

print ("The server is ready to receive:")
stop = False
while not stop:
    #receive data from client
    message, clientAddress = serverSocket.recvfrom(2048)
    print(f"Receive {message.decode()} from {clientAddress}")
    #send back data (modified) to client
    modifiedMessage = message.decode().upper()
    if(modifiedMessage == "BYE"):
        stop = True
    else:
        serverSocket.sendto(modifiedMessage.encode(),clientAddress)