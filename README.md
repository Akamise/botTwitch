# TwiLive | Twitch Stream Notification Bot

TwiLive is a Telegram bot that automatically posts and updates live stream notifications whenever Twitch streamer
goes live.

## Features

- **Live Notifications**: Automatically posts to Telegram when the Twitch stream starts.
- **Real-Time Updates**: Updates the Telegram post during the live stream with current details:
    - Stream title and category
    - Duration and viewer count
    - Direct Twitch links
- **Animated Preview**: Captures and attaches a 3-second(configurable) GIF preview from the live stream.
- **Auto Cleanup**: Deletes the post once the stream ends.
- **Database Logging**: Logs all events (stream start/end, updates, errors) to a SQLite database.

## Self-Hosted Deployment

This bot is designed for self-hosting using Docker Compose. Follow these steps to deploy the bot.

### Prerequisites

- **Docker Compose**
- **Twitch Developer Account**  
  (Register your app at [Twitch Dev Console](https://dev.twitch.tv/console). Ensure your account has two-factor
  authentication enabled.)
- **Telegram Bot Token**  
  (Create your bot via [BotFather](https://t.me/BotFather) and add it as an administrator to your Telegram channel.)

### Step 1: Clone the Repository

```bash
git clone https://github.com/HarkushaVlad/TwiLive-bot
cd TwiLive-bot
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory. The environment variables configure the bot's credentials and behavior.
Replace the placeholder values with your own credentials.

#### Explanation of Environment Variables

- **TELEGRAM_BOT_TOKEN**: Your bot token from [BotFather](https://t.me/BotFather).
- **TELEGRAM_CHANNEL_ID**: The numeric ID of your Telegram channel (
  see [this guide](https://neliosoftware.com/content/help/how-do-i-get-the-channel-id-in-telegram/)).
- **TWITCH_CLIENT_ID** & **TWITCH_CLIENT_SECRET**: Your Twitch API credentials
  from [Twitch Dev Console](https://dev.twitch.tv/console).
- **STREAMER_USERNAME**: The Twitch username of the streamer (as seen in the URL).
- **SEGMENT_DURATION**: Duration (in seconds) for the animated GIF preview.
- **FPS**: Frames per second for the GIF.
- **SCALE_WIDTH**: The width (in pixels) for the GIF preview.
- **LOCALE**: Interface language for notifications ('en' for English, 'uk' for Ukrainian, defaults to 'en').

#### Example `.env` File

```ini
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_telegram_channel_id_here

# Twitch API Credentials
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here

# Streamer Information
STREAMER_USERNAME=your_favorite_streamer

# GIF Configuration
SEGMENT_DURATION=5
FPS=10
SCALE_WIDTH=480

# Localization
LOCALE=en
```

### Step 3: Start the Containers

Build and start the containers with Docker Compose:

```bash
docker-compose up --build -d
```

### Step 4: Verify the Deployment

Check the logs to ensure the bot is running correctly:

```bash
docker-compose logs -f app
```

## Database Logging

The bot logs events such as stream start/end, viewer count snapshots, post creation, updates, deletions, and error
events into a SQLite database. These logs are stored in a persistent volume. SQLite was chosen for its simplicity and
low resource requirements.

---

## License

This project is licensed under the MIT License. See
the [LICENSE](https://github.com/HarkushaVlad/TwiLive-bot/blob/main/LICENSE) file for details.