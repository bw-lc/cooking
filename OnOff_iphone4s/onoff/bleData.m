
#import "bleData.h"
#import <CoreBluetooth/CoreBluetooth.h>
#import <string.h>
#import <stdlib.h>
#import <CommonCrypto/CommonCryptor.h>


@interface bleData() <CBPeripheralManagerDelegate>
@property (strong, nonatomic) CBPeripheralManager * peripheralManager;
@property (strong, nonatomic) CBUUID * sid_l;
@property (strong, nonatomic) CBUUID * sid_h;

@property unsigned long ul_sid;
@property unsigned long ul_open_cum;
@property unsigned char * uc_password;


- (void)load;
- (void)open_sum_add;

@end

@implementation bleData

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral
{
}

- (id)init
{
    id rt = [super init];
    
    self.peripheralManager = [[CBPeripheralManager alloc] initWithDelegate : self queue : nil];
    self.uc_password = malloc(16);
    [self load];
    
    return rt;
}

- (void)load
{
    NSArray * paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES);
    NSString * documentDirectory = [paths objectAtIndex : 0];
    NSFileManager *fm = [NSFileManager defaultManager];
    
    NSString * fileSid = [documentDirectory  stringByAppendingPathComponent : @"sid.txt"];
    if([fm fileExistsAtPath : fileSid] == NO)
    {
        self.sid_l = [CBUUID UUIDWithString : [NSString stringWithFormat : @"0000"]];
        self.sid_h = [CBUUID UUIDWithString : [NSString stringWithFormat : @"0000"]];
        self.ul_sid = 0;
    } else {
        NSData * sid_data = [ NSData dataWithContentsOfFile : fileSid];
        unsigned long ul_sid;
        [sid_data getBytes : &ul_sid length : sizeof(ul_sid)];
        self.sid_l = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%04x", (unsigned int)(ul_sid % 0x10000)]];
        self.sid_h = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%04x", (unsigned int)((ul_sid / 0x10000) % 0x10000)]];
        self.ul_sid = ul_sid;
    }
    
    NSString * filePassword = [documentDirectory  stringByAppendingPathComponent : @"password.txt"];
    if([fm fileExistsAtPath : filePassword] == NO)
    {
        memset(self.uc_password, 0, 16);
    } else {
        NSData * password_data = [ NSData dataWithContentsOfFile : filePassword];
        [password_data getBytes : self.uc_password length : 16];
    }

    NSString * fileOpenCum = [documentDirectory  stringByAppendingPathComponent : @"open_cum.txt"];
    if([fm fileExistsAtPath : fileOpenCum] == NO)
    {
        self.ul_open_cum = arc4random() % 0x1000000;
    } else {
        NSData * cum_data = [ NSData dataWithContentsOfFile : fileOpenCum];
        unsigned long ul_open_cum;
        [cum_data getBytes : &(ul_open_cum) length : sizeof(ul_open_cum)];
        self.ul_open_cum = ul_open_cum;
    }
    
    //self.ul_open_cum = 0x11223344;
}

- (void)set_sid : (unsigned long) ul_sid
{
    NSData * sid_data = [NSData dataWithBytes : &ul_sid length : sizeof(ul_sid)];
    
    NSArray * paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES);
    NSString * documentDirectory = [paths objectAtIndex : 0];
    NSString * fileSid = [documentDirectory  stringByAppendingPathComponent : @"sid.txt"];
    
    
    [sid_data writeToFile : fileSid atomically : YES];
    
    
    [self load];
}

- (void)set_password : (unsigned char *) uc_password
{
    NSData * password_data = [NSData dataWithBytes : uc_password length : 16];
    
    NSArray * paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES);
    NSString * documentDirectory = [paths objectAtIndex : 0];
    NSString * filePassword = [documentDirectory  stringByAppendingPathComponent : @"password.txt"];
    
    [password_data writeToFile : filePassword atomically : YES];
    
    [self load];

}

- (void)open_sum_add
{
    self.ul_open_cum++;
    unsigned long ul_open_cum = self.ul_open_cum;
    NSData * sum_data = [NSData dataWithBytes : &(ul_open_cum) length : sizeof(ul_open_cum)];

    NSArray * paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES);
    NSString * documentDirectory = [paths objectAtIndex : 0];
    NSString * fileOpenCum = [documentDirectory  stringByAppendingPathComponent : @"open_cum.txt"];

    [sum_data writeToFile : fileOpenCum atomically : YES];
    
    [self load];
}

- (void)send_info
{
    CBUUID * c1 = [CBUUID UUIDWithString:@"0033"];


    unsigned char buf[4];
    buf[0] = self.ul_open_cum % 0x100;
    buf[1] = (self.ul_open_cum / 0x100) % 0x100;
    buf[2] = (self.ul_open_cum / 0x10000) % 0x100;
    buf[3] = (self.ul_open_cum / 0x1000000) % 0x100;
    CBUUID * c4 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf[1], buf[0]]];
    CBUUID * c5 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf[3], buf[2]]];
    
    CBUUID * c6 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[1], (unsigned int)self.uc_password[0]]];
    CBUUID * c7 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[3], (unsigned int)self.uc_password[2]]];
    CBUUID * c8 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[5], (unsigned int)self.uc_password[4]]];
    CBUUID * c9 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[7], (unsigned int)self.uc_password[6]]];
    CBUUID * ca = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[9], (unsigned int)self.uc_password[8]]];
    CBUUID * cb = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[11], (unsigned int)self.uc_password[10]]];
    CBUUID * cc = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[13], (unsigned int)self.uc_password[12]]];
    CBUUID * cd = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[15], (unsigned int)self.uc_password[14]]];
    NSDictionary * a = @{CBAdvertisementDataServiceUUIDsKey : @[c1, self.sid_l, self.sid_h, c4, c5, c6, c7, c8, c9, ca, cb, cc, cd]};
    
    [self.peripheralManager startAdvertising: a];
    
}

- (void)send_info2 : (unsigned long) ul_key
{
    unsigned char buf[4];
    buf[0] = 0x33;
    buf[1] = ul_key;

    CBUUID * c1 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf[1], buf[0]]];
    
    buf[0] = self.ul_open_cum % 0x100;
    buf[1] = (self.ul_open_cum / 0x100) % 0x100;
    buf[2] = (self.ul_open_cum / 0x10000) % 0x100;
    buf[3] = (self.ul_open_cum / 0x1000000) % 0x100;
    CBUUID * c4 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf[1], buf[0]]];
    CBUUID * c5 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf[3], buf[2]]];
    
    CBUUID * c6 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[1], (unsigned int)self.uc_password[0]]];
    CBUUID * c7 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[3], (unsigned int)self.uc_password[2]]];
    CBUUID * c8 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[5], (unsigned int)self.uc_password[4]]];
    CBUUID * c9 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[7], (unsigned int)self.uc_password[6]]];
    CBUUID * ca = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[9], (unsigned int)self.uc_password[8]]];
    CBUUID * cb = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[11], (unsigned int)self.uc_password[10]]];
    CBUUID * cc = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[13], (unsigned int)self.uc_password[12]]];
    CBUUID * cd = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned int)self.uc_password[15], (unsigned int)self.uc_password[14]]];
    NSDictionary * a = @{CBAdvertisementDataServiceUUIDsKey : @[c1, self.sid_l, self.sid_h, c4, c5, c6, c7, c8, c9, ca, cb, cc, cd]};
    
    [self.peripheralManager startAdvertising: a];
    
}

- (void)send_keys : (unsigned long) ul_keys
{
    extern void aes_encrypt(unsigned char pt[16], unsigned char ct[16], const unsigned char cipherKey[]);
    
    [self open_sum_add];
    
    CBUUID * c1 = [CBUUID UUIDWithString : @"0032"];
    CBUUID * c2 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", (unsigned char)((ul_keys / 0x100) % 0x100), (unsigned char)(ul_keys % 0x100)]];
    
    unsigned char buf[16];// = {0x32, 0x00, 0x01, 0x00};
    buf[0] = 0x32;
    buf[1] = 0x00;
    buf[2] = (ul_keys % 0x100);
    buf[3] = ((ul_keys / 0x100) % 0x100);
    buf[4] = self.ul_sid % 0x100;
    buf[5] = (self.ul_sid / 0x100) % 0x100;
    buf[6] = (self.ul_sid / 0x10000) % 0x100;
    buf[7] = (self.ul_sid / 0x1000000) % 0x100;
    buf[8] = self.ul_open_cum % 0x100;
    buf[9] = (self.ul_open_cum / 0x100) % 0x100;
    buf[10] = (self.ul_open_cum / 0x10000) % 0x100;
    buf[11] = (self.ul_open_cum / 0x1000000) % 0x100;
    buf[12] =  arc4random() % 0x100;
    buf[13] =  arc4random() % 0x100;
    buf[14] =  arc4random() % 0x100;
    buf[15] =  arc4random() % 0x100;
    
    unsigned char buf2[16 + kCCBlockSizeAES128];
    
    //aes_encrypt(buf, buf, self.uc_password);
    //memcpy(buf2, buf, 16);
    
    //char ivPtr[kCCBlockSizeAES128 + 1];
    //memset(ivPtr, 0, sizeof(ivPtr));
    size_t numBytesCrypted = 0;
    CCCryptorStatus cryptStatus =  CCCrypt(kCCEncrypt,
                                           kCCAlgorithmAES128,
                                           kCCOptionPKCS7Padding | kCCOptionECBMode,//kCCOptionPKCS7Padding
                                           self.uc_password,
                                           kCCKeySizeAES128,
                                           NULL,//ivPtr,//NULL
                                           buf,//input
                                           16,
                                           buf2,
                                           16 + kCCBlockSizeAES128,
                                           &numBytesCrypted);
    
    if (cryptStatus != kCCSuccess) {
        NSLog(@"%d", cryptStatus);
    }
    
    
    
    CBUUID * c4 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[1], buf2[0]]];
    CBUUID * c5 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[3], buf2[2]]];
    CBUUID * c6 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[5], buf2[4]]];
    CBUUID * c7 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[7], buf2[6]]];
    CBUUID * c8 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[9], buf2[8]]];
    CBUUID * c9 = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[11], buf2[10]]];
    CBUUID * ca = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[13], buf2[12]]];
    CBUUID * cb = [CBUUID UUIDWithString : [NSString stringWithFormat : @"%02x%02x", buf2[15], buf2[14]]];
    
    
    NSDictionary * a = @{CBAdvertisementDataServiceUUIDsKey : @[c1, c2, self.sid_l, self.sid_h, c4, c5, c6, c7, c8, c9, ca, cb]};
    
    [self.peripheralManager startAdvertising: a];
}


- (void)stop_send
{
    [self.peripheralManager stopAdvertising];
}

@end
