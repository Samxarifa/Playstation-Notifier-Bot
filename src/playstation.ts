import { exchangeAccessCodeForAuthTokens, exchangeNpssoForAccessCode, exchangeRefreshTokenForAuthTokens, type AuthTokensResponse } from "psn-api";

const SEND_URL = "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/{group_id}/threads/{group_id}/messages";
export default class PlaystationAPI {
    
    private expiryTimeISO: string | null = null;
    private authTokens: AuthTokensResponse | null = null;


    constructor(private npsso: string, private groupId: string) {}

    public async sendMessage(message: string) {
        const accessToken = await this.getAccessToken();

        const url = SEND_URL.replace(/{group_id}/g, this.groupId);

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
        this.authTokens = authTokens;
        this.setExpiryTimeISO();
    }

    private async getAccessToken() {
        if (!this.authTokens) {
            await this.getTokensFromNpsso();
        } 
        if (!this.authTokens || !this.expiryTimeISO) {
            throw new Error("Failed to Generate Tokens");
        }
        if (new Date().getTime() >= new Date(this.expiryTimeISO).getTime()) {
            console.log("Refreshing Access Token");
            this.authTokens = await exchangeRefreshTokenForAuthTokens(this.authTokens.refreshToken);
            this.setExpiryTimeISO();
        }
        return this.authTokens.accessToken;
    }

    private setExpiryTimeISO() {
        if (this.authTokens) {
            this.expiryTimeISO = new Date(Date.now() + this.authTokens.expiresIn * 1000).toISOString();
            console.log(`New Expiry Time: ${this.expiryTimeISO}`);
        }
    }
}