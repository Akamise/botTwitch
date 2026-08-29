interface TwitchAPIOAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface StreamData {
    title: string;
    category: string;
    startedAt: Date;
    viewerCount: number;
}