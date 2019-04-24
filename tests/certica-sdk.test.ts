import { expect } from 'chai';
import crypto from 'crypto';
import CerticaSDK from '../src/index';

const key = "1234";
const id = "certica";

describe("CerticaSDK", () => {
    it("should be able to update key", () => {
        const sdk = new CerticaSDK(key, id);

        // change key
        sdk.key = "12345";

        expect(sdk.key).to.equal("12345");
        expect(sdk.id).to.equal(id);
    })

    it("should be able to update id", () => {
        const sdk = new CerticaSDK(key, id);

        // change id
        sdk.id = "certica2";

        expect(sdk.id).to.equal("certica2");
        expect(sdk.key).to.equal(key);
    })

    describe("params", () => {        
        /** 
         *  not providing expires should default to 2 hours
         */
        it("should default expires time to 2 hours if not provided", () => {
            const sdk = new CerticaSDK(key, id);
            const now = new Date();
            const params = sdk.params();
            const paramHours = new Date(params["auth.expires"]).getHours();

            // make sure to only check the hours
            // the seconds / ms could be slightly off due to processing time
            expect(paramHours).to.equal(now.getHours() + 2);       
        }) 
        
        /**
         * providing both user id and expires, both should be used
         */
        it("should base64 encode the signature using the user id and expires", () => {
            const sdk = new CerticaSDK(key, id);
            const expires = new Date();
            const userId = "user";
            const params = sdk.params(expires, { userId });
            const signature = crypto
                .createHmac("sha256", key)
                .update(`${expires.getTime()}\n${userId}`)
                .digest("base64");

            expect(params["auth.expires"]).to.equal(expires.getTime());
            expect(params["user.id"]).to.equal(userId);
            expect(params["auth.signature"]).to.equal(signature);
            expect(params["partner.id"]).to.equal(id);
        })

        /**
         * providing expires, should use this over default
         */
        it("should base64 encode the signature using expires", () => {
            const sdk = new CerticaSDK(key, id);
            const expires = new Date();
            const params = sdk.params(expires);
            const signature = crypto
                .createHmac("sha256", key)
                .update(`${expires.getTime()}\n`)
                .digest("base64");

            expect(params["auth.expires"]).to.equal(expires.getTime());
            expect(params["user.id"]).to.equal(undefined);
            expect(params["auth.signature"]).to.equal(signature);
            expect(params["partner.id"]).to.equal(id);
        })

        /**
         * updating the key, should result in it being used while getting the params
         */
        it("should use the updated key if it is changed", () => {
            const sdk = new CerticaSDK(key, id);
            const expires = new Date();

            // change key
            sdk.key = "12345";

            const params = sdk.params(expires);
            const signature = crypto
                .createHmac("sha256", "12345")
                .update(`${expires.getTime()}\n`)
                .digest("base64");

            expect(params["auth.expires"]).to.equal(expires.getTime());
            expect(params["user.id"]).to.equal(undefined);
            expect(params["auth.signature"]).to.equal(signature);
            expect(params["partner.id"]).to.equal(id);
        })

        /**
         * updating the id, should result in it being used while getting the params
         */
        it("should use the updated id if it is changed", () => {
            const sdk = new CerticaSDK(key, id);
            const expires = new Date();

            // change id
            sdk.id = "12345";

            const params = sdk.params(expires);
            const signature = crypto
                .createHmac("sha256", key)
                .update(`${expires.getTime()}\n`)
                .digest("base64");

            expect(params["auth.expires"]).to.equal(expires.getTime());
            expect(params["user.id"]).to.equal(undefined);
            expect(params["auth.signature"]).to.equal(signature);
            expect(params["partner.id"]).to.equal("12345");
        })
    })
})