import winston from 'winston';
import {PrismaTransport} from './prismaTransport';

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});

try {
    logger.add(new PrismaTransport());
} catch (error) {
    logger.error(`Failed to initialize Prisma transport: ${error}`);
    console.error('Error initializing PrismaTransport:', error);
}

export {logger};