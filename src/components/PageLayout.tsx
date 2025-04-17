import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../navigation/NavBar';
const PageLayout = ({ children, currentTab, scrollable = false }) => {
  const ContentWrapper = scrollable ? ScrollView : View;
  return (
    <View style={styles.container}>
      <ContentWrapper
        contentContainerStyle={scrollable && styles.scrollContent}
        style={styles.content}
      >
        {children}
      </ContentWrapper>
      <NavBar currentTab={currentTab} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0fa',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
export default PageLayout;
