import {Telegraf} from 'telegraf';
import {botConfig} from "../../config/config";

export const bot = new Telegraf(botConfig.TELEGRAM_BOT_TOKEN);