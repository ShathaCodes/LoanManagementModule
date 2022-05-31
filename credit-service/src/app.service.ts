import { Inject, Injectable } from '@nestjs/common';
import { Producer } from "kafkajs";

@Injectable()
export class AppService {
  constructor() {

  }
  getHello(): string {
    return 'Hello World!';
  }
}