import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { Styles } from './Stylesheet';
import { WebView } from 'react-native-webview'



// import strings from '../../Localization';

// props.navigation.state.params.title
export default class WebViewScreen extends React.Component {

  constructor(props) {
    super(props);
    // console.log("PROPS " + props.navigation.params);
  }


  render() {

    return (
      <SafeAreaView style={Styles.MainContainer}>
       
        <View style={Styles.container}>
          <WebView source={{ uri:  this.props.navigation.state.params.videoUrl }} />
        </View>
      </SafeAreaView>
    );
  };
}