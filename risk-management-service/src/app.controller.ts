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
      'processRisk',
    ];

    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('processRisk')
  async handleClientApplication(payload: any) {
    console.log("Process event from topic 'processRisk'..." )
    console.log("info : " + JSON.stringify(payload.value))
    let clientInfo = payload.value.clientInfo;
    let initial_score = payload.value.score;
    let score = this.calculateScore(clientInfo.loan) + initial_score /2
    console.log("final score= " +score)
    if (score > 50 ){
      this.client.emit<Object>('processCredit', clientInfo );
      console.log("Event sent to topic 'processCredit'");
    }
    else{
      this.client.emit<Object>('notify', {"application_status" : "Rejected"} );
      console.log("Event sent to topic 'notify'");
    }
      
  }

  private calculateScore(loan : number): number {
    return ( Math.random() * loan) % 100;
  }
}