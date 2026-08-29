import path from "path";
import fs from "fs";
import {PrismaClient} from "@prisma/client";

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, {recursive: true});
    console.log(`Created directory for SQLite database: ${dbDir}`);
}


export const prisma = new PrismaClient();