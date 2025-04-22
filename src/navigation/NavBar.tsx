import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, NavigationContext } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { navigationStyles } from "../styles";

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
    <View style={navigationStyles.container}>
      {tabConfig.map(({ route, label, iconName }) => {
        const isFocused = route === currentTab;

        return (
          <TouchableOpacity
            key={route}
            style={navigationStyles.tabButton}
            onPress={() => navigation.navigate(route)}
          >
            <MaterialIcons
              name={iconName}
              size={20}
              color={
                isFocused
                  ? navigationStyles.activeTab.color
                  : navigationStyles.inactiveTab.color
              }
            />
            <Text
              style={[
                navigationStyles.tabText,
                isFocused
                  ? navigationStyles.activeTab
                  : navigationStyles.inactiveTab,
              ]}
            >
              {label}
            </Text>
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

export default NavBar;
