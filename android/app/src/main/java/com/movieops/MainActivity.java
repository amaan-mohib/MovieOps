package com.movieops;
import android.content.Intent;
import android.os.Bundle;
import android.net.Uri;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MovieOps";
  }
  // @Override
  //   protected ReactActivityDelegate createReactActivityDelegate() {
  //       return new ReactActivityDelegate(this, getMainComponentName()) {
  //           @Override
  //           protected Bundle getLaunchOptions() {
  //               Intent intent = MainActivity.this.getIntent();
  //               Bundle bundle = new Bundle();
  //               bundle.putString("url", intent.getStringExtra(Intent.EXTRA_TEXT));
  //               return bundle;
  //           }
  //       };
  //   }
  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
}
