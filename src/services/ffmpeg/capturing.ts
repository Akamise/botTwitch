import {spawn} from 'node:child_process';
import path from 'path';
import fs from 'fs';
import {logger} from '../../logger/logger';
import {botConfig} from '../../config/config';

export async function captureStreamSegmentUsingStreamlink(
    streamerUsername: string,
    maxRetries = 3,
    retryDelay = 2000
): Promise<string> {
    let retries = 0;

    while (retries <= maxRetries) {
        try {
            return await new Promise((resolve, reject) => {
                const outputDir = path.join(__dirname, '../../storage/tmp/');
                const outputFile = path.join(outputDir, `${streamerUsername}.gif`);
                let isFinished = false;

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, {recursive: true});
                    logger.info(`Created directory for temporary storage: ${outputDir}`);
                }

                const segmentDuration = botConfig.SEGMENT_DURATION || 5;
                const fps = botConfig.FPS || 10;
                const scaleWidth = botConfig.SCALE_WIDTH || 480;
                const streamSelector = `${scaleWidth}p30,${scaleWidth}p,720p60,720p,480p,360p,best,worst`;

                const streamlinkProcess = spawn('streamlink', [
                    `twitch.tv/${streamerUsername}`,
                    streamSelector,
                    '--stdout',
                    '--retry-streams', '5',
                    '--retry-max', '3',
                    '--retry-open', '3',
                ]);

                const ffmpegProcess = spawn('ffmpeg', [
                    '-y',
                    '-i', '-',
                    '-t', segmentDuration.toString(),
                    '-vf', `fps=${fps},scale=${scaleWidth}:-1:flags=lanczos`,
                    outputFile,
                ]);

                const timeout = setTimeout(() => {
                    if (isFinished) return;
                    isFinished = true;
                    streamlinkProcess.kill();
                    ffmpegProcess.kill();
                    reject(new Error('Process timeout'));
                }, 60000);

                streamlinkProcess.stdout.pipe(ffmpegProcess.stdin);

                streamlinkProcess.on('error', (err) => {
                    if (isFinished) return;
                    isFinished = true;
                    clearTimeout(timeout);
                    logger.error(`Streamlink error for ${streamerUsername}: ${err.message}`);
                    ffmpegProcess.kill();
                    reject(err);
                });

                streamlinkProcess.stderr.on('data', (data) => {
                    const message = data.toString();
                    if (message.includes('error') || message.includes('warning')) {
                        logger.warn(`Streamlink stderr for ${streamerUsername}: ${message}`);
                    }
                });

                ffmpegProcess.on('error', (err) => {
                    if (isFinished) return;
                    isFinished = true;
                    clearTimeout(timeout);
                    logger.error(`FFmpeg error for ${streamerUsername}: ${err.message}`);
                    streamlinkProcess.kill();
                    reject(err);
                });

                ffmpegProcess.stderr.on('data', (data) => {
                    const message = data.toString();
                    if (message.includes('error') || message.includes('warning')) {
                        logger.warn(`FFmpeg stderr for ${streamerUsername}: ${message}`);
                    }
                });

                ffmpegProcess.on('close', (code) => {
                    if (isFinished) return;
                    isFinished = true;
                    clearTimeout(timeout);
                    
                    if (code === 0) {
                        logger.info(`Stream segment captured successfully for ${streamerUsername}: ${outputFile}`);
                        streamlinkProcess.kill();
                        resolve(outputFile);
                    } else {
                        logger.error(`FFmpeg process for ${streamerUsername} exited with code ${code}`);
                        streamlinkProcess.kill();
                        reject(new Error(`FFmpeg process exited with code ${code}`));
                    }
                });

                streamlinkProcess.on('close', (code) => {
                    if (isFinished) return;
                    
                    if (code !== 0) {
                        isFinished = true;
                        clearTimeout(timeout);
                        logger.error(`Streamlink process for ${streamerUsername} exited with code ${code}`);
                        ffmpegProcess.kill();
                        reject(new Error(`Streamlink process exited with code ${code}`));
                    }
                });

                ffmpegProcess.stdin.on('error', (err: NodeJS.ErrnoException) => {
                    if (isFinished) return;
                    if (err.code !== 'EPIPE') {
                        isFinished = true;
                        clearTimeout(timeout);
                        logger.error(`Error in ffmpeg stdin for ${streamerUsername}: ${err.message}`);
                        streamlinkProcess.kill();
                        reject(err);
                    }
                });
            });
        } catch (error) {
            retries++;
            logger.warn(`Retry attempt ${retries}/${maxRetries} for ${streamerUsername} due to: ${error}`);

            if (retries > maxRetries) {
                logger.error(`Max retries exceeded for ${streamerUsername}`);
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    throw new Error(`Failed to capture stream segment after ${maxRetries} retries`);
}