import {logger} from "../logger/logger";
import {prisma} from "../prisma/client";

export async function getCurrentPostId(streamerUsername: string): Promise<number | null> {
    try {
        const record = await prisma.currentPost.findUnique({
            where: {streamerUsername}
        });

        if (record) {
            logger.debug(`Retrieved current post ID: ${record.messageId} for streamer: ${streamerUsername}`);
        } else {
            logger.debug(`No current post found for streamer: ${streamerUsername}`);
        }

        return record ? record.messageId : null;
    } catch (error) {
        logger.error(`Error retrieving current post ID for streamer ${streamerUsername}: ${error}`);
        return null;
    }
}

export async function saveCurrentPostId(
    streamerUsername: string,
    telegramChannelId: string,
    messageId: number
): Promise<void> {
    try {
        await prisma.currentPost.upsert({
            where: {streamerUsername},
            update: {messageId, telegramChannelId},
            create: {streamerUsername, telegramChannelId, messageId}
        });
        logger.info(`Saved current post ID: ${messageId} for streamer: ${streamerUsername}`);
    } catch (error) {
        logger.error(`Error saving current post ID for streamer ${streamerUsername}: ${error}`);
    }
}

export async function deleteCurrentPostId(streamerUsername: string): Promise<void> {
    try {
        await prisma.currentPost.delete({
            where: {streamerUsername}
        });
        logger.info(`Deleted current post for streamer: ${streamerUsername}`);
    } catch (error) {
        logger.warn(`No post found to delete for streamer: ${streamerUsername}`);
    }
}

export async function truncateCurrentPosts(): Promise<void> {
    try {
        await prisma.currentPost.deleteMany({});
        logger.info("Current posts table truncated successfully.");
    } catch (error) {
        logger.error(`Error clearing current post records: ${error}`);
    }
}
