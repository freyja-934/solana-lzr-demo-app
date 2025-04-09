import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessageAccount } from '@repo/types';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('messages')
  async getMessages(): Promise<MessageAccount[]> {
    return this.eventService.getAllMessages();
  }

  @Get('user-messages')
  async getUserMessages(
    @Query('author') author: string,
  ): Promise<MessageAccount[]> {
    return this.eventService.getUserMessages(author);
  }

  @Get('list')
  async getEvents(@Query('limit') limit = 10, @Query('offset') offset = 0) {
    return this.eventService.getEvents(limit, offset);
  }

  @Post('messages')
  async postMessage(
    @Body() body: { message: string; author: string },
  ): Promise<string> {
    console.log('Received post message request:', body);
    return this.eventService.getPostMessageTx(body.message, body.author);
  }

  @Post('initialize')
  async initializeUser(@Body() body: { author: string }): Promise<string> {
    console.log('Received initialize request:', body);
    return this.eventService.getInitializeUserTx(body.author);
  }
}
