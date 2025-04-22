import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationContext } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  "New Story": undefined;
  "Story Rooms": undefined;
  Profile: undefined;
};

type NavBarProps = {
  currentTab?: keyof RootStackParamList;
};

const tabConfig: Array<{
  route: keyof RootStackParamList;
  label: string;
  iconName: string;
}> = [
  { route: "Home", label: "Home", iconName: "home" },
  { route: "Search", label: "Search", iconName: "search" },
  { route: "New Story", label: "New Story", iconName: "create" },
  { route: "Story Rooms", label: "Story Rooms", iconName: "book" },
  { route: "Profile", label: "Profile", iconName: "person" },
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
      {tabConfig.map(({ route, label, iconName }) => {
        const isFocused = route === currentTab;

        return (
          <TouchableOpacity
            key={route}
            style={styles.tab}
            onPress={() => navigation.navigate(route)}
          >
            <View style={[styles.circle, isFocused && styles.activeCircle]}>
              <MaterialIcons
                name={iconName}
                size={20}
                color={isFocused ? "#4a5a75" : "#7a8a9a"}
              />
            </View>
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
    alignItems: "center",
    justifyContent: "center",
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
