import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({     //controller        //services
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [AuthModule]
})
export class MessagesWsModule {}
