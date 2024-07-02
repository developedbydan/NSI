import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Octicons,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as Screens from "./screens";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  headerShown: false,
  unmountOnBlur: true,
  tabBarStyle: {
    backgroundColor: "#000000",
    borderColor: "#000000",
    height: 60,
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
};

// Ekrani kada je korisnik prijavljen
const InsideLayout = () => {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Details"
        component={Screens.Details}
        options={{ headerShown: false }}
      />
    </InsideStack.Navigator>
  );
};

// Donja navigacija
const HomeStack = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Screens.Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Octicons
              name="home"
              size={25}
              color={focused ? "#E95353" : "#676D75"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Groceries"
        component={Screens.Groceries}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="list"
              size={28}
              color={focused ? "#E95353" : "#676D75"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={Screens.Favorite}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="favorite-outline"
              size={27}
              color={focused ? "#E95353" : "#676D75"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Screens.Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={28}
              color={focused ? "#E95353" : "#676D75"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={Screens.Welcome}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Login"
              component={Screens.Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={Screens.Signup}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
