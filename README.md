# Certica Academic Benchmarks Node Api #

## Overview
This SDK is intended to be non-opinionated and provide core functionality for communicating with Certica's [academic benchmark api](http://docs.academicbenchmarks.com/#?d=api&f=getting_started). 

The SDK works best with V3 or V4 of the Certica api.

## Usage
Currently the SDK only provides the ability to generate the authentication parameters. This is fairly straight forward. It requires the use of the AB provided partner key and AB provided partner ID. 

- [AB Provided Authentication Examples](http://docs.academicbenchmarks.com/#?d=api&f=authentication)

SDK Example: 
```javascript
import CerticaSDK from 'path/to/sdk/index.js';

// AB provided partner key
const partnerKey = "2jfaWErgt2+o48gsk302kd";
// AB provided partner ID
const partnerId = "public";

// sdk initialization
const sdk = new CerticaSDK(partnerKey, partnerId);

/*
 * returns authentication params
 * By default the parameters returned will expire in 2 hours. 
 * By default no userId is returned
 */
const params = sdk.params();

/*
 * returns authentication params
 * By providing the expires date the parameters will expire at the date provided
 * By default no userId is returned
 */
const userSetExpires = new Date();
const params = sdk.params(userSetExpires.getTime());

/*
 * returns authentication params
 * By providing the expires date the parameters will expire at the date provided
 * By providing a userId it will be included in the parameters returned
 */
const userSetExpires = new Date();
const userId = "383485";
const params = sdk.params(userSetExpires.getTime(), userId);

```

The parameters that are generated by `sdk.params()`:
```javascript
{
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
```

#### Axios Example Usage
The parameters returned are design to work well with [Axios](https://github.com/axios/axios). However, they could easily be manipulated to work with any library that makes HTTP Requests

```javascript
import CerticaSDK from 'path/to/sdk/index.js';
import axios from 'axios';

const partnerId = "public";
const partnerKey = "2jfaWErgt2+o48gsk302kd";

const sdk = new CerticaSDK(partnerKey, partnerId);

const instance = axios.create({
    params: sdk.params(),
    baseURL: 'https://api.academicbenchmarks.com/rest/v3/'
});
```

## Typescript
This library is built using typescript :thumbsup:! Typing files are located in the dist directory after building the project. 

## Scripts
The following scripts are provided to make building and testing this project easier.

- `npm run tests`: Runs mocha typescript tests
- `npm run build`: Compiles typescript

## VS Code
For convenience we also include a couple default VSCode launch configurations. 

- Mocha All: Runs all mocha tests