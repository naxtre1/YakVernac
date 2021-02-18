import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image, AppRegistry, StyleSheet, Alert, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import {CheckBox, Button} from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import {connect} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { strings } from '../../src/locales/i18n';
import {setXp} from '../redux/action'

class PendingTitle extends React.Component {

  render() {
    return (
      <View style={{flexDirection:'row',flex:1}}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}

class PendingDrawingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Welcome',
      headerTitle: <PendingTitle title="" navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  } 
  constructor(props) {
    super(props);
    this.state = {
        error: '',
        Guessed: false
    };
}

  onButtonSend() {
    const { response } = this.state;
    const { params } = this.props.navigation.state;

    // console.log(userId)
    var self = this;
    this.setState({Guessed:true});
    console.log(params.correctResponse2)

    if (response.toLowerCase() == params.correctResponse || response.toLowerCase() == params.correctResponse2) {

      this.setState({WasCorect:strings('PendingDrawing.answer_correct')});
        // TODO:
        // 1. UPDATE XP FOR THE GUESSER
        // 2. UPDATE XP FOR THE STELLER
        // 3. DELETE THE PENDING DRAWING FROM GUESSER's DB
        
        firestore().collection('user').doc(this.props.user.uid).collection('pendDrawings').doc(params.drawingId).delete().then(()=>{
          this.props.setXp(this.props.user.uid, this.props.xp+10)
        })
        
    } else {
      this.setState({WasCorect:strings('PendingDrawing.answer_incorrect')});
    }
    
    // fbDB.ref().child('users').orderByChild('email').equalTo(`${friendsEmail}`)
    // .once('value', function(snap) {

    //   if (snap.val() == undefined) {
    //     self.setState({error:'There is no user with the provided email!'})
    //   } else {
    //     var userId = snap.node_.children_.root_.key;

    //     fbDB.ref(`/users/${userId}/pendDrawings`)
    //       .push({correctResponse, myURL})
    //       .then(() => {

    //       console.log('VISKAS KO REIKIA - TAI GERAI NU');
    //       self.setModalVisible(true);
    //     })
    //     .catch(() => {
    //       console.log('NEIRASE I DB !!!')
    //     })
    //   }

    // });      
  }  
  

  renderContent() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    switch (this.state.Guessed) {
      case true:
        return (
          <View style={{flex: 1, flexDirection: 'column', paddingTop:50}}>

            <Text style={{ fontSize:25, color:'#2496BE',  textAlign:'center',}} >{this.state.WasCorect}</Text>
            
          {/* <TouchableHighlight
              onPress={() => {
                  navigate('Start');
              }}>  
          <Text>Back to main menu</Text>
          </TouchableHighlight> */}

          </View>
        );
      default:
        return (
          <KeyboardAwareScrollView>
            <View style={{ padding:30, width:'100%',height:'100%', backgroundColor:'#C3E3E4'}}>
            <View style={{ justifyContent:'center',alignItems:'center', backgroundColor:'#FF7F00'}}>
              <Text style={{fontSize:20, fontWeight:'bold',color:'white'}}>
                {strings('PendingDrawing.drawing')}
              </Text>
            </View>
            <View style={{width:'100%', height:300,justifyContent:'center',alignItems:'center', backgroundColor:'white'}}>
              <View style={{height:'100%', aspectRatio:1.3, justifyContent:'center',alignItems:'center'}}>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                  source={{uri: params.myURL}}
                  resizeMode="stretch"
                />
              </View>
            </View>
            <View style={{  width:'100%', height:40}}></View>
          <View>
            {/* <Text>Guess this image from your friend to obtain 5 XP !</Text> */}
 
          <Text></Text> 
          <CardSection>
          <Input
            placeholder={strings('PendingDrawing.what')}
            label={strings('PendingDrawing.response')}
            value={this.state.response}
            onChangeText={response => this.setState({ response })}
          />
          </CardSection>          

        <View style={{ marginTop:70, width:'100%',height:50, justifyContent:'center', alignItems:'center'}} >
              <View style={{ width:'90%',height:'100%',}} >
                <Button 
                  title={strings('PendingDrawing.submit')}
                  textStyle={{
                    fontSize:24,
                    fontWeight:'bold'
                  }}
                  buttonStyle={{
                    backgroundColor:'#FF7F00',
                    width:'100%',
                    height:45,
                  }}
                  onPress={this.onButtonSend.bind(this)}/>
              </View>
            </View>

        </View>
        </View>
        </KeyboardAwareScrollView>
        );
    }

    }

  render() {
    
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1 // label occupies 1/3 of the space
  },
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2 // input ocupies 2/3 of the space
  },
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#F5FCFF',
  },
  strokeColorButton: {
    marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
  },
  functionButton: {
    marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
    backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
  }
};

function mapStateToProps(state) {
	return {
        user: state.user,
        lang: state.lang,
        xp: state.xp
	}
}
  
export default connect(mapStateToProps, {setXp})(PendingDrawingScreen)
