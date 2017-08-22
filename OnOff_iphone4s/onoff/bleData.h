
#import <Foundation/Foundation.h>

@interface bleData : NSObject
- (void)set_sid : (unsigned long) ul_sid;
- (void)set_password : (unsigned char *) uc_password;

- (void)send_info;

- (void)send_info2 : (unsigned long) ul_key;

- (void)send_keys : (unsigned long) ul_keys;

- (void)stop_send;


@end
