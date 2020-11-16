import { ViewStyle, TextStyle, ImageStyle } from "react-native";
interface Style {
    containerGlue: ViewStyle;
    footerContainer: ViewStyle;
    signupContainer: ViewStyle;
    signupTextStyle: TextStyle;
    signupButtonStyle: TextStyle;
    signupButtonRightArrowContainer: ViewStyle;
    signupButtonRightArrowImageStyle: ImageStyle;
    settingsIconContainer: ViewStyle;
    settingsIconImageStyle: ImageStyle;
    passwordIconImageStyle: ImageStyle;
    userIconImageStyle: ImageStyle;
}
export declare const container: (backgroundColor?: string, cardState?: boolean) => ViewStyle;
declare const _default: Style;
export default _default;
