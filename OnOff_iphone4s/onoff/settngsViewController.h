//
//  settngsViewController.h
//  onoff
//
//  Created by 陈明计 on 14-6-21.
//  Copyright (c) 2014年 陈明计. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "bleData.h"

@interface settngsViewController : UIViewController
- (void)setOnOff:(bleData *)data;
- (IBAction)close:(id)sender;
- (IBAction)info_send:(id)sender;
- (IBAction)info_stop_send:(id)sender;
- (IBAction)new_sid:(id)sender;
- (IBAction)new_password:(id)sender;

@end
