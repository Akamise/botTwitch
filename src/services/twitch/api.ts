import {logger} from "../../logger/logger";
import {botConfig} from "../../config/config";
import {HelixStreamData} from "@twurple/api/lib/interfaces/endpoints/stream.external";
import axios from "axios";

let accessToken: string | null = null;
let tokenExpiration: number = 0;

async function authenticate(): Promise<boolean> {
    const currentTime = Date.now();

    // If the access token is valid, we don't need to refresh it
    if (accessToken && currentTime < tokenExpiration) {
        return true;
    }

    try {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${botConfig.TWITCH_CLIENT_ID}&client_secret=${botConfig.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
        const response = await axios.post(url);

        if (response.statusText !== 'OK') {
            logger.error(`Twitch authentication failed: ${response.statusText}`);
            return false;
        }

        const data: TwitchAPIOAuthResponse = response.data;
        accessToken = data.access_token;
        tokenExpiration = currentTime + data.expires_in * 1000 - 60000;

        logger.info('Twitch API authentication is successful.');
        return true;
    } catch (error) {
        logger.error(`Twitch API authentication error: ${error instanceof Error ? error.message : error}`);
        return false;
    }
}

export async function getStreamInfo(streamerUsername: string): Promise<HelixStreamData | null> {
    try {
        const isAuthenticated = await authenticate();
        if (!isAuthenticated) {
            logger.error('Authentication failed, cannot fetch stream info.');
            return null;
        }

        const url = `https://api.twitch.tv/helix/streams?user_login=${streamerUsername}`;
        const response = await axios.get(url, {
            headers: {
                'Client-ID': botConfig.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.statusText !== 'OK') {
            logger.error(`Failed to fetch stream info: ${response.statusText}`);
            return null;
        }

        const data: HelixStreamData[] = response.data.data;

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    } catch (error) {
        logger.error(`Failed to get stream info for ${streamerUsername}: ${error instanceof Error ? error.message : error}`);
        return null;
    }
}
