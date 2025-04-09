import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './event.controller';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';
@Module({
  imports: [ConfigModule],
  controllers: [EventController],
  providers: [EventService, EventGateway],
  exports: [EventService],
})
export class EventModule {}
