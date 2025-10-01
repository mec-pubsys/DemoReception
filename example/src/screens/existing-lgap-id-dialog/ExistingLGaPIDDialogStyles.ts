import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 56,
    paddingVertical: 40,
    width: 450,
    height: 400,
    gap: 40,
  },
  mainContainer: {
    width: 338,
    height: 160,
    gap: 16,
    alignItems: "center",
  },
  messageContainer: {
    width: 338,
    height: 102,
    gap: 16,
  },
  buttonContainer: {
    width: 338,
    height: 120,
    gap: 16,
    justifyContent: "center",
  },
  button: {
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#346DF4",
  },
  titleText: {
    fontSize: 28,
  },
  messageText: {
    fontSize: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
  },
  cancelButtonText: {
    color: "#346DF4",
    fontSize: 24,
    textAlign: "center",
  },
});
