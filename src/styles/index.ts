import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

// Shared Styles
const sharedStyles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  } as ViewStyle,
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
  } as TextStyle,
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  } as ViewStyle,
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  } as TextStyle,
  input: {
    height: 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  } as TextStyle,
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  backButtonText: {
    fontSize: 15,
    color: "#007AFF",
    marginLeft: 4,
  } as TextStyle,
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 16,
  } as TextStyle,
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
};

// Navigation Styles
export const navigationStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    ...sharedStyles.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  activeTab: {
    color: "#007AFF",
  },
  inactiveTab: {
    color: "#8E8E93",
  },
});

// Component Styles
export const headerStyles = StyleSheet.create({
  header: {
    ...sharedStyles.header,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: sharedStyles.title,
});

export const storyCardStyles = StyleSheet.create({
  card: {
    ...sharedStyles.card,
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
  },
  title: {
    ...sharedStyles.title,
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
  },
});

export const pageLayoutStyles = StyleSheet.create({
  container: sharedStyles.container,
  content: {
    flex: 1,
    padding: 15,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});

// Combined button styles for login and logout
export const buttonStyles = StyleSheet.create({
  button: sharedStyles.button,
  buttonText: sharedStyles.buttonText,
});

// Alias for backward compatibility
export const loginButtonStyles = buttonStyles;
export const logoutButtonStyles = buttonStyles;

// Combined example styles
export const exampleStyles = StyleSheet.create({
  container: {
    ...sharedStyles.card,
    margin: 10,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

// Chat Styles
export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: sharedStyles.header,
  backButton: sharedStyles.backButton,
  backButtonText: sharedStyles.backButtonText,
  headerTitle: sharedStyles.headerTitle,
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  messageGroup: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  myMessageGroup: {
    alignItems: "flex-end",
  },
  messageBubble: {
    marginHorizontal: 12,
    marginVertical: 2,
    padding: 12,
    maxWidth: "75%",
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: "#FFE5D6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#E3F2FD",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: "#C85C21",
  },
  theirMessageText: {
    color: "#0277BD",
  },
  hintBox: {
    backgroundColor: "#E8F5E9",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
  } as ViewStyle,
  hintText: {
    color: "#1B5E20",
    fontSize: 17,
    lineHeight: 24,
  } as TextStyle,
  completionContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  completionContent: {
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007bff",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  completionImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
  hintButtonContainer: {
    padding: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
});

export const chatListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 8,
  },
  chatItem: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatUser: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  topic: {
    fontSize: 15,
    color: "#007AFF",
    marginBottom: 8,
    fontWeight: "500",
  },
  lastMessage: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
  },
  newChatButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
});

export const newChatModalStyles = StyleSheet.create({
  container: sharedStyles.container,
  header: sharedStyles.header,
  backButton: sharedStyles.backButton,
  backButtonText: sharedStyles.backButtonText,
  headerTitle: sharedStyles.headerTitle,
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    paddingTop: 18,
  },
  input: {
    ...sharedStyles.input,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.0)",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    backgroundColor: "transparent",
    transform: [{ translateY: -4 }],
  },
  helperText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  create: {
    ...sharedStyles.button,
    flex: 1,
    marginLeft: 8,
  },
});

// App Styles
export const appStyles = StyleSheet.create({
  container: sharedStyles.container,
  header: {
    ...sharedStyles.header,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: sharedStyles.title,
  subtitle: {
    fontSize: 16,
    fontWeight: "normal",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "black",
  },
});

// Auth Styles
export const authStyles = StyleSheet.create({
  container: sharedStyles.container,
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    ...sharedStyles.input,
    marginBottom: 16,
  },
  button: {
    ...sharedStyles.button,
    marginTop: 8,
  },
  buttonText: sharedStyles.buttonText,
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  linkContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    color: "#666",
  },
  linkButtonText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 4,
  },
});

// Story Room Styles
export const storyRoomsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: sharedStyles.header,
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  roomList: {
    padding: 16,
  },
  roomItem: {
    ...sharedStyles.card,
    marginBottom: 12,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  roomMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomMetaText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  createButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    ...sharedStyles.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: sharedStyles.buttonText,
});

// Landing Page Styles
export const landingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  grid: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
    aspectRatio: 1,
  },
  card: {
    ...sharedStyles.card,
    flex: 1,
    justifyContent: "space-between",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
});
