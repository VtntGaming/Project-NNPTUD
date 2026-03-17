const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_COOKIE_NAME = 'LOGIN_NNPTUD_S3';
const JWT_EXPIRES_IN = '24h';
const KEY_DIRECTORY = path.join(__dirname, '..', 'keys');
const PRIVATE_KEY_PATH = path.join(KEY_DIRECTORY, 'jwtRS256.key');
const PUBLIC_KEY_PATH = path.join(KEY_DIRECTORY, 'jwtRS256.key.pub');

function ensureKeyPair() {
    if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
        return;
    }

    fs.mkdirSync(KEY_DIRECTORY, { recursive: true });

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { encoding: 'utf8' });
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey, { encoding: 'utf8' });
}

function getPrivateKey() {
    ensureKeyPair();
    return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
}

function getPublicKey() {
    ensureKeyPair();
    return fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
}

function createAccessToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            username: user.username
        },
        getPrivateKey(),
        {
            algorithm: 'RS256',
            expiresIn: JWT_EXPIRES_IN
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(token, getPublicKey(), {
        algorithms: ['RS256']
    });
}

module.exports = {
    JWT_COOKIE_NAME,
    jwtCookieOptions: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    },
    createAccessToken,
    verifyAccessToken
};