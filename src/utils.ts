import crypto from 'crypto';

export const signToken = (key: string, expires: number, userId?: string | number): string  => {
    const message = userId !== undefined ? `${expires}\n${userId}` : expires.toString();
    return crypto
        .createHmac("sha256", key)
        .update(message)
        .digest("base64");
}