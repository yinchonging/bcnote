package derivekey;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReactMethod;

import org.spongycastle.crypto.digests.SHA256Digest;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.params.KeyParameter;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

public class DeriveKey extends ReactContextBaseJavaModule {

    static {
        System.loadLibrary("scrypt_jni");
    }

    public native byte[] scryptBridgeJNI(byte[] pass, byte[] salt, Integer N, Integer r, Integer p, Integer dkLen);

    private static final Integer SHA256_DIGEST_LENGTH = 256;
    private static final char[] HEX = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    private final ReactApplicationContext reactContext;

    public DeriveKey(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

    public static String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = HEX[v >>> 4];
            hexChars[j * 2 + 1] = HEX[v & 0x0F];
        }
        return new String(hexChars);
    }

    private static String pbkdf2(String pwd, String salt, Integer cost, Integer length)
            throws NoSuchAlgorithmException, InvalidKeySpecException, UnsupportedEncodingException {
        PKCS5S2ParametersGenerator gen = new PKCS5S2ParametersGenerator(new SHA256Digest());
        gen.init(pwd.getBytes("UTF-8"), hexStringToByteArray(salt), cost);
        byte[] key = ((KeyParameter) gen.generateDerivedParameters(length)).getKey();
        return bytesToHex(key);
    }

    @Override
    public String getName() {
        return "DeriveKey";
    }

    @ReactMethod
    public void PBKDF2(String pwd, String salt, Integer iterations, Promise promise) {
        try {
            String strs = pbkdf2(pwd, salt, iterations, SHA256_DIGEST_LENGTH);
            promise.resolve(strs);
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    //scrypt

    @ReactMethod
    public void scrypt(
            String passwd,
            String salt,
            Integer N,
            Integer r,
            Integer p,
            Integer dkLen,
            Promise promise) {

        try {
            final byte[] passwordBytes = passwd.getBytes("UTF-8");
            byte[] res = scryptBridgeJNI(passwordBytes, hexStringToByteArray(salt), N, r, p, dkLen);
            String result = bytesToHex(res);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("Failure in scrypt", e);
        }
    }
}