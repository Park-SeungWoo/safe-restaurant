"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_material_textfield_1 = require("@freakycoder/react-native-material-textfield");
/**
 * ? Local Imports
 */
const Card_style_1 = tslib_1.__importDefault(require("./Card.style"));
const Card = (props) => {
    const { value, placeholder, onChangeText, secureTextEntry, iconComponent, } = props;
    return (<react_native_1.View style={Card_style_1.default.container}>
      <react_native_1.View style={Card_style_1.default.containerGlue}>
        <react_native_1.View style={Card_style_1.default.iconContainer}>{iconComponent}</react_native_1.View>
        <react_native_1.View style={Card_style_1.default.textContainer}>
          <react_native_material_textfield_1.TextField {...props} value={value} label={placeholder} onChangeText={onChangeText} secureTextEntry={secureTextEntry}/>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
};
Card.defaultProps = {
    placeholder: "Nickname",
};
exports.default = Card;
//# sourceMappingURL=Card.js.mapnpm 