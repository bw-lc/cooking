//
//  settngsViewController.m
//  onoff
//
//  Created by 陈明计 on 14-6-21.
//  Copyright (c) 2014年 陈明计. All rights reserved.
//

#import "settngsViewController.h"
#include <stdlib.h>

@interface settngsViewController ()
@property (strong, nonatomic) bleData * MyOnOff;

@end

@implementation settngsViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    //NSLog(@"viewDidLoad");
    
    //MyOnOff = [[bleData alloc] init];
    //self.MyOnOff = NULL;
   
    
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)setOnOff:(bleData *)data;
{
    //NSLog(@"setOnOff");
    self.MyOnOff = data;
}

- (IBAction)close:(id)sender
{
    [self.presentingViewController dismissViewControllerAnimated : YES completion : nil];
}

- (IBAction)info_send:(id)sender
{
    [self.MyOnOff send_info2 : 0x0001];

}

- (IBAction)info_stop_send:(id)sender
{
    [self.MyOnOff stop_send];
}

- (IBAction)new_sid:(id)sender
{
    unsigned long ui_sid = (unsigned int)lroundf([NSDate timeIntervalSinceReferenceDate]);
    
    [self.MyOnOff set_sid : ui_sid];
}

- (IBAction)new_password:(id)sender
{
    unsigned char uc_password[16];
    int i;
    
    for (i = 0; i < 16; i++)
    {
        uc_password[i] = arc4random() % 0x100;
        //uc_password[i] = i;
   
    }
    
    [self.MyOnOff set_password : uc_password];
    
}

- (IBAction)begin_info_send2:(id)sender {
    [self.MyOnOff send_info2 : 0x0003];
}

- (IBAction)end_info_send2:(id)sender {
    [self.MyOnOff stop_send];
}

- (IBAction)begin_info_send3:(id)sender {
    [self.MyOnOff send_info2 : 0x0009];
}

- (IBAction)end_info_send3:(id)sender {
    [self.MyOnOff stop_send];
}

- (IBAction)begin_info_send4:(id)sender {
    [self.MyOnOff send_info2 : 0x0005];
}

- (IBAction)end_info_send4:(id)sender {
    [self.MyOnOff stop_send];
}

- (IBAction)begin_clean:(id)sender {
    [self.MyOnOff send_keys : 0xff00];
}

- (IBAction)end_clean:(id)sender {
    [self.MyOnOff stop_send];
}

@end
