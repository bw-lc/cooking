//
//  ViewController.m
//  onoff
//
//  Created by 陈明计 on 14-6-21.
//  Copyright (c) 2014年 陈明计. All rights reserved.
//

#import "ViewController.h"
#import "settngsViewController.h"
#import "bleData.h"

@interface ViewController ()
@property (strong, nonatomic) bleData * MyOnOff;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    self.MyOnOff = [[bleData alloc] init];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (IBAction)settings:(id)sender
{
    settngsViewController *controller = [[settngsViewController alloc] initWithNibName : @"settngsViewController" bundle : nil];
    controller.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
    [self presentViewController : controller animated : YES completion : nil];
    //NSLog(@"settings");
    [controller setOnOff : self.MyOnOff];
}

- (IBAction)begin_open:(id)sender
{
    [self.MyOnOff send_keys :0x0001];
}

- (IBAction)begin_close:(id)sender
{
    [self.MyOnOff send_keys : 0x0002];
}

- (IBAction)end_close:(id)sender
{
    [self.MyOnOff stop_send];
}


- (IBAction)end_open:(id)sender
{
    [self.MyOnOff stop_send];
}


- (IBAction)begin_close2:(id)sender
{
    [self.MyOnOff send_keys : 0x0003];
}

- (IBAction)end_close2:(id)sender
{
    [self.MyOnOff stop_send];
}

- (IBAction)begin_open2:(id)sender
{
    [self.MyOnOff send_keys : 0x0004];
}

- (IBAction)end_open2:(id)sender
{
    [self.MyOnOff stop_send];
}


- (IBAction)begin_close3:(id)sender {
    [self.MyOnOff send_keys : 0x0009];
}

- (IBAction)end_close3:(id)sender {
    [self.MyOnOff stop_send];
}

- (IBAction)begin_open3:(id)sender {
    [self.MyOnOff send_keys : 0x000a];
}

- (IBAction)end_open3:(id)sender {
    [self.MyOnOff stop_send];
}

- (IBAction)begin_close4:(id)sender {
    [self.MyOnOff send_keys : 0x0005];
}

- (IBAction)end_close4:(id)sender {
    [self.MyOnOff stop_send];
}

- (IBAction)begin_open4:(id)sender {
    [self.MyOnOff send_keys : 0x0006];
}

- (IBAction)end_open4:(id)sender {
    [self.MyOnOff stop_send];
}


@end
