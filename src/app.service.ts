import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getHealth(): Promise<object> {
    const isDatabaseConnected = await this.checkDatabaseConnection();
    const microserviceHealth = 'Microservice is healthy!';
    const databaseHealth = isDatabaseConnected
      ? 'Database is connected!'
      : 'Database connection failed!';

    return { message: `${microserviceHealth} ${databaseHealth}` };
  }
}
