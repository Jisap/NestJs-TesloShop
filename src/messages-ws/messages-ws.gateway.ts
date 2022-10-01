import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{ // Estas interfaces permiten saber cuando un usuario se conecta o desconecta

  @WebSocketServer() wss: Server                                                    // Funcionalidad de socket.io adaptada a Nestjs

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService                                         // Inyección de dependencias relativas al authModule
  ) {


  }

  async handleConnection(client: Socket) {                                          // Esta función detecta cuando un cliente se conecta al server
    const token = client.handshake.headers.authentication as string;                // Identificamos el token que viene con el cliente
    let payload: JwtPayload;                                                        // Inicializamos la variable payload
    try {
      payload = this.jwtService.verify( token )                                     // Obtenemos el payload del token
      await this.messagesWsService.registerClient( client, payload.id )             // La función del service nos lo identifica y los guarda en un []string
    } catch (error) {
      client.disconnect()
      return
    }
    
   
  
    this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() ) // Emitimos a todos los clientes ese []string con las ids de los clientes conectados
  }                                                                                  // El evento emitido es 'clients-updated' 

  handleDisconnect(client: Socket) {                                                 // Esta función detecta cuando un cliente se desconecta del server
   
    this.messagesWsService.removeClient( client.id )

    this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() ) 
  }

  @SubscribeMessage('message-from-client')                                           // El server escucha los eventos 'message-from-client' emitidos por el cliente
  onMessageFromClient(client: Socket, payload: NewMessageDto ){
    
    // Desde el server el mensaje recibido se emite únicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });


    // Desde el server el mensaje recibido se emite al resto de clientes menos al que lo emitio
    // client.broadcast.emit('message-from-server', {
    //  fullname: 'Soy yo',
    //  message: payload.message || 'no message'
    //})

    // Desde el server el mensaje recibido se emite a todos los clientes conectados al server
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName( client.id ),
      message: payload.message || 'no-message!!'
    });
  }
}
