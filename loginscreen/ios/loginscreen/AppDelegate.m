#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <KakaoOpenSDK/KakaoOpenSDK.h>
#import "RNSplashScreen.h" // here

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

// kakao login
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
     if ([KOSession isKakaoAccountLoginCallback:url]) {
         return [KOSession handleOpenURL:url];
     }
     return false;
 }
//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options: (NSDictionary<NSString *,id> *) options {
//     if ([KOSession isKakaoAccountLoginCallback:url]) {
//       return [KOSession handleOpenURL:url];
//     }
//
//     return false;
// }

 - (void)applicationDidBecomeActive:(UIApplication *)application {
     [KOSession handleDidBecomeActive];
 }


// linking
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url  options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *) options {
  if ([KOSession isKakaoAccountLoginCallback:url]) {
    return [KOSession handleOpenURL:url];
  }// kakao login
  
  return [RCTLinkingManager application:app openURL:url options:options];
  
}


// font check
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  for (NSString * familyNames in [UIFont familyNames])
  {
      NSLog(@"----------------------------------------------");
      NSLog(@"FamilyName : %@", familyNames);
      
      for (NSString * fontNames in [UIFont fontNamesForFamilyName:familyNames])
      {
          NSLog(@"Fontname : %@", fontNames);
          //UIFont * font = [UIFont fontWithName:fontNames size:20.0];
      }
      NSLog(@"---------------------------------------------\n");
  }


#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"loginscreen"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [RNSplashScreen show]; // here
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
