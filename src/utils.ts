import crypto from 'crypto';

/**
 * 
 * @param key AB partner key
 * @param expires Client provided expires time since epoch
 * @param userId (optional) Client provided user id 
 */
export const signToken = (key: string, expires: number, userId?: string | number): string  => {
    const message = userId !== undefined ? `${expires}\n${userId}` : expires.toString();
    return crypto
        .createHmac("sha256", key)
        .update(message)
        .digest("base64");
}