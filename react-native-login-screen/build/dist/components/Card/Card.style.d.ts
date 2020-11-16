import { ViewStyle, TextStyle } from "react-native";
interface Style {
    container: ViewStyle;
    containerGlue: ViewStyle;
    textContainer: ViewStyle;
    iconContainer: ViewStyle;
}
export declare const _textInputStyle: (textColor?: string | undefined) => TextStyle;
export declare const _textStyle: (titleColor?: string | undefined) => TextStyle;
declare const _default: Style;
export default _default;
