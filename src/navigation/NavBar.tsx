import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationContext } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  "New Story": undefined;
  "Story Rooms": undefined;
  Profile: undefined;
  "Chat List": undefined;
  Chats: undefined;
};

type NavBarProps = {
  currentTab?: keyof RootStackParamList;
};

const tabConfig: Array<{ route: keyof RootStackParamList; label: string }> = [
  { route: "Home", label: "Home" },
  { route: "Search", label: "Search" },
  { route: "New Story", label: "New Story" },
  { route: "Chat List", label: "Story Rooms" },
  { route: "Profile", label: "Profile" },
  // { route: "Chats", label: "Chats" },
  //{ route: "Story Rooms", label: "Story Rooms" },
];

const NavBar: React.FC<NavBarProps> = ({ currentTab = "Home" }) => {
  const navigationContext = useContext(NavigationContext);

  if (!navigationContext) {
    console.warn(
      "[NavBar] No navigation context found. Skipping render or logic"
    );
    return null;
  }

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {tabConfig.map(({ route, label }) => {
        const isFocused = route === currentTab;

        return (
          <TouchableOpacity
            key={route}
            style={styles.tab}
            onPress={() => navigation.navigate(route)}
          >
            <View style={[styles.circle, isFocused && styles.activeCircle]} />
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

//  return (
//         <View key={tab} style={styles.tab}>
//           <View
//             style={[
//               styles.circle,
//               isFocused && styles.activeCircle,
//               isMiddle && styles.middleCircle,
//             ]}
//           />
//           <Text style={styles.label}>{tab}</Text>
//         </View>
//       );
//     })}
//   </View>
// );

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#4a5a75",
  },
  tab: {
    alignItems: "center",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d6dce5",
    marginBottom: 4,
  },
  activeCircle: {
    backgroundColor: "#ffffff",
  },
  label: {
    color: "white",
    fontSize: 10,
  },
});
export default NavBar;
