"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const react_native_1 = require("react-native");
const react_native_helpers_1 = require("@freakycoder/react-native-helpers");
exports.container = (loginButtonBackgroundColor) => {
    return {
        marginBottom: 32,
        width: react_native_helpers_1.ScreenWidth,
        height: react_native_helpers_1.ScreenHeight,
        backgroundColor: loginButtonBackgroundColor,
    };
};
exports.default = react_native_1.StyleSheet.create({
    spinnerStyle: {
        left: 0,
        right: 0,
        zIndex: 9,
        height: 50,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        bottom: react_native_helpers_1.isIPhoneNotchFamily() ? 24 : 12,
    },
    loginButtonStyle: {
        left: 0,
        right: 0,
        zIndex: 9,
        height: 50,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        bottom: react_native_helpers_1.isAndroid ? 24 : react_native_helpers_1.isIPhoneNotchFamily() ? 24 : 12,
    },
    loginButtonTextStyle: {
        color: "white",
        fontSize: 15,
    },
    imageBackgroundStyle: {
        flex: 1,
        zIndex: -1,
        width: react_native_helpers_1.ScreenWidth,
        height: react_native_helpers_1.ScreenHeight * 0.9,
        ...react_native_1.StyleSheet.absoluteFillObject,
    },
    blackoverlay: {
        width: react_native_helpers_1.ScreenWidth,
        height: react_native_helpers_1.ScreenHeight,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    safeAreaViewStyle: {
        flex: 1,
    },
    logoContainer: {
        marginTop: 12,
    },
});
//# sourceMappingURL=LoginScreen.style.js.map