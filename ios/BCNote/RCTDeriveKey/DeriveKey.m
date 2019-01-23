#import "DeriveKey.h"
#import "PBKDF2.h"

#import "libscrypt.h"
#include <stdbool.h>
#include <stdint.h>

#import "NSData+Conversion.h"
#import "NSString+Conversion.h"

@implementation DeriveKey

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(PBKDF2:(NSString *)password salt:(NSString *)salt iterations:(nonnull int *)iterations
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSError *error = nil;
    NSString *data = [PBKDF2 derivationKey:password salt:salt iterations: iterations];
    if (data == nil) {
        reject(@"keygen_fail", @"Key generation failed", error);
    } else {
        resolve(data);
    }
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(scrypt:(NSString *)passwd
                  salt:(NSString *)salt
                 N:(NSUInteger)N
                 r:(NSUInteger)r
                 p:(NSUInteger)p
                 dkLen:(NSUInteger)dkLen
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSData *passwordData = [passwd dataUsingEncoding:NSUTF8StringEncoding];
  NSData *saltHexData = [salt stringToHexData];

  int success;
  uint8_t hashbuf[dkLen];
  @try {
    success = libscrypt_scrypt(passwordData.bytes, passwordData.length, saltHexData.bytes, saltHexData.length, N, r, p, hashbuf, dkLen);
  }
  @catch (NSException * e) {
    NSError *error = [NSError errorWithDomain:@"com.crypho.scrypt" code:200 userInfo:@{@"Error reason": @"Error in scrypt"}];
    reject(@"Failure in scrypt", @"Error", error);
    return;
  }
  
    NSData *data = [NSData dataWithBytes:hashbuf length:dkLen];
    NSString *result = [data hexadecimalString];
    resolve(result);
}
@end
