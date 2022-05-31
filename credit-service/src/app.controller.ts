import {Body, Controller, Get, OnModuleInit, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {Client, ClientKafka, EventPattern,} from '@nestjs/microservices'
import {microserviceConfig} from "./microserviceConfig";

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  @Client(microserviceConfig)
  client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [
      'processCredit',
      'notify'
    ];

    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('processCredit')
  async handleClientApplication(payload: any) {
    console.log("Process event from topic 'processCredit'..." )
    let clientInfo = payload.value;
    console.log("info : " + JSON.stringify(payload.value))
    // Prep docs 
    let doc = {
      "application_status" : "Accepted",
      "date" : new Date(),
      "client" : clientInfo
    }
    this.client.emit<Object>('notify', doc);
    console.log("Event sent to topic 'notify'");
  }

  @EventPattern('notify')
  async test(payload: any) {
    console.log("ClientAPP : Process event from topic 'notify'... ")
    console.log("info : " + JSON.stringify(payload.value))
  }

}