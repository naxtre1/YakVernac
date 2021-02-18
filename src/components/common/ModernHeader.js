import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { p } from './normalize'

export default class ModernHeader extends React.Component {

  render() {
    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    middleViewWidth = viewportWidth - 56 * 2;
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ paddingLeft: 15, backgroundColor: 'transparent' }}>
          <Ionicons name='ios-arrow-back' size={p(20)} color='white' onPress={() => this.props.navigation.goBack()} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: p(20) }}>
            {this.props.title}
          </Text>
        </View>

      </View>
    );
  }
}
