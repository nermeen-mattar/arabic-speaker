package com.ttsarabic.app.ttsaarabicapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.kevinresol.react_native_sound_recorder.RNSoundRecorderPackage;
import com.soundapp.SoundModulePackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.dooboolab.RNAudioRecorderPlayerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.i18nmanager.I18nUtil;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSharePackage(),
            new RNFetchBlobPackage(),
            new SplashScreenReactPackage(),
            new VectorIconsPackage(),
            new TextToSpeechPackage(),
            new RNSoundRecorderPackage(),
            new SoundModulePackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNAudioRecorderPlayerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
  I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(this, true);    
    sharedI18nUtilInstance.forceRTL(this, true);
    SoLoader.init(this, /* native exopackage */ false);
  }
}