import { expect } from 'chai';
import crypto from 'crypto';
import CerticaSDK from '../src/index';

const key = "1234";
const id = "certica";

describe("CerticaSDK", () => {
    describe("params", () => {
        const sdk = new CerticaSDK(key, id);
        
        /** 
         *  not providing expires should default to 2 hours
         */
        it("should default expires time to 2 hours if not provided", () => {
            const now = new Date();
            const params = sdk.params();

            // make sure you set the date AFTER getting the params
            // if you don't the times are off and the test fails
            now.setHours(now.getHours() + 2);

            expect(params["auth.expires"]).to.equal(now.getTime());            
        }) 
        
        /**
         * providing both user id and expires, both should be used
         */
        it("should base64 encode the signature using the user id and expires", () => {
            const expires = new Date();
            const userId = "user";
            const params = sdk.params(expires, userId);
            const signature = crypto
                .createHmac("sha256", key)
                .update(`${expires.getTime()}\n${userId}`)
                .digest("base64");

            expect(params["auth.expires"]).to.equal(expires.getTime());
            expect(params["user.id"]).to.equal(userId);
            expect(params["auth.signature"]).to.equal(signature);
        })

        /**
         * providing expires, should use this over default
         */
        it("should base64 encode the signature using expires", () => {
            const expires = new Date();
            const params = sdk.params(expires);
            const signature = crypto
                .createHmac("sha256", key)
                .update(`${expires.getTime()}`)
                .digest("base64");

            expect(params["auth.expires"]).to.equal(expires.getTime());
            expect(params["user.id"]).to.equal(undefined);
            expect(params["auth.signature"]).to.equal(signature);
        })
    })
})