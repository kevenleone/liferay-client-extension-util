import { env, fetcher } from "@liferay-client-extension-util/shared";

export default class LiferayOAuth2Client {
    private static applicationIds = new Map<String, String>();

    private static oAuth2Client = new Map<
        String,
        { expires_in: number; token: string }
    >();

    public static async getAuthorization(externalReferenceCode: string) {
        const oAuth2Client = this.oAuth2Client.get(externalReferenceCode);

        if (oAuth2Client && oAuth2Client.expires_in > Date.now()) {
            return oAuth2Client.token;
        }

        const data = await fetcher.post<{
            access_token: string;
            expires_in: number;
            token_type: string;
        }>(
            `/o/oauth2/token`,
            new URLSearchParams({
                client_id: await this.getClientId(externalReferenceCode),
                client_secret: this.getClientSecret(externalReferenceCode),
                grant_type: "client_credentials",
            }),
            {
                headers: {
                    "Content-Type": "",
                },
                shouldStringify: false,
            }
        );

        const token = `${data.token_type} ${data.access_token}`;

        this.oAuth2Client.set(externalReferenceCode, {
            expires_in: data.expires_in * 1000 + Date.now() - 15000,
            token,
        });

        return token;
    }

    public static async getClientId(externalReferenceCode: string) {
        if (this.applicationIds.has(externalReferenceCode)) {
            return this.applicationIds.get(externalReferenceCode);
        }

        const { client_id: clientId } = await fetcher(
            `/o/oauth2/application?externalReferenceCode=${externalReferenceCode}`
        );

        this.applicationIds.set(externalReferenceCode, clientId);

        return clientId;
    }

    private static getClientSecret(externalReferenceCode: string) {
        const clientSecret =
            env[
                `${externalReferenceCode}.oauth2.headless.server.client.secret`
            ];

        if (!clientSecret) {
            throw new Error(
                `Unable to find ${externalReferenceCode} client secret`
            );
        }

        return clientSecret;
    }
}

export { LiferayOAuth2Client };
