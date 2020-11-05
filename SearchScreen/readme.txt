프로젝트 명/android/app/build.gradle 에서

project.ext.vectoricons = [
    iconFontNames: [ 'Ionicons.ttf' ]
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

추가

프로젝트 명/node_modules/react-native-header-search-bar/components/SearchBox/SearchBox.js 중

import Icon from "react-native-dynamic-vector-icons";
를
import Icon from "react-native-vector-icons/Ionicons";
로 변경

<Icon name="filter" type="FontAwesome" {...props} />
를
<Icon name="filter" type="ion-icons" {...props} />
로 변경

프로젝트 명/node_modules/react-native-header-search-bar/HeaderClassicSearchBar/HeaderClassicSearchBar.js 중

import Icon from "react-native-dynamic-vector-icons";
를
import Icon from "react-native-vector-icons/Ionicons";
로 변경

<Icon name="filter" type="FontAwesome" {...props} />
를
<Icon name="filter" type="ion-icons" {...props} />
로 변경
