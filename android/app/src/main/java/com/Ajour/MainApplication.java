// package com.Ajour;

// import android.app.Application;
// import android.content.Context;
// import com.facebook.react.PackageList;
// import com.facebook.react.ReactApplication;
// import com.facebook.react.ReactInstanceManager;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.config.ReactFeatureFlags;
// import com.facebook.soloader.SoLoader;
// import com.Ajour.newarchitecture.MainApplicationReactNativeHost;
// import java.lang.reflect.InvocationTargetException;
// import java.util.List;
// import com.facebook.react.modules.i18nmanager.I18nUtil;
// import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// import com.facebook.react.bridge.JSIModulePackage;
// import com.facebook.react.defaults.DefaultJSIModulePackage; // Add this import



// public class MainApplication extends Application implements ReactApplication {

//   private final ReactNativeHost mReactNativeHost =
//       new ReactNativeHost(this) {
//         @Override
//         public boolean getUseDeveloperSupport() {
//           return BuildConfig.DEBUG;
//         }

//         @Override
//         protected List<ReactPackage> getPackages() {
//           @SuppressWarnings("UnnecessaryLocalVariable")
//           List<ReactPackage> packages = new PackageList(this).getPackages();
//           // Packages that cannot be autolinked yet can be added manually here
//           packages.add(new me.pushy.sdk.react.PushyPackage());
//           return packages;
//         }

//         @Override
//         protected String getJSMainModuleName() {
//           return "index";
//         }

//         // 👇 Add this method for Reanimated 2.x support
//         // @Override
//         // protected JSIModulePackage getJSIModulePackage() {
//         //   return new DefaultJSIModulePackage();
//         // }

       
//       };

//   private final ReactNativeHost mNewArchitectureNativeHost =
//       new MainApplicationReactNativeHost(this);

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//       return mNewArchitectureNativeHost;
//     } else {
//       return mReactNativeHost;
//     }
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     // FORCE LTR
//     I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
//     sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);
    
//     // If you opted-in for the New Architecture, we enable the TurboModule system
//     ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
//     SoLoader.init(this, /* native exopackage */ false);
//     initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
//   }

//   /**
//    * Loads Flipper in React Native templates. Call this in the onCreate method with something like
//    * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
//    */
//   private static void initializeFlipper(
//       Context context, ReactInstanceManager reactInstanceManager) {
//     if (BuildConfig.DEBUG) {
//       try {
//         Class<?> aClass = Class.forName("com.Ajour.ReactNativeFlipper");
//         aClass
//             .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
//             .invoke(null, context, reactInstanceManager);
//       } catch (ClassNotFoundException e) {
//         e.printStackTrace();
//       } catch (NoSuchMethodException e) {
//         e.printStackTrace();
//       } catch (IllegalAccessException e) {
//         e.printStackTrace();
//       } catch (InvocationTargetException e) {
//         e.printStackTrace();
//       }
//     }
//   }
// }


package com.Ajour;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.Ajour.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.facebook.react.modules.i18nmanager.I18nUtil;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here
          packages.add(new me.pushy.sdk.react.PushyPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // FORCE LTR
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);
    
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        Class<?> aClass = Class.forName("com.Ajour.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}