import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { CheckBox, Avatar, Icon } from 'react-native-elements';
import { ThemeProvider, Button } from 'react-native-material-ui';
import Modal from "react-native-modal";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { showMessage, hideMessage } from "react-native-flash-message";
import { connect } from 'react-redux'
import { Card, CardSection, Input, Spinner } from './common';
import Mystyles from '../styles/SliderEntry.style';
import ContainerStyles, { colors } from '../styles/index.style';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import Autocomplete from 'react-native-autocomplete-input';
import ElevatedView from 'react-native-elevated-view';
import { Dimensions } from 'react-native';
import { CustomHeader } from './common/CustomHeader';
import { strings } from '../../src/locales/i18n';
const SLIDER_1_FIRST_ITEM = 1;

const robotoRegular = 'Roboto-regular';
const robotoMedium = 'Roboto-Medium';
const robotoLight = 'Roboto-Light';
const robotoBold = 'Roboto-Bold';


class OtherProfileScreen extends Component {
  // Nav options can be defined as a function of the screen's props:
  // static navigationOptions = ({ navigation }) => ({
  //   title: `Chat with ${navigation.state.params.email}`,
  // });

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Welcome',
      headerTitle: <CustomHeader navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold.ttf',
      },
    };
  }

  constructor(props) {
    super(props);
  }

  state = {
    visibleModal: null, uid: '', isModalVisible: false, email: '', password: '', error: '', loading: false, loggedInUser: true, selectScreenPhase: 0,
    loadingCarousel: true, openModalForLanguage: false,
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
  };

  UNSAFE_componentWillMount() {
    const { params } = this.props.navigation.state;
    var manoID = params.uid;

    // console.log(params.uid);

    // const {currentUser} = auth();

    const self = this;

    firestore().collection('user').doc(params.uid).get().then(doc=>{
      const values = doc.data()
      if (values) {
        if (values.premium == undefined) { values.premium = false; } else { values.premium = true; }
        if (values.myPic == undefined) {
          values.myPic = 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.png?alt=media&token=ee7f968c-00c9-4097-8e0b-53f3a3562c05';
        }
        self.setState({
          uid: manoID,
          username: values.username,
          age: values.age,
          language: values.languageLearning,
          sex: values.sex,
          interests: values.interests,
          introduction: values.introduction,
          xp: values.xp,
          myPic: values.myPic,
          premium: values.premium 
        });
      }

    })
    // database().ref('/users/' + params.uid).once('value')
    //   .then(function (snapshot) {
    //     // console.log(snapshot.val());
    //     const values = snapshot.val();
    //     // self.setState({profilePics:values.profilePics});
    //     if (values.checkedFemale == undefined) { values.checkedFemale = false; }
    //     if (values.checkedMale == undefined) { values.checkedMale = false; }
    //     if (values.premium == undefined) { values.premium = false; } else { values.premium = true; }
    //     if (values.myPic == undefined) {
    //       values.myPic = 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.png?alt=media&token=ee7f968c-00c9-4097-8e0b-53f3a3562c05';
    //     }
    //     self.setState({ uid: manoID, username: values.username, age: values.age, language: values.language, checkedMale: values.checkedMale, checkedFemale: values.checkedFemale, interests: values.interests, introduction: values.introduction, xp: values.xp, profilePics: values.profilePics, myPic: values.myPic, premium: values.premium });

    //     // console.log('VALUES USERNAME' + values.username);
    //   })
    //   .catch(() => {
    //     console.log('NIEKO NEGAVAU!');
    //   });
  }

  onButtonPress() {
    const { params } = this.props.navigation.state;
    this.props.navigation.navigate('Chat', { uid: params.uid })
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <View>
        <Button text={strings('Profile.Chat')} style={{
          container: {
            height: 45,
            backgroundColor: '#FF7F00',
            padding: 0,
            width: '100%',
          },
          text: {
            fontSize: 20,
            color: "#fff",
          }
        }}
          upperCase={false}
          onPress={this.onButtonPress.bind(this)} />
      </View>
    );
  }
  render() {
    // The screen's current route is passed in to `props.navigation.state`:

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: '#C3E3E4' }}>
          <View style={{
            borderBottomWidth: 1,
            padding: 20,
            margin: 20,
            backgroundColor: '#fff',
            // justifyContent: 'flex-end',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderColor: '#C3E3E4',
            position: 'relative'
          }}>
            <View style={{ height: 30 }} />
            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
              <View style={{ flex: 6 }}>
                <View style={{ width: '90%' }}>
                  <View style={{ alignItems: 'flex-start', marginLeft: 5, marginBottom: 10 }}>

                    {this.state.premium &&
                      <Icon
                        name='crown'
                        type='foundation'
                        color='#517fa4'
                      />
                    }
                  </View>

                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.labelStyle}>{strings('Profile.username')}</Text>
                    <Text style={styles.inputStyle}>{this.state.username}</Text>
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.labelStyle}>{strings('Profile.age')}</Text>
                    <Text style={styles.inputStyle}>{this.state.age}</Text>
                  </View>
                </View>
              </View>

              <View style={{ flex: 4, justifyContent: 'flex-start', alignItems: 'center',       marginRight:50 }}>
                <Avatar
                  width={220}
                  height={220}
           
                  placeholder="Add \n Photo"
                  source={{
                    uri: this.state.myPic
                  }}
                  activeOpacity={0.7}
                  avatarStyle={{ borderRadius: 120 / 2 }}
                  overlayContainerStyle={{ backgroundColor: 'transparent' }}
                // onPress={() => this.setState({ visibleModal: 6 })}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', flex: 1, marginBottom: 10, marginTop: 10 }}>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.labelStyle}>{strings('Profile.language_learning')}</Text>
                <Text style={styles.inputStyle}>{this.state.language}</Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.labelStyle}>{strings('Profile.interests')}</Text>
                <Text style={{ color: '#000', paddingRight: 5, paddingLeft: 5, fontSize: 15, }}
                  multiline={true}
                  numberOfLines={4}>{this.state.interests}</Text>
              </View>
            </View>
            <Text style={styles.labelStyle}>{strings('Profile.gender')}</Text>
            <View style={{ width: '100%', flexDirection: 'row' }}>
              <View style={{ width: '35%' }}>
                <CheckBox containerStyle={{ borderWidth: 0, paddingLeft: 5, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                  title={strings('Profile.male')}
                  textStyle={{
                    marginLeft: 20, fontSize: 14, fontWeight: 'normal', color: 'grey'
                  }}
                  checkedIcon='check-circle-o'
                  uncheckedIcon='male'
                  checked={this.state.sex == 'male'}
                // onPress={this.onChangeMale.bind(this)}
                />
              </View>
              <View style={{ width: '35%' }}>
                <CheckBox containerStyle={{ borderWidth: 0, paddingLeft: 10, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                  title={strings('Profile.female')}
                  textStyle={{
                    marginLeft: 19, fontSize: 14, fontWeight: 'normal', color: 'grey'
                  }}
                  checkedIcon='check-circle-o'
                  uncheckedIcon='female'
                  checked={this.state.sex == 'Female'}
                // onPress={this.onChangeFemale.bind(this)}
                />
              </View>
            </View>
            <View style={{ flex: 1, marginBottom: 20, marginTop: 10 }}>
              <Text style={styles.labelStyle}>{strings('Profile.introductory_blurb')}</Text>
              <Text style={{ color: '#000000', paddingRight: 5, paddingLeft: 5, fontSize: 15, marginTop: 10 }}
                multiline={true}
                underlineColorAndroid="transparent"
                placeholder={strings('Profile.eg_i')}>{this.state.introduction}</Text>
            </View>
            <View style={{ height: 100 }} />
          </View>

          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>

          <View style={{ width: '100%', paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 20 }}>
            {this.renderButton()}
          </View>
        </ScrollView>
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
    color: '#4C4C4C',
 
    // fontFamily: 'Roboto-regular',
    fontSize: 16,
    paddingLeft: 5,
    // flex: 1 // label occupies 1/3 of the space
  },
  inputStyle: {
    // color: '#7F7F7F',
    color: 'black',
    paddingRight: 5,
    paddingLeft: 5,
    fontFamily: 'Roboto-Light',
    fontSize: 17,
    height: 40
    // lineHeight: 23,
    // flex: 2 // input ocupies 2/3 of the space
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
};

function mapStateToProps(state) {
  return {
      user: state.user,
  }
}

export default connect(mapStateToProps, {})(OtherProfileScreen);
