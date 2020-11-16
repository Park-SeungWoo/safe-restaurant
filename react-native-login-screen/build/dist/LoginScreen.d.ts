/// <reference types="react" />
import { IBottomContainerProps } from "./components/BottomContainer/BottomContainer";
import { ICardProps } from "./components/Card/Card";
export interface ILoginProps extends IBottomContainerProps, ICardProps {
    source?: any;
    loginText?: string;
    spinnerStyle?: any;
    logoComponent?: any;
    signupText: string;
    spinnerType?: string;
    spinnerSize?: number;
    spinnerColor?: string;
    spinnerEnable?: boolean;
    onPressLogin?: () => void;
    onPressSignup?: () => void;
    loginButtonTextStyle?: any;
    spinnerVisibility?: boolean;
    loginButtonBackgroundColor?: any;
}
declare const LoginScreen: {
    (props: ILoginProps): JSX.Element;
    defaultProps: {
        spinnerSize: number;
        loginText: string;
        spinnerEnable: boolean;
        spinnerColor: string;
        signupText: string;
        spinnerVisibility: boolean;
        spinnerType: string;
        source: {
            uri: string;
        };
        loginButtonBackgroundColor: string;
        loginButtonTextStyle: import("react-native").TextStyle;
    };
};
export default LoginScreen;
