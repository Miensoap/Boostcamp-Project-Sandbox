import { Logger, QueryRunner } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';
import * as winston from 'winston';
import { AsyncLocalStorage } from 'node:async_hooks';

// 요청 ID 관리를 위한 AsyncLocalStorage
export const asyncLocalStorage = new AsyncLocalStorage();

// Winston 로거 설정
const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/typeorm.log' }), // 로그 파일 경로
  ],
});

export class CustomLogger implements Logger {
  private readonly logger = new NestLogger('TypeORM');

  private getRequestId(): string {
    const store = asyncLocalStorage.getStore();
    return store ? store['id'] : 'unknown';
  }

  private logToFile(message: string) {
    fileLogger.info(message); // 파일에 로그 기록
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestId = this.getRequestId();
    const paramString = parameters ? JSON.stringify(parameters) : '';
    const message = `[${requestId}] [QUERY] ${query} -- PARAMETERS: ${paramString}`;
    this.logger.log(message);
    this.logToFile(message);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestId = this.getRequestId();
    const paramString = parameters ? JSON.stringify(parameters) : '';
    const message = `[${requestId}] [QUERY ERROR] ${error} -- QUERY: ${query} -- PARAMETERS: ${paramString}`;
    this.logger.error(message);
    this.logToFile(message);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestId = this.getRequestId();
    const paramString = parameters ? JSON.stringify(parameters) : '';
    const message = `[${requestId}] [SLOW QUERY] ${query} -- TIME: ${time}ms -- PARAMETERS: ${paramString}`;
    this.logger.warn(message);
    this.logToFile(message);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    const requestId = this.getRequestId();
    const fullMessage = `[${requestId}] [SCHEMA BUILD] ${message}`;
    this.logger.log(fullMessage);
    this.logToFile(fullMessage);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    const requestId = this.getRequestId();
    const fullMessage = `[${requestId}] [MIGRATION] ${message}`;
    this.logger.log(fullMessage);
    this.logToFile(fullMessage);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    const requestId = this.getRequestId();
    const fullMessage = `[${requestId}] [${level.toUpperCase()}] ${message}`;
    this.logger.log(fullMessage);
    this.logToFile(fullMessage);
  }
}
