import type { AuthTokensResponse } from "psn-api";

export default class TokenStore {
    private static REFRESH_TOKEN_FILE_PATH = "/data/refresh_token";
    private refreshFile = Bun.file(TokenStore.REFRESH_TOKEN_FILE_PATH);

    private accessToken: string | null = null;
    private expiryTimeISO: string | null = null;

    async store(authTokens: AuthTokensResponse) {
        this.accessToken = authTokens.accessToken;
        this.expiryTimeISO = new Date(Date.now() + authTokens.expiresIn * 1000).toISOString();

        await this.saveRefreshToken(authTokens.refreshToken);
    }

    private async saveRefreshToken(refreshToken: string) {
        await this.refreshFile.write(refreshToken);
    }

    async getRefreshToken() {
        try {
            if (await this.refreshFile.exists()) {
                return await this.refreshFile.text();
            }
            return null;
        } catch (error) {
            console.error("Error reading refresh token:", error);
            return null;
        }
    }

    getAccessToken() {
        return this.accessToken;
    }

    getExpiryTimeISO() {
        return this.expiryTimeISO;
    }
}