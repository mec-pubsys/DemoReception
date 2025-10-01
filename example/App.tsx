import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Login } from "./src/screens/login/Login";
import { CheckIn } from "./src/screens/check-in/CheckIn";
import CheckInConfirmation from "./src/screens/check-in-confirmation/CheckInConfirmation";
import { CheckInEdit } from "./src/screens/check-in-edit/CheckInEdit";
import Completion from "./src/screens/completion/Completion";
import { EventDetail } from "./src/screens/event-detail/EventDetail";
import { EventList } from "./src/screens/event-list/EventList";
import GroupCheckInConfirmation from "./src/screens/group-check-in-confirmation/GroupCheckInConfirmation";
import GroupCheckInEdit from "./src/screens/group-check-in-edit/GroupCheckInEdit";
import { Logout } from "./src/screens/logout/Logout";
import { PreReceptionVerification } from "./src/screens/pre-reception-verification/PreReceptionVerification";
import { PravicyConsent } from "./src/screens/privacy-consent/PrivacyConsent";
import { SelectReceptionMethod } from "./src/screens/select-reception-method/SelectReceptionMethod";
import { SelfqrScanner } from "./src/screens/selfqr-scanner/SelfqrScanner";
import { SelfqrDescription } from "./src/screens/serlfqr-description/SelfqrDescription";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { userAuth } from "./src/config/firebaseConfig";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";

const Stack = createNativeStackNavigator();
export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        SpaceMono: require("./src/assets/fonts/SpaceMono-Regular.ttf"),
        HiraginoKaku_GothicPro_Text: require("./src/assets/fonts/Hiragino-Kaku-Gothic-Pro-W3.otf"),
        HiraginoKaku_GothicPro_Text_Bold: require("./src/assets/fonts/Hiragino-Kaku-Gothic-Pro-W6.ttf"),
      });

      setFontLoaded(true);
    };
    loadFonts();

    signInWithEmailAndPassword(
      userAuth,
      "city-staff-base@matsusaka.co.jp",
      "Pg37gRm20b58z3D5"
    ).catch((error) => {
      console.log("Auto sign-in failed:", error);
    });

    const unsubscribeAuthState = onAuthStateChanged(userAuth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribeAuthState;
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="EventList" component={EventList} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="CheckIn" component={CheckIn} />
        <Stack.Screen name="CheckInConfirmation" component={CheckInConfirmation} />
        <Stack.Screen name="CheckInEdit" component={CheckInEdit} />
        <Stack.Screen name="Completion" component={Completion} />
        <Stack.Screen name="GroupCheckInConfirmation" component={GroupCheckInConfirmation} />
        <Stack.Screen name="GroupCheckInEdit" component={GroupCheckInEdit} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="PreReceptionVerification" component={PreReceptionVerification} />
        <Stack.Screen name="PravicyConsent" component={PravicyConsent} />
        <Stack.Screen name="SelectReceptionMethod" component={SelectReceptionMethod} />
        <Stack.Screen name="SelfqrScanner" component={SelfqrScanner} />
        <Stack.Screen name="SelfqrDescription" component={SelfqrDescription} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

serviceWorkerRegistration.register();
