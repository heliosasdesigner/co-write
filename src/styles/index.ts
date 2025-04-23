import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

// Shared Styles
const sharedStyles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  } as ViewStyle,
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  } as ViewStyle,
  title: {
    fontSize: 20,
    fontWeight: "bold",
  } as TextStyle,
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  } as ViewStyle,
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  } as TextStyle,
};

// Navigation Styles
export const navigationStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  hintButtonContainer: {
    padding: 8,
  },
  hintBox: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
  hintText: {
    color: "#333",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  sendText: {
    color: "white",
    fontWeight: "bold",
  },
  messageBubble: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    maxWidth: "70%",
    borderRadius: 10,
    alignItems: "flex-start",
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
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
});

export const chatListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatItem: {
    padding: 16,
    backgroundColor: "#f6f6f6",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  chatUser: {
    fontWeight: "600",
    fontSize: 16,
  },
  topic: {
    color: "#555",
    fontStyle: "italic",
  },
  lastMessage: {
    color: "#555",
    marginTop: 4,
  },
  newChatButton: {
    backgroundColor: "#007bff",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export const newChatModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "transparent",
  },
  pickerItem: {
    fontSize: 16,
    height: 50,
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancel: {
    marginRight: 16,
    padding: 12,
  },
  create: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  inputWithHelper: {
    marginBottom: 16,
  },
  numberInput: {
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
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
  title: {
    ...sharedStyles.title,
    fontSize: 36,
    color: "#007AFF",
    alignSelf: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: sharedStyles.button,
  buttonText: sharedStyles.buttonText,
  errorText: {
    color: "#ff3b30",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    justifyContent: "center",
    marginHorizontal: 30,
    flex: 1,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  linkText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },
  linkButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

// Story Room Styles
export const storyRoomsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  roomList: {
    padding: 16,
  },
  roomItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  roomMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomMetaText: {
    fontSize: 12,
    color: "#888",
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
    marginTop: 10,
  },
  createButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Landing Page Styles
export const landingStyles = StyleSheet.create({
  grid: {
    padding: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 15,
    height: 200,
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
    marginTop: 10,
  },
});
