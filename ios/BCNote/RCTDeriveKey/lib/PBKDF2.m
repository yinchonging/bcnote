#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonKeyDerivation.h>

#import "PBKDF2.h"

#import "NSData+Conversion.h"
#import "NSString+Conversion.h"

@implementation PBKDF2

+ (NSString *) derivationKey:(NSString *)password salt: (NSString *)salt iterations: (nonnull int *)iterations {
  
  NSData *passwordData = [password dataUsingEncoding:NSUTF8StringEncoding];
  NSData *saltHexData = [salt stringToHexData];
  
  // Hash key (hexa decimal) string data length.
  NSMutableData *hashKeyData = [NSMutableData dataWithLength:CC_SHA256_DIGEST_LENGTH];
  
  // Key Derivation using PBKDF2 algorithm.
  int status = CCKeyDerivationPBKDF(
                                    kCCPBKDF2,
                                    passwordData.bytes,
                                    passwordData.length,
                                    saltHexData.bytes,
                                    saltHexData.length,
                                    kCCPRFHmacAlgSHA256,
                                    iterations,
                                    hashKeyData.mutableBytes,
                                    hashKeyData.length);
  
  if (status == kCCParamError) {
    NSLog(@"Key derivation error");
    return @"";
  }
  
  return [hashKeyData hexadecimalString];
}

@end
