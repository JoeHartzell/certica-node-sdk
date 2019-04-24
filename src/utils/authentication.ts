import crypto from 'crypto';

/**
 * 
 * @param key AB partner key
 * @param expires Client provided expires time since epoch
 * @param userId (optional) Client provided user id 
 */
export const signToken = (key: string, expires: number, options: ISignTokenOptions = {}): string  => {
    let message = `${expires}\n`;

    if (options.userId) {
        message += options.userId
    }

    if (options.method && options.resource) {
        message += `\n${options.method}\n${options.resource}`;
    }
    
    return crypto
        .createHmac("sha256", key)
        .update(message)
        .digest("base64");
}

export interface ISignTokenOptions {
    /**
     * Client provided user id
     */
    userId?: string | number;
    /**
     * HTTP method to limit the signature to
     */
    method?: "GET" | "POST" | "PUT" | "DELETE",
    /**
     * Resource that the signature is valid for
     */
    resource?: string,
}