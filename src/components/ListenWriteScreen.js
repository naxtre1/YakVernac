import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import Tts from 'react-native-tts';
import { CheckBox, Slider, Icon } from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import { Button } from 'react-native-elements';
import { CustomHeader } from './common/CustomHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage, hideMessage } from "react-native-flash-message";
import { strings } from '../../src/locales/i18n';
import { connect } from 'react-redux'
import { setXp } from '../redux/action'

Tts.setDefaultLanguage('pt-BR');
Tts.setDefaultRate(0.6);

class ListenWriteScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Musical/Linguistic',
      headerTitle: <CustomHeader navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }

  state = { words: [''], SpeechSpeed: 0.6, index: 0, topicIndex: 0, a: [''], k: 0, temp: '', moreInfo: '', result: [''], finalArray: [], compareResult: [''], allCorrect: 0, max: 5, WordToSpeak: '' };

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  onButtonPress() {

    const { navigate } = this.props.navigation;

    switch (this.state.index) {
      case 0:
        navigate('VisualAwareness');
      // case false:
      //   return <LoginForm />;
      default:
        return navigate('Home');
    }
  }

  makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 3; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  changeWord(a) {

    if (this.state.k != this.state.max) {
      // this.setState({WordToGuess:a[this.state.k]});
      //   this.setState({ImageToGuess:a})
      //   console.log(a[this.state.k]);
      this.setState({ finalArray: [] });
      firestore().collection(`Vocabulary${this.props.lang.languageNative}${this.props.lang.languageLearning}`).doc(a[this.state.k]).get().then(doc => {

        var snapshotResult = doc.data()
        //   console.log(snapshotResult);
        var temp = snapshotResult.word;

        // this.setState({WordToSpeak:temp});
        //   console.log('SPEAK -----------' + temp);

        var tempResult = temp.split('');
        var MyresultArray = this.shuffle(tempResult);

        var Addletters = this.makeid().split('');
        var result = MyresultArray.concat(Addletters);

        if (tempResult.indexOf('/') !== -1) {
          this.setState({ moreInfo: 'This word can be masculine or feminine' })
          var compRes = temp.split('/');
          this.setState({ compareResult: compRes });


          // console.log('SPEAK 222 -----------' + compRes[0]);
          this.setState({ WordToSpeak: compRes[0] });
          tempResult.splice(tempResult.indexOf('/'), 1);
          var result = this.shuffle(tempResult);
          this.setState({ result });
        } else {
          this.setState({ WordToSpeak: temp });
          this.setState({ result });
          this.setState({ compareResult: [temp] });
        }

        this.setState({ result });
      })
    } else if (this.state.k == this.state.max) {

      var userXP = this.props.xp + this.state.allCorrect;
      this.props.setXp(this.props.user.uid, userXP)
    }

  }

  UNSAFE_componentWillMount() {
    if (this.props.lang.languageLearning == 'Portuguese') {
      Tts.setDefaultLanguage('pt-BR');
    } else {
      Tts.setDefaultLanguage('en-US');
    }
  }

  componentDidMount() {
    this.setState({ SpeechSpeed: 0.6 });
    const { params } = this.props.navigation.state;
    var a = this.shuffle(params.words);
    if (a.length > 5) {
      a = a.slice(0, 5);
      this.setState({ a })
    } else {
      this.setState({ max: a.length });
      this.setState({ a })
    }


    console.log("Listen then write : ", a);

    this.changeWord(a);

  }

  addToArray(letter, index) {
    console.log(letter);
    var Myarray = this.state.finalArray;
    Myarray.push(letter);
    this.setState({ finalArray: Myarray });

    var ResultArray = this.state.result;
    ResultArray.splice(index, 1);
    this.setState({ result: ResultArray });
  }

  deleteFromArray(index, letter) {
    var manoArray = this.state.finalArray;
    manoArray.splice(index, 1);
    this.setState({ finalArray: manoArray });

    var ResultArray = this.state.result;
    ResultArray.push(letter);
    this.setState({ result: ResultArray });
  }

  CheckIfCorrect() {
    var kelintas = this.state.k + 1;
    console.log('KELINTAS YRA: ' + kelintas);

    var final = this.state.finalArray.join("");
    var compareResult = this.state.compareResult;
    var result = false
    if (compareResult.indexOf(final) !== -1) {
      result = true
      this.setState({ temp: strings('GamesCommon.correct') })
      this.setState({ allCorrect: this.state.allCorrect + 1 });

      showMessage({
        message: strings('GamesCommon.correct'),
        description: strings('GamesCommon.sucess_desc'),
        type: "success",
      });

    } else {
      result = false
      this.setState({ temp: strings('GamesCommon.wrong') })

      showMessage({
        message: strings('GamesCommon.wrong'),
        description: strings('GamesCommon.better_luck'),
        type: "danger",
      });
    }
    const word = this.state.a[this.state.k]

    //newer way
    if (word) {
      firestore().collection('user').doc(this.props.user.uid).collection('progress').add({
        lang: this.props.lang.languageLearning,
        time: Date.now(),
        word,
        result,
        mode: 'listen',
        count: 1
      })
    }

    // older way
    // if (word) {
    //     firestore().collection('user').doc(this.props.user.uid).collection('progress')
    //     .where('lang', '==', this.props.lang.languageLearning)
    //     .where('word', '==', word)
    //     .where('mode', '==', 'listen')
    //     .get()
    //     .then(snapshotResult=>{
    //         if (snapshotResult.empty) {
    //             firestore().collection('user').doc(this.props.user.uid).collection('progress').add({
    //                 lang: this.props.lang.languageLearning,
    //                 time: Date.now(),
    //                 word,
    //                 result,
    //                 mode: 'listen',
    //                 count: 1
    //             })
    //             return
    //         } else {
    //             const data = snapshotResult.docs[0].data()
    //             const count = data.count?data.count+1:1
    //             firestore().collection('user').doc(this.props.user.uid).collection('progress').doc(snapshotResult.docs[0].id).update({
    //                 result, time: Date.now(), count
    //             })
    //         }
    //         return
    //     })
    // }
    this.setState({
      k: kelintas
    }, () => {
      this.changeWord(this.state.a);
    });
  }

  godown(myspeed) {
    // console.log('DOOOOOWN');
    var currentSpeed = this.state.SpeechSpeed;
    var speed = (parseFloat(currentSpeed) - parseFloat(myspeed));
    // console.log(speed);

    // Tts.setDefaultPitch(0.8);
    if (speed <= 0.1) {
      Tts.setDefaultRate(0.1);
      this.setState({ SpeechSpeed: 0.1 });
    } else {
      Tts.setDefaultRate(speed);
      this.setState({ SpeechSpeed: speed.toFixed(1) });
    }

  }

  goup(myspeed) {
    var currentSpeed = this.state.SpeechSpeed;
    var speed = (parseFloat(currentSpeed) + parseFloat(myspeed));
    // console.log(speed);
    if (speed >= 0.9) {
      Tts.setDefaultRate(0.9);
      this.setState({ SpeechSpeed: 0.9 });
    } else {
      Tts.setDefaultRate(speed);
      this.setState({ SpeechSpeed: speed.toFixed(1) });
    }

    // Tts.setDefaultPitch(1.7);
  }

  renderContent() {
    const { navigate } = this.props.navigation;

    switch (this.state.k) {
      case this.state.max:
        return (
          <View style={{ width: '100%', height: '100%', paddingHorizontal: 30, paddingTop: 15, backgroundColor: '#C3E3E4' }}>
            <View style={{ width: '100%', height: '80%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FB5A3A', marginTop: 20 }}>{strings('GamesCommon.thanks_for')}</Text>
              <Text style={{ marginTop: 27, fontSize: 24, color: '#2496BE' }}>{strings('GamesCommon.you_earned', { name: this.state.allCorrect })}</Text>
            </View>
            <View style={{ width: '100%', height: 45 }}></View>
            <View style={{ width: '100%', height: 45, justifyContent: 'flex-start', alignItems: 'center' }} >
              <View style={{ width: '96%', height: 45, }} >
                <Button
                  title={strings('GamesCommon.exit_game')}
                  textStyle={{
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                  buttonStyle={{
                    backgroundColor: '#FF7F00',
                    width: '100%',
                    height: 45,
                  }}
                  onPress={() => {
                    const lessonID = this.props.navigation.getParam('lessonID')
                    console.log('lessonID:', lessonID)
                    firestore().collection('user').doc(this.props.user.uid).collection('lesson').doc(lessonID).update({
                      end: Date.now()
                    }).then(() => {
                      navigate('Start')

                    })
                  }} />
              </View>
            </View>
            <View style={{ width: '100%', height: 45 }}></View>
          </View>
        );

      default:
        return (
          <View style={{ width: '100%', height: '100%', paddingHorizontal: 30, paddingTop: 15, backgroundColor: '#C3E3E4' }}>
            <Slider
              value={this.state.k / this.state.max}
              thumbTintColor='#FF7F00'
              minimumTrackTintColor='#006780'
              maximumTrackTintColor='#1EA2BC'
            />
            <View style={{ marginBottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text>{this.state.k}/{this.state.max}</Text>
            </View>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FD751C' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                {strings('ListenWrite.listen_write')}
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
              <TouchableOpacity onPress={this.SpeakNow.bind(this)}>
                <View style={{ borderRadius: 100, width: 200, height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CCCCCC' }}>
                  <View style={{ borderRadius: 144, width: 188, height: 188, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Icon name='triangle-right' type='entypo' size={150} color='#DC540F' />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* <View>
              <TouchableHighlight
                onPress={() => {this.godown(0.1)}}> 
                <Text>DOWN</Text>
              </TouchableHighlight>
            </View>
            <View>
              <TouchableHighlight
              onPress={() => {this.goup(0.1)}}> 
              <Text>UP</Text>
              </TouchableHighlight>
            </View> */}

            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>

              {/* <View style={{ flexDirection:'row', flexWrap:'wrap'}} >
                <Button 
                  title='UP'
                  textStyle={{
                    fontSize:10,
                    fontWeight:'bold'
                  }}
                  buttonStyle={{
                    backgroundColor:'#FF7F00',
                    width:'50%',
                    height:25,
                    width: 30
                  }}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    navigate('Start')
                  }}/>


                  <Button 
                  title='DOWN'
                  textStyle={{
                    fontSize:10,
                    fontWeight:'bold'
                  }}
                  buttonStyle={{
                    backgroundColor:'#FF7F00',
                    width:'50%',
                    height:25,
                  }}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    navigate('Start')
                  }}/>

              </View> */}

              <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ width: '25%' }}>
                  {/* <CheckBox containerStyle={{ borderWidth:0, paddingLeft: 5, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title={strings('Profile.male')}
                    textStyle={{
                      marginLeft: 20, fontSize: 12, fontWeight: 'normal', color: 'grey'
                    }}
                    checkedIcon='check-circle-o'
                    uncheckedIcon='male'
                    // checked={this.state.checkedMale}
                    // onPress={this.onChangeMale.bind(this)}
                  /> */}
                  <Icon name='arrow-up' type='entypo' size={25} color='#ff6f16' onPress={() => { this.goup(0.1) }} />
                </View>
                <View style={{ width: '35%' }}>
                  <Text>{strings('ListenWrite.speech')} {this.state.SpeechSpeed}</Text>
                </View>
                <View style={{ width: '25%' }}>
                  {/* <CheckBox containerStyle={{ borderWidth:0,  paddingLeft: 10, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title={strings('Profile.female')}
                    textStyle={{
                      marginLeft: 19, fontSize: 12, fontWeight: 'normal', color: 'grey'
                    }}
                    checkedIcon='check-circle-o'
                    uncheckedIcon='female'
                    // checked={this.state.checkedFemale}
                    // onPress={this.onChangeFemale.bind(this)}
                  /> */}
                  <Icon name='arrow-down' type='entypo' size={25} color='#ff6f16' onPress={() => { this.godown(0.1) }} />
                </View>
              </View>

              <Text></Text>

              <Text>{this.state.moreInfo}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {this.state.result.map((letter, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => this.addToArray(letter, index)}
                  >
                    <View style={{ marginHorizontal: 2, marginVertical: 5, width: 25, height: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2496BE' }}>
                      <Text style={{ color: 'white', fontSize: 20 }}>{letter}</Text>
                    </View>
                  </TouchableOpacity>

                ))}
              </View>
              <Text style={{ marginTop: 10, }}>{strings('GamesCommon.your_response')}</Text>
              <View style={{ marginBottom: 20, width: '100%', height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {this.state.finalArray.map((letter, index) => (
                    <TouchableOpacity

                      key={index}
                      onPress={() => this.deleteFromArray(index, letter)}
                    >
                      <Text style={{ padding: 5, fontSize: 20 }}>{letter}</Text>
                    </TouchableOpacity>

                  ))}
                </View>
              </View>
              <View style={{ marginBottom: 35, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  title={strings('GamesCommon.validate')}
                  textStyle={{
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                  buttonStyle={{
                    backgroundColor: '#1EA2BC',
                    width: 150,
                    height: 45,
                  }}
                  onPress={() => this.CheckIfCorrect()} />
              </View>
            </View>
            {/* <View style={{padding:10}}>
                      <Text>Words to practise:</Text>
                      <TouchableHighlight onPress={this.SpeakNow.bind(this)}>
                        <Image
                          style={styles.button}
                          source={require('./phone.png')}
                        />
                      </TouchableHighlight>
                      <View>
                        <TouchableHighlight
                          onPress={() => {this.godown(0.1)}}> 
                          <Text>DOWN</Text>
                        </TouchableHighlight>
                      </View>
                      <View>
                        <TouchableHighlight
                        onPress={() => {this.goup(0.1)}}> 
                        <Text>UP</Text>
                        </TouchableHighlight>
                      </View>
                      <Text>{this.state.SpeechSpeed}</Text>
                      <Text></Text>
                      <Text>{this.state.moreInfo}</Text>
            
                      <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                      {this.state.result.map((letter, index) => (
                        <TouchableOpacity
                        
                        key={index} 
                        onPress={() => this.addToArray(letter, index)}
                        >
                            <Text style={{padding: 5}}>{letter}</Text>
                        
                        </TouchableOpacity>
                      
                        ))} 
                      </View>

                      <Text>Your Response:</Text>

                      <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                        {this.state.finalArray.map((letter, index) => (
                          <TouchableOpacity
                            key={index} 
                            onPress={() => this.deleteFromArray(index, letter)}
                          >
                            <Text style={{padding: 5}}>{letter}</Text>
                          </TouchableOpacity>
                        
                        ))} 
                      </View>
                      <Button 
                        title='Validate'
                        onPress={() => this.CheckIfCorrect()}
                      />
                      <Text>--------------------------------</Text>
                      <Text>{this.state.temp}</Text>
                    </View> */}
          </View>
        );
    }
  }

  SpeakNow() {
    Tts.speak(this.state.WordToSpeak);
  }

  render() {
    // The screen's current route is passed in to `props.navigation.state`:

    return (
      <KeyboardAwareScrollView style={{ backgroundColor: '#C3E3E4' }}>
        {this.renderContent()}
      </KeyboardAwareScrollView>
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
  button: {
    width: 70,
    height: 70,
  },
};

function mapStateToProps(state) {
  return {
    user: state.user,
    xp: state.xp,
    lang: state.lang
  }
}

export default connect(mapStateToProps, { setXp })(ListenWriteScreen)
