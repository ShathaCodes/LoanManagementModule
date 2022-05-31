import {Body, Controller, Get, OnModuleInit, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {Client, ClientKafka, EventPattern,} from '@nestjs/microservices'
import {microserviceConfig} from "./microserviceConfig";
import { json } from 'stream/consumers';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  @Client(microserviceConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [
      'apply',
    ];

    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("apply")
  async apply(@Body() payload) {
    this.client.emit<Object>('apply', payload);
  }

  @EventPattern('apply')
  async handleClientApplication(payload: any) {
    console.log("Process event from topic 'apply'..." )
    let clientInfo = payload.value;
    console.log("clientInfo : " + JSON.stringify(clientInfo))
    let score = this.calculateScore(clientInfo.loan)
    console.log("initial score= " +score)
    this.client.emit<Object>('processRisk', {'score':score, 'clientInfo' : clientInfo });
    console.log("Event sent to topic 'processRisk'")
  }

  private calculateScore(loan): number {
    return ( Math.random() * loan) % 100;
  }
}