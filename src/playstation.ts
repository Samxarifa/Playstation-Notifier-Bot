import { exchangeAccessCodeForAuthTokens, exchangeNpssoForAccessCode, exchangeRefreshTokenForAuthTokens, type AuthTokensResponse } from "psn-api";
import TokenStore from "./tokenStore";

export default class PlaystationAPI {
    private static SEND_URL = "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/{group_id}/threads/{group_id}/messages";
    private tokenStore = new TokenStore();

    constructor(private npsso: string, private groupId: string) {}

    public async sendMessage(message: string) {
        const accessToken = await this.getAccessToken();

        const url = PlaystationAPI.SEND_URL.replace(/{group_id}/g, this.groupId);

        await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messageType: 1,
                body: message
            })
        });
    }
    
    private async getTokensFromNpsso() {
        console.log("Generating Tokens from NPSSO");
        const accessCode = await exchangeNpssoForAccessCode(this.npsso);
        const authTokens = await exchangeAccessCodeForAuthTokens(accessCode);
        await this.tokenStore.store(authTokens);
    }

    private async getAccessToken() {
        
        if (!this.tokenStore.getAccessToken() && !(await this.tokenStore.getRefreshToken())) {
            await this.getTokensFromNpsso();
            if (!this.tokenStore.getAccessToken() || !this.tokenStore.getExpiryTimeISO()) {
                throw new Error("Failed to Generate Tokens");
            }
        }
        
        const expiryTimeISO = this.tokenStore.getExpiryTimeISO();
        if (!expiryTimeISO || new Date().getTime() >= new Date(expiryTimeISO).getTime()) {
            console.log("Refreshing Access Token");

            const refreshToken = await this.tokenStore.getRefreshToken();
            if (!refreshToken) {
                throw new Error("No Refresh Token Found");
            }
            const authTokens = await exchangeRefreshTokenForAuthTokens(refreshToken);
            await this.tokenStore.store(authTokens);
        }
        return this.tokenStore.getAccessToken();
    }
}