import {bot} from "./services/telegram/bot";
import {logger} from "./logger/logger";
import {botConfig} from "./config/config";
import {streamCheckJob} from "./cron/scheduler";
import {Locale} from "./i18n/types";
import {setLocale} from "./i18n";

const configLocale = botConfig.LOCALE as Locale;
if (configLocale && (configLocale === 'en' || configLocale === 'uk')) {
    setLocale(configLocale);
    logger.info(`Localization set to: ${configLocale}`);
} else {
    logger.info(`Using default localization: en`);
}

bot.launch();
logger.info(`Bot launched successfully for streamer: ${botConfig.STREAMER_USERNAME}, channel: ${botConfig.TELEGRAM_CHANNEL_ID}`);

streamCheckJob.start();
logger.info("Stream checking cron job started.");

process.once('SIGINT', () => {
    logger.warn("SIGINT received. Stopping bot...");
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    logger.warn("SIGTERM received. Stopping bot...");
    bot.stop('SIGTERM');
});
