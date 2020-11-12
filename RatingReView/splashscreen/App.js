/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ReviewModal from "react-native-review-modal";





export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.6
    };
  }
  
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  render() {
    
    return (
      <ReviewModal
        starRating={this.state.starCount}
        onStarRatingPress={rating => {
          this.onStarRatingPress(rating);
        }}
      />
    );
  }
  }

