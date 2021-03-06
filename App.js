import React from "react";
import {
  Platform,
  StyleSheet,
  StatusBar,
  View
} from "react-native";
import { createDrawerNavigator } from "react-navigation";
import SplashScreen from "react-native-splash-screen";
import { StorageObj } from "./src/classes/Storage";
import analytics from '@react-native-firebase/analytics';

import { NavigationActions } from "react-navigation";
import AppNavigator from "./src/navigation/AppNavigator";
import Colors from "./src/constants/Colors";
import SettingsComponent from "./src/components/SettingsComponent";
import IllustrationScreen from "./src/screens/IllustrationScreen";
import { logEvent, EVENTS } from "./src/classes/Events";

const SettingsDrawer = createDrawerNavigator(
  {
    AppNavigator: {
      screen: AppNavigator
    }
  },
  {
    drawerWidth: 310,
    drawerPosition: Platform.OS === "android" ? "right" : "left",
    contentComponent: SettingsComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

export default class App extends React.Component {
  navigatorRef;
  state = {
    isLoadingComplete: false
  };
  constructor() {
    super();
    // AutoSoundsSaver.getInstance(); check if causes a problem
  }
  componentDidMount() {
    const result = { value: "null" };
    StorageObj.getItem("alreadyLaunched", result).then(res => {
      if (result.value == null) {
        StorageObj.setItem("alreadyLaunched", true); // No need to wait for `setItem` to finish, although you might want to handle errors
        this.setState({ firstLaunch: true });
        logEvent(EVENTS.FIRST_LAUNCH);
      } else {
        this.setState({ firstLaunch: false });
      }
    }); // Add some error handling, also you can simply do this.setState({fistLaunch: value == null})
  }

  // gets the current screen from navigation state
  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }
  render() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          {this.state.firstLaunch && (
            <IllustrationScreen
              onBackClicked={() => {
                this.setState({ firstLaunch: false });
                logEvent(EVENTS.SKIP_TOUR);
              }}
            />
          )}
          <SettingsDrawer
            ref={navigatorRef => {
              this.navigatorRef = navigatorRef;
            }}
            onNavigationStateChange={(prevState, currentState, action) => {
              const routeName = this.getActiveRouteName(currentState);
              analytics().setCurrentScreen(routeName);
              if (routeName == "Alert") {
                this.navigatorRef.dispatch(
                  NavigationActions.navigate({
                    routeName: this.getActiveRouteName(prevState)
                  })
                );
              }
            }}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground
  }
});
