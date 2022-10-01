import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {    // Colección de clientes conectados al server
    [id: string]: {             // Cada id del socket va a apunta a un objeto que contendrá    
        socket:Socket,          // el socket(server) al que se conecto  
        user: User              // y el usuario que introdujo el token para poder conectarse
    }
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {}     // Inyección de la prop que guarda los clientes conectados al server

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>
    ){}

    async registerClient( client: Socket, userId: string ){                 // Detectado un cliente que se conecta en el gateway, lo recibe esta función
        
        const user = await this.userRepository.findOneBy({ id:userId })     // Verificamos que el usuario del token está en bd
        if( !user ) throw new Error('User not found')                       // Si no existe el usuario mensaje de erro
        if( !user.isActive ) throw new Error('User not active')             // Si existe pero no está activo mensaje de error
        
        this.checkUserConnection( user )                                    // Comprobamos que no estaba antes conectado

        this.connectedClients[client.id] = {                                // Si existe y está activo lo identifica en base a la interface y lo guarda en []string
            socket: client,     
            user: user,
        }
    }

    removeClient( clientId:string ){                    // Lo mismo para borrar un cliente conectado
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys( this.connectedClients )     // Devuelve un []:string con los clientes conectados al server
    }

    getUserFullName( SocketId: string ){
        return this.connectedClients[SocketId].user.fullName;   // Devuelve el nombre del modelo User asociado a un socket id de la interface ConnectedClients
    }

    private checkUserConnection( user: User ){                          // Esta función recibe un usuario que esta conectado y lo desconecta si ya lo estaba         
        for ( const clientId of Object.keys( this.connectedClients)){   // Barremos los clientes de [connectedClients]
            const connectedClient = this.connectedClients[clientId]     // Identificamos el cliente iterado
            if (connectedClient.user.id === user.id){                   // Si el cliente iterado = usuario que queremos comprobar si ya esta conectado
                connectedClient.socket.disconnect()                     // lo desconectamos    
                break;
            }    
        }
    }
}
