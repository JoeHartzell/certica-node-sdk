import { signToken } from '../src/utils';
import crypto from 'crypto';
import { expect } from 'chai';

describe("utils", () => {
    describe("signToken", () => {
        /**
         * providing both userId and expires
         */
        it("should base64 encode the user id and expires when both are provided", () => {
            const key = "key";
            const userId = "1234";
            const expires = new Date().getTime();

            const signature = signToken(key, expires, userId);
            const expected = crypto
                .createHmac("sha256", key)
                .update(`${expires}\n${userId}`)
                .digest("base64");

            expect(signature).to.equal(expected);
        })

        /**
         * providing expires
         */
        it("should base64 encode the expires when only it is provided", () => {
            const key = "key";
            const expires = new Date().getTime();

            const signature = signToken(key, expires);
            const expected = crypto
                .createHmac("sha256", key)
                .update(`${expires}`)
                .digest("base64");

            expect(signature).to.equal(expected);
        })
    })
})