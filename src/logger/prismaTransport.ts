import Transport from 'winston-transport';
import {prisma} from "../prisma/client";

interface LogInfo {
    level: string;
    message: string;
    timestamp?: string;
}

export class PrismaTransport extends Transport {
    constructor(opts?: any) {
        super(opts);
    }

    log(info: LogInfo, callback: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        try {
            prisma.log.create({
                data: {
                    level: info.level,
                    message: info.message,
                }
            }).catch((error: any) => {
                console.error(`Failed to save log to database. Error: ${error.message}`);
            }).finally(() => {
                callback();
            });
        } catch (error) {
            console.error('Error in PrismaTransport:', error);
            callback();
        }
    }

}
