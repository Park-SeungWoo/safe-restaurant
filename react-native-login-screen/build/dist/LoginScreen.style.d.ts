import { ViewStyle, TextStyle } from "react-native";
interface Style {
    spinnerStyle: ViewStyle;
    loginButtonStyle: ViewStyle;
    loginButtonTextStyle: TextStyle;
    imageBackgroundStyle: ViewStyle;
    blackoverlay: ViewStyle;
    safeAreaViewStyle: ViewStyle;
    logoContainer: ViewStyle;
}
export declare const container: (loginButtonBackgroundColor: string) => {
    marginBottom: number;
    width: any;
    height: any;
    backgroundColor: string;
};
declare const _default: Style;
export default _default;
