import {getStreamInfo} from "./api";
import {logger} from "../../logger/logger";

interface StreamData {
    title: string;
    category: string;
    startedAt: Date;
    viewerCount: number;
}

export async function getStreamData(streamerUsername: string): Promise<StreamData | null> {
    try {
        const apiRes = await getStreamInfo(streamerUsername);
        if (!apiRes) {
            logger.warn(`No stream info found for ${streamerUsername}`);
            return null;
        }

        const {title, game_name: category, started_at, viewer_count: viewerCount} = apiRes;

        if (!title || !category || !started_at || viewerCount == null) {
            logger.warn(`Incomplete stream data for ${streamerUsername}`);
            return null;
        }

        return {
            title,
            category,
            startedAt: new Date(started_at),
            viewerCount,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error fetching stream data for ${streamerUsername}: ${error.message}`);
        } else {
            logger.error(`Error fetching stream data for ${streamerUsername}: Unknown error`);
        }
        return null;
    }
}
