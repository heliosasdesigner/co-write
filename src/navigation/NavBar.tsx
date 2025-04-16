import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const tabs = ["Home", "Search", "New Story", "Story Rooms", "Profile"];

const NavBar = ({ currentTab = "Home" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isFocused = tab === currentTab;

        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => navigation.navigate(tab)}
          >
            <View style={[styles.circle, isFocused && styles.activeCircle]} />
            <Text style={styles.label}>{tab}</Text>
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
