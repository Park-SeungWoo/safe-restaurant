"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_spinkit_1 = tslib_1.__importDefault(require("react-native-spinkit"));
/**
 * ? Local Imports
 */
const LoginScreen_style_1 = tslib_1.__importStar(require("./LoginScreen.style"));
const BottomContainer_1 = tslib_1.__importDefault(require("./components/BottomContainer/BottomContainer"));
const defaultBackground = "https://images.unsplash.com/photo-1543637005-4d639a4e16de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1481&q=80";
const LoginScreen = (props) => {
    const { source, loginText, signupText, spinnerType, spinnerSize, spinnerColor, onPressLogin, spinnerStyle, spinnerEnable, onPressSignup, logoComponent, spinnerVisibility, loginButtonTextStyle, loginButtonBackgroundColor, } = props;
    const [cardState, setCardState] = React.useState(true);
    const renderSpinner = () => (<react_native_1.View style={LoginScreen_style_1.default.spinnerStyle}>
      <react_native_spinkit_1.default size={spinnerSize} type={spinnerType} style={spinnerStyle} color={spinnerColor} isVisible={spinnerVisibility}/>
    </react_native_1.View>);
    const renderLoginButton = () => (<react_native_1.TouchableOpacity style={LoginScreen_style_1.default.loginButtonStyle} onPress={onPressLogin}>
      <react_native_1.Text style={loginButtonTextStyle}>
        {cardState ? loginText : signupText.toUpperCase()}
      </react_native_1.Text>
    </react_native_1.TouchableOpacity>);
    return (<react_native_1.KeyboardAvoidingView behavior="position" style={LoginScreen_style_1.container(loginButtonBackgroundColor)}>
      <react_native_1.View style={LoginScreen_style_1.container(loginButtonBackgroundColor)}>
        <react_native_1.ImageBackground source={source} borderRadius={24} resizeMode="cover" style={LoginScreen_style_1.default.imageBackgroundStyle}>
          <react_native_1.View style={LoginScreen_style_1.default.blackoverlay}>
            <react_native_1.SafeAreaView style={LoginScreen_style_1.default.safeAreaViewStyle}>
              <react_native_1.View style={LoginScreen_style_1.default.logoContainer}>{logoComponent}</react_native_1.View>
              <BottomContainer_1.default {...props} cardState={cardState} onSignUpPress={() => {
                  setCardState(!cardState);
                  onPressSignup && onPressSignup();
              }}/>
            </react_native_1.SafeAreaView>
          </react_native_1.View>
        </react_native_1.ImageBackground>
        {spinnerEnable && spinnerVisibility
        ? renderSpinner()
        : renderLoginButton()}
      </react_native_1.View>
    </react_native_1.KeyboardAvoidingView>);
};
LoginScreen.defaultProps = {
    spinnerSize: 30,
    loginText: "LOGIN",
    spinnerEnable: false,
    spinnerColor: "#fdfdfd",
    signupText: "Login with KakaoTalk",
    spinnerVisibility: false,
    spinnerType: "ThreeBounce",
    source: { uri: defaultBackground },
    loginButtonBackgroundColor: "#282828",
    loginButtonTextStyle: LoginScreen_style_1.default.loginButtonTextStyle,
};
exports.default = LoginScreen;
//# sourceMappingURL=LoginScreen.js.map