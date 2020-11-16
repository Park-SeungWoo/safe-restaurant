"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
/**
 * ? Local Imports
 */
const Card_1 = tslib_1.__importDefault(require("../Card/Card"));
const BottomContainer_style_1 = tslib_1.__importStar(require("./BottomContainer.style"));
const BottomContainer = (props) => {
    const { cardState, onSignUpPress, backgroundColor, onPressSettings, disableSettings, contentComponent, usernamePlaceholder, passwordPlaceholder, usernameOnChangeText, passwordOnChangeText, usernameIconComponent, passwordIconComponent, usernameTextInputValue, passwordTextInputValue, settingsIconComponent, signupText, signupStyle, disableSignupButton, loginButtonText, emailPlaceholder, emailOnChangeText, emailIconComponent, emailTextInputValue, repasswordTextInputValue, repasswordPlaceholder, repasswordOnChangeText, repasswordIconComponent, } = props;
    const renderUserIcon = () => (<react_native_1.Image source={require("../../local-assets/user.png")} style={BottomContainer_style_1.default.userIconImageStyle}/>);
    const renderPasswordIcon = () => (<react_native_1.Image source={require("../../local-assets/password.png")} style={BottomContainer_style_1.default.passwordIconImageStyle}/>);
    // const renderSettingsIcon = () => (<react_native_1.View style={BottomContainer_style_1.default.settingsIconContainer}>
    //   <react_native_1.Image source={require("../../local-assets/kakaotalk.png")} style={BottomContainer_style_1.default.settingsIconImageStyle}/>
    // </react_native_1.View>);
    const renderLoginCards = () => {
        return (<react_native_1.View style="">
          <react_native_1.Text></react_native_1.Text>
          <react_native_1.Text style={ BottomContainer_style_1.default.boxTextStyle }>①음식 덜어먹기</react_native_1.Text>
          <react_native_1.Text style={ BottomContainer_style_1.default.boxTextStyle }>②위생적 수저 관리</react_native_1.Text>
          <react_native_1.Text style={ BottomContainer_style_1.default.boxTextStyle }>③종사자 마스크 쓰기</react_native_1.Text>
        {/* <Card_1.default value={usernameTextInputValue} placeholder={usernamePlaceholder} onChangeText={usernameOnChangeText} iconComponent={usernameIconComponent || renderUserIcon()} {...props}/>
        <Card_1.default secureTextEntry value={passwordTextInputValue} placeholder={passwordPlaceholder} iconComponent={passwordIconComponent || renderPasswordIcon()} onChangeText={(text) => passwordOnChangeText && passwordOnChangeText(text)} {...props}/> */}
      </react_native_1.View>);
    };
    const renderSignupCards = () => {
        return (<react_native_1.View>
        <Card_1.default value={emailTextInputValue} placeholder={emailPlaceholder} onChangeText={emailOnChangeText} iconComponent={emailIconComponent || renderUserIcon()} {...props}/>
        {/* <Card_1.default secureTextEntry value={passwordTextInputValue} placeholder={passwordPlaceholder} onChangeText={passwordOnChangeText} iconComponent={passwordIconComponent || renderPasswordIcon()} {...props}/>
        <Card_1.default secureTextEntry value={repasswordTextInputValue} placeholder={repasswordPlaceholder} onChangeText={repasswordOnChangeText} iconComponent={repasswordIconComponent || renderPasswordIcon()} {...props}/> */}
      </react_native_1.View>);
    };
    const renderCardContent = () => {
        return cardState ? renderLoginCards() : renderSignupCards();
    };
    return (<react_native_1.View style={BottomContainer_style_1.container(backgroundColor, cardState)}>
      {contentComponent}
      <react_native_1.View style={BottomContainer_style_1.default.containerGlue}>{renderCardContent()}</react_native_1.View>
      <react_native_1.View style={BottomContainer_style_1.default.footerContainer}>
        {/* {!disableSettings && (<react_native_1.TouchableOpacity onPress={onPressSettings} style={{ marginRight: "auto", marginLeft: 12 }}>
            {settingsIconComponent || renderSettingsIcon()}
          </react_native_1.TouchableOpacity>)} */}
        {!disableSignupButton && (<react_native_1.TouchableOpacity style={BottomContainer_style_1.default.signupButtonStyle} onPress={() => onSignUpPress && onSignUpPress()}>
            <react_native_1.View style={BottomContainer_style_1.default.settingsIconContainer}>
              <react_native_1.Image source={require("../../local-assets/kakaotalk.png")} style={BottomContainer_style_1.default.settingsIconImageStyle}/>
            </react_native_1.View>
            <react_native_1.Text style={signupStyle || BottomContainer_style_1.default.signupTextStyle}>
              {cardState ? signupText : loginButtonText}
            </react_native_1.Text>
            <react_native_1.View style={BottomContainer_style_1.default.signupButtonRightArrowContainer}>
              <react_native_1.Image source={require("../../local-assets/right-arrow.png")} style={BottomContainer_style_1.default.signupButtonRightArrowImageStyle}/>
            </react_native_1.View>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>
    </react_native_1.View>);
};
BottomContainer.defaultProps = {
    loginButtonText: "Already Have Account",
    disableSwitch: false,
    disableSettings: true,
    usernameTitle: "Nickname",
    passwordTitle: "Password",
    signupText: "Sign Me Up!",
    repasswordTitle: "Re-Password",
    usernamePlaceholder: "Nickname",
    passwordPlaceholder: "Password",
    repasswordPlaceholder: "Re-password",
};
exports.default = BottomContainer;
//# sourceMappingURL=BottomContainer.js.map