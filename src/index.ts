
import { signToken } from './utils';

interface IAuthenticationParams {
    /**
     * partner id, provided by AB support
     */
    'partner.id': string,
    /**
     * base64 encoded authentication signature. 
     * created by concating the expires time and the user id (if provided).
     */
    'auth.signature': string,
    /**
     * time since epoch in ms, when the token will expire
     */
    'auth.expires': number
    /**
     * optional user id for the request
     */
    'user.id'?: string | number
}

export default class CerticaSDK {

    // public key: string;
    // public id: string;

    /**
     * 
     * @param key partner key, provided by AB Support
     * @param id partner id, provided by AB support
     */
    constructor(
        public key: string,
        public id: string,
    ) { }

    /**
     * generates authentication parameters for sending certica requests
     * @param expires (optional) when the auth.signature will expire. Defaults to 2 hours.
     * @param userId (optional) userId that will be associated with the request.
     */
    public params(expires?: Date, userId?: number | string): IAuthenticationParams {
        expires = expires || this.defaultExpires;
        const signature = signToken(
            this.key, 
            expires.getTime(), 
            userId
        );

        return {
            "auth.expires": expires.getTime(),
            "auth.signature": signature,
            "partner.id": this.id,
            "user.id": userId,
        };
    }

    private get defaultExpires() {
        const now = new Date();
        now.setHours(now.getHours() + 2);

        return now;
    }
}

