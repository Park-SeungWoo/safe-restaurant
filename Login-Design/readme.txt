프로젝트 명/node_modules/react-native-login-screen/build/dist/LoginScreen.js
 
BottomContainer.defaultProps = {
    loginButtonText: "Already Have Account",
    disableSwitch: false,
    disableSettings: false,
    usernameTitle: "Username",
    passwordTitle: "Password",
    signupText: "Sign Me Up!",
    repasswordTitle: "Re-Password",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    repasswordPlaceholder: "Re-password",
};
에서
usernameTitle:"UserEmail"
usernamePlaceholder: "UserEmail"
로 변경함

프로젝트 명/node_modules/react-native-login-screen/build/dist/Card/Card.js

Card.defaultProps = {
    placeholder: "Username",
};
에서
placeholder: "UserEmail"
로 변경함

프로젝트 명/android/app/build.gradle 중

project.ext.vectoricons = [
    iconFontNames: [ 'Ionicons.ttf' ]
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
추가
