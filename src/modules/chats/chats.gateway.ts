import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\// })
export class ChatsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() public server: Server;

    @SubscribeMessage('test')
    handleMessage(@MessageBody() data: string) {
        console.log('test', data);

        return 'Hello world!';
    }

    afterInit(server: Server): any {
        console.log('init');
    }

    handleConnection(@ConnectedSocket() socket: Socket): any {
        console.log('connected', socket.nsp.name);
        socket.emit('hellow', socket.nsp.name);
    }

    @SubscribeMessage('chat')
    handleTest(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: string,
    ): any {
        socket.to('1,@').emit('dm', data);

        this.server.to('1,@').emit('dm', data, true);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket): any {
        console.log('disconnected', socket.nsp.name);
        socket.rooms.size === 0;
        const newNameSpace = socket.nsp;
        newNameSpace.emit('onlineList', socket.nsp.name);
    }
}
