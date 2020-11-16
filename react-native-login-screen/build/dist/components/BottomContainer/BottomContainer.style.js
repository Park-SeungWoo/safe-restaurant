"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const react_native_1 = require("react-native");
const { width, height } = react_native_1.Dimensions.get("window");
exports.container = (backgroundColor = "rgba(255,255,255,0.45)", cardState = false) => {
    return {
        backgroundColor,
        borderRadius: 24,
        width: width * 0.9,
        alignSelf: "center",
        position: "absolute",
        bottom: height * 0.15,
        height: cardState ? 200 : 200,
    };
};
exports.default = react_native_1.StyleSheet.create({
    containerGlue: {
        marginTop: 12,
    },
    footerContainer: {
        flex: 1,
        margin: 16,
        alignItems: "center",
        // flexDirection: "row",
        justifyContent: "flex-end",
    },
    signupContainer: {
        // marginLeft: "auto",
    },
    signupTextStyle: {
        color: "#fdfdfd",
        fontWeight: "700",
    },
    boxTextStyle: {
        alignSelf: "center",
        color: "#fdfdfd",
        fontWeight: "700",
        fontSize: 20,
    },
    signupButtonStyle: {
        padding: 10,
        minHeight: 30,
        borderRadius: 16,
        // marginLeft: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    signupButtonRightArrowContainer: {
        marginLeft: 5,
    },
    signupButtonRightArrowImageStyle: {
        width: 15,
        height: 15,
    },
    settingsIconContainer: {
        shadowRadius: 3,
        shadowOpacity: 0.7,
        shadowColor: "#757575",
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },
    settingsIconImageStyle: {
        width: 35,
        height: 35,
    },
    passwordIconImageStyle: {
        width: 30,
        height: 30,
    },
    userIconImageStyle: {
        width: 30,
        height: 30,
    },
});
//# sourceMappingURL=BottomContainer.style.js.map