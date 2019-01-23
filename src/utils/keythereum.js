/**
 * Create, import, and export ethereum keys.
 * @author Jack Peterson (jack@tinybike.net)
 */

import uuid from 'uuid';
import {randomBytes} from 'react-native-randombytes'
import {NativeModules} from 'react-native'

const {DeriveKey} = NativeModules;

let secp256k1 = require("secp256k1/elliptic");
let createKeccakHash = require("keccak/js");

function isFunction(f) {
  return typeof f === "function";
}

function keccak256(buffer) {
  return createKeccakHash("keccak256").update(buffer).digest();
}

module.exports = {

  version: "1.0.4",

  scrypt: null,

  crypto: require("crypto"),//isBrowser ? require("crypto-browserify") : require("crypto"),

  constants: {

    // Symmetric cipher for private key encryption
    cipher: "aes-128-ctr",

    // Initialization vector size in bytes
    ivBytes: 16,

    // ECDSA private key size in bytes
    keyBytes: 32,

    // Key derivation function parameters
    pbkdf2: {
      c: 262144,
      dklen: 32,
      hash: "sha256",
      prf: "hmac-sha256"
    },
    scrypt: {
      memory: 280000000,
      dklen: 32,
      n: 262144,
      r: 1,
      p: 8
    }
  },

  /**
   * Check whether a string is valid hex.
   * @param {string} str String to validate.
   * @return {boolean} True if the string is valid hex, false otherwise.
   */
  isHex: function (str) {
    if (str.length % 2 === 0 && str.match(/^[0-9a-f]+$/i)) return true;
    return false;
  },

  /**
   * Check whether a string is valid base-64.
   * @param {string} str String to validate.
   * @return {boolean} True if the string is valid base-64, false otherwise.
   */
  isBase64: function (str) {
    let index;
    if (str.length % 4 > 0 || str.match(/[^0-9a-z+\/=]/i)) return false;
    index = str.indexOf("=");
    if (index === -1 || str.slice(index).match(/={1,2}/)) return true;
    return false;
  },

  /**
   * Convert a string to a Buffer.  If encoding is not specified, hex-encoding
   * will be used if the input is valid hex.  If the input is valid base64 but
   * not valid hex, base64 will be used.  Otherwise, utf8 will be used.
   * @param {string} str String to be converted.
   * @param {string=} enc Encoding of the input string (optional).
   * @return {buffer} Buffer (bytearray) containing the input data.
   */
  str2buf: function (str, enc) {
    if (!str || str.constructor !== String) return str;
    if (!enc && this.isHex(str)) enc = "hex";
    if (!enc && this.isBase64(str)) enc = "base64";

    return Buffer.from(str, enc);
  },

  /**
   * Check if the selected cipher is available.
   * @param {string} algo Encryption algorithm.
   * @return {boolean} If available true, otherwise false.
   */
  isCipherAvailable: function (cipher) {
    return this.crypto.getCiphers().some(function (name) {
      return name === cipher;
    });
  },

  /**
   * Symmetric private key encryption using secret (derived) key.
   * @param {buffer|string} plaintext Data to be encrypted.
   * @param {buffer|string} key Secret key.
   * @param {buffer|string} iv Initialization vector.
   * @param {string=} algo Encryption algorithm (default: constants.cipher).
   * @return {buffer} Encrypted data.
   */
  encrypt: function (plaintext, key, iv, algo) {
    let cipher, ciphertext;
    algo = algo || this.constants.cipher;
    if (!this.isCipherAvailable(algo)) throw new Error(algo + " is not available");
    cipher = this.crypto.createCipheriv(algo, this.str2buf(key), this.str2buf(iv));
    ciphertext = cipher.update(this.str2buf(plaintext));
    return Buffer.concat([ciphertext, cipher.final()]);
  },

  /**
   * Symmetric private key decryption using secret (derived) key.
   * @param {buffer|string} ciphertext Data to be decrypted.
   * @param {buffer|string} key Secret key.
   * @param {buffer|string} iv Initialization vector.
   * @param {string=} algo Encryption algorithm (default: constants.cipher).
   * @return {buffer} Decrypted data.
   */
  decrypt: function (ciphertext, key, iv, algo) {
    let decipher, plaintext;
    algo = algo || this.constants.cipher;
    if (!this.isCipherAvailable(algo)) throw new Error(algo + " is not available");
    decipher = this.crypto.createDecipheriv(algo, this.str2buf(key), this.str2buf(iv));
    plaintext = decipher.update(this.str2buf(ciphertext));
    return Buffer.concat([plaintext, decipher.final()]);
  },


  privateKeyVerify: function (privateKey) {
    privateKey = privateKey.constructor === String && privateKey.indexOf('0x') === 0 ? privateKey.substr(2) : privateKey;
    privateKey = this.str2buf(privateKey);
    return secp256k1.privateKeyVerify(privateKey);
  },

  /**
   * Derive Ethereum address from private key.
   * @param {buffer|string} privateKey ECDSA private key.
   * @return {string} Hex-encoded Ethereum address.
   */
  privateKeyToAddress: function (privateKey) {
    privateKey = privateKey.constructor === String && privateKey.indexOf('0x') === 0 ? privateKey.substr(2) : privateKey;
    let privateKeyBuffer, publicKey;
    privateKeyBuffer = this.str2buf(privateKey);
    if (privateKeyBuffer.length < 32) {
      privateKeyBuffer = Buffer.concat([
        Buffer.alloc(32 - privateKeyBuffer.length, 0),
        privateKeyBuffer
      ]);
    }
    publicKey = secp256k1.publicKeyCreate(privateKeyBuffer, false).slice(1);
    return "0x" + keccak256(publicKey).slice(-20).toString("hex");
  },

  /**
   * Calculate message authentication code from secret (derived) key and
   * encrypted text.  The MAC is the keccak-256 hash of the byte array
   * formed by concatenating the second 16 bytes of the derived key with
   * the ciphertext key's contents.
   * @param {buffer|string} derivedKey Secret key derived from password.
   * @param {buffer|string} ciphertext Text encrypted with secret key.
   * @return {string} Hex-encoded MAC.
   */
  getMAC: function (derivedKey, ciphertext) {
    if (derivedKey !== undefined && derivedKey !== null && ciphertext !== undefined && ciphertext !== null) {
      return keccak256(Buffer.concat([
        this.str2buf(derivedKey).slice(16, 32),
        this.str2buf(ciphertext)
      ])).toString("hex");
    }
  },

  /**
   * Used internally.
   */
  deriveKeyUsingScrypt: function (password, salt, options, cb) {
    let self = this;

    if (!isFunction(cb)) {
      throw new Error("Callback is not a function");
    }

    let n = options.kdfparams.n || self.constants.scrypt.n;
    let r = options.kdfparams.r || self.constants.scrypt.r;
    let p = options.kdfparams.p || self.constants.scrypt.p;
    let dklen = options.kdfparams.dklen || self.constants.scrypt.dklen;

    DeriveKey.scrypt(password.toString('utf-8'), salt.toString('hex'), n, r, p, dklen).then((dk) => {
      cb(null, Buffer.from(dk, 'hex'));
    }).catch(e => {
      cb(e, null);
    });

  },

  /**
   * Derive secret key from password with key dervation function.
   * @param {string|buffer} password User-supplied password.
   * @param {string|buffer} salt Randomly generated salt.
   * @param {Object=} options Encryption parameters.
   * @param {string=} options.kdf Key derivation function (default: pbkdf2).
   * @param {string=} options.cipher Symmetric cipher (default: constants.cipher).
   * @param {Object=} options.kdfparams KDF parameters (default: constants.<kdf>).
   * @param {function=} cb Callback function (optional).
   * @return {buffer} Secret key derived from password.
   */
  deriveKey: function (password, salt, options, cb) {

    let prf, self = this;
    if (typeof password === "undefined" || password === null || !salt) {
      throw new Error("Must provide password and salt to derive a key");
    }
    options = options || {};
    options.kdfparams = options.kdfparams || {};

    // convert strings to buffers
    password = this.str2buf(password, "utf8");
    salt = this.str2buf(salt);

    // use scrypt as key derivation function
    if (options.kdf === "scrypt") {
      return this.deriveKeyUsingScrypt(password, salt, options, cb);
    }

    // use default key derivation function (PBKDF2)
    prf = options.kdfparams.prf || this.constants.pbkdf2.prf;
    if (prf === "hmac-sha256") prf = "sha256";

    if (!isFunction(cb)) {
      throw new Error("Callback is not a function");
    }

    DeriveKey.PBKDF2(password.toString('utf8'), salt.toString('hex'), options.kdfparams.c || this.constants.pbkdf2.c)
      .then((derivationKey) => {
        cb(null, Buffer.from(derivationKey, 'hex'));
      }).catch(e => {
      cb(e, null)
    });
  },

  /**
   * Generate random numbers for private key, initialization vector,
   * and salt (for key derivation).
   * @param {Object=} params Encryption options (defaults: constants).
   * @param {string=} params.keyBytes Private key size in bytes.
   * @param {string=} params.ivBytes Initialization vector size in bytes.
   * @param {function=} cb Callback function (optional).
   * @return {Object<string,buffer>} Private key, IV and salt.
   */
  create: function (params, cb) {
    let keyBytes, ivBytes, self = this;
    params = params || {};
    keyBytes = params.keyBytes || this.constants.keyBytes;
    ivBytes = params.ivBytes || this.constants.ivBytes;

    function checkBoundsAndCreateObject(randomBytes) {
      let privateKey = randomBytes.slice(0, keyBytes);
      if (!secp256k1.privateKeyVerify(privateKey)) return self.create(params, cb);

      return {
        privateKey: privateKey,
        iv: randomBytes.slice(keyBytes, keyBytes + ivBytes),
        salt: randomBytes.slice(keyBytes + ivBytes)
      };
    }

    // synchronous key generation if callback not provided
    if (!isFunction(cb)) {
      return checkBoundsAndCreateObject(this.crypto.randomBytes(keyBytes + ivBytes + keyBytes));
    }

    // asynchronous key generation
    //this.crypto.randomBytes(keyBytes + ivBytes + keyBytes, function (err, randomBytes) {
    randomBytes(keyBytes + ivBytes + keyBytes, function (err, randomBytes) {
      if (err) return cb(err);
      cb(checkBoundsAndCreateObject(randomBytes));
    });
  },

  /**
   * Assemble key data object in secret-storage format.
   * @param {buffer} derivedKey Password-derived secret key.
   * @param {buffer} privateKey Private key.
   * @param {buffer} salt Randomly generated salt.
   * @param {buffer} iv Initialization vector.
   * @param {Object=} options Encryption parameters.
   * @param {string=} options.kdf Key derivation function (default: pbkdf2).
   * @param {string=} options.cipher Symmetric cipher (default: constants.cipher).
   * @param {Object=} options.kdfparams KDF parameters (default: constants.<kdf>).
   * @return {Object}
   */
  marshal: function (derivedKey, privateKey, salt, iv, options) {
    let ciphertext, keyObject, algo;
    options = options || {};
    options.kdfparams = options.kdfparams || {};
    algo = options.cipher || this.constants.cipher;

    // encrypt using first 16 bytes of derived key
    ciphertext = this.encrypt(privateKey, derivedKey.slice(0, 16), iv, algo).toString("hex");

    keyObject = {
      address: options.network === 'ETH' ? this.privateKeyToAddress(privateKey).slice(2) : options.address,
      crypto: {
        cipher: options.cipher || this.constants.cipher,
        ciphertext: ciphertext,
        cipherparams: {iv: iv.toString("hex")},
        mac: this.getMAC(derivedKey, ciphertext)
      },
      id: uuid.v4(), // random 128-bit UUID
      version: 3
    };

    if (options.kdf === "scrypt") {
      keyObject.crypto.kdf = "scrypt";
      keyObject.crypto.kdfparams = {
        dklen: options.kdfparams.dklen || this.constants.scrypt.dklen,
        n: options.kdfparams.n || this.constants.scrypt.n,
        r: options.kdfparams.r || this.constants.scrypt.r,
        p: options.kdfparams.p || this.constants.scrypt.p,
        salt: salt.toString("hex")
      };

    } else {
      keyObject.crypto.kdf = "pbkdf2";
      keyObject.crypto.kdfparams = {
        c: options.kdfparams.c || this.constants.pbkdf2.c,
        dklen: options.kdfparams.dklen || this.constants.pbkdf2.dklen,
        prf: options.kdfparams.prf || this.constants.pbkdf2.prf,
        salt: salt.toString("hex")
      };
    }

    return keyObject;
  },

  /**
   * Export private key to keystore secret-storage format.
   * @param {string|buffer} password User-supplied password.
   * @param {string|buffer} privateKey Private key.
   * @param {string|buffer} salt Randomly generated salt.
   * @param {string|buffer} iv Initialization vector.
   * @param {Object=} options Encryption parameters.
   * @param {string=} options.kdf Key derivation function (default: pbkdf2).
   * @param {string=} options.cipher Symmetric cipher (default: constants.cipher).
   * @param {Object=} options.kdfparams KDF parameters (default: constants.<kdf>).
   * @param {function=} cb Callback function (optional).
   * @return {Object}
   */
  dump: function (password, privateKey, salt, iv, options, cb) {

    options = options || {};
    iv = this.str2buf(iv);
    privateKey = privateKey.constructor === String && privateKey.indexOf('0x') === 0 ? privateKey.substr(2) : privateKey;
    privateKey = this.str2buf(privateKey);

    // synchronous if no callback provided
    if (!isFunction(cb)) {
      return this.marshal(this.deriveKey(password, salt, options), privateKey, salt, iv, options);
    }

    // asynchronous if callback provided
    this.deriveKey(password, salt, options, function (err, derivedKey) {
      cb(err, this.marshal(derivedKey, privateKey, salt, iv, options));
    }.bind(this));
  },

  /**
   * Recover plaintext private key from secret-storage key object.
   * @param {Object} keyObject Keystore object.
   * @param {function=} cb Callback function (optional).
   * @return {buffer} Plaintext private key.
   */
  recover: function (password, keyObject, cb) {

    let keyObjectCrypto, iv, salt, ciphertext, algo, self = this;
    keyObjectCrypto = keyObject.Crypto || keyObject.crypto;

    // verify that message authentication codes match, then decrypt
    function verifyAndDecrypt(derivedKey, salt, iv, ciphertext, algo) {
      let key;
      if (self.getMAC(derivedKey, ciphertext) !== keyObjectCrypto.mac) {
        throw new Error("message authentication code mismatch");
      }
      if (keyObject.version === "1") {
        key = keccak256(derivedKey.slice(0, 16)).slice(0, 16);
      } else {
        key = derivedKey.slice(0, 16);
      }
      return self.decrypt(ciphertext, key, iv, algo);
    }

    iv = this.str2buf(keyObjectCrypto.cipherparams.iv);
    salt = this.str2buf(keyObjectCrypto.kdfparams.salt);
    ciphertext = this.str2buf(keyObjectCrypto.ciphertext);
    algo = keyObjectCrypto.cipher;

    if (keyObjectCrypto.kdf === "pbkdf2" && keyObjectCrypto.kdfparams.prf !== "hmac-sha256") {
      throw new Error("PBKDF2 only supported with HMAC-SHA256");
    }

    // derive secret key from password
    if (!isFunction(cb)) {
      return verifyAndDecrypt(this.deriveKey(password, salt, keyObjectCrypto), salt, iv, ciphertext, algo);
    }
    this.deriveKey(password, salt, keyObjectCrypto, function (err, derivedKey) {
      try {
        cb(null, verifyAndDecrypt(derivedKey, salt, iv, ciphertext, algo));
      } catch (exc) {
        cb(err || exc, null);
      }
    });
  }
};