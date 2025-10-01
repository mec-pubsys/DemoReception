import { StyleSheet, Platform } from "react-native";
import { colors } from "../../styles/color";
import { HeadingMediumBold } from "../../styles/typography";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  slideContainer: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: colors.bodyBackgroundColor,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyHeading: {
    alignItems: "center",
  },
  bodyHeadingText: {
    fontSize: HeadingMediumBold.size,
    lineHeight: HeadingMediumBold.lineHeight,
    color: colors.blackText,
  },
  bodyImageContainer: {
    backgroundColor: colors.bodyBackgroundColor,
    alignItems: "center",
    paddingTop: 8,
  },
  bodyImage: {
    ...Platform.select({
      web: {
        width: wp("100%"),
        height: hp("47%"),
      },
      android: {
        width: wp("100%"),
        height: hp("45%"),
      },
      ios: {
        width: wp("100%"),
        height: hp("47%"),
      }
    }),
  },
  dotView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        paddingVertical: 15,
      },
    }),
    backgroundColor: colors.bodyBackgroundColor,
    justifyContent: "center",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 1000,
    marginHorizontal: 5,
    gap: 16,
  },
});

export default styles;
