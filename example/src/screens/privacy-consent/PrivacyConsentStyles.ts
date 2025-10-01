import { StyleSheet,Platform } from "react-native";
import { colors } from "../../styles/color";
import {
  BodyTextLarge,
} from "../../styles/typography";
 
export const styles = StyleSheet.create({
  contentContainter: {
    width: 433,
    height: 356,
    borderRadius: 4,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 3,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems:'center',
    gap: 8,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,  
  },
  titleText: {
    color: colors.textColor,
  },
  contentText: {
    width: 401,
    height: 'auto',
    fontSize: BodyTextLarge.size,
    lineHeight: 27.2,
    color: colors.blackText,
    textAlign: "justify",
    ...Platform.select({
      web: {
        width: 395,
        paddingRight: 8,
      },
    }),
  },  
});
 
export default styles;