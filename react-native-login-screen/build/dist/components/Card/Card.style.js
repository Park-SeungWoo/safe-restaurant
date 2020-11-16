"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._textStyle = exports._textInputStyle = void 0;
const react_native_1 = require("react-native");
const react_native_helpers_1 = require("@freakycoder/react-native-helpers");
exports._textInputStyle = (textColor) => {
    return {
        fontSize: 14,
        color: textColor,
        fontWeight: "800",
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.3,
        right: react_native_helpers_1.isAndroid ? 5 : 0,
        marginTop: react_native_helpers_1.isAndroid ? 0 : 3,
        height: react_native_helpers_1.isAndroid ? 35 : undefined,
    };
};
exports._textStyle = (titleColor) => {
    return {
        fontSize: 12,
        fontWeight: "700",
        color: titleColor,
    };
};
exports.default = react_native_1.StyleSheet.create({
    container: {
        margin: 8,
        height: 75,
        width: "95%",
        marginTop: 0,
        borderRadius: 24,
        justifyContent: "center",
        backgroundColor: "white",
    },
    containerGlue: {
        marginLeft: 24,
        marginRight: 24,
        flexDirection: "row",
    },
    textContainer: {
        bottom: 3,
        width: "80%",
        marginLeft: 12,
        flexDirection: "column",
        justifyContent: "center",
        marginTop: react_native_helpers_1.isAndroid ? 10 : undefined,
    },
    iconContainer: {
        width: 35,
        justifyContent: "center",
    },
});
//# sourceMappingURL=Card.style.js.map