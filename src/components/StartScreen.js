import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, TouchableOpacity, TouchableHighlight, Image, Platform, SafeAreaView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { connect } from 'react-redux'
import { Avatar, Icon } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import axios from 'react-native-axios';
import styles, { colors } from '../styles/index.style';
import { Games } from '../static/entries';
import * as TopicNames from '../static/TopicNames.json';
import { ThemeProvider, Button } from 'react-native-material-ui';
import ElevatedView from 'react-native-elevated-view'
import Modal from "react-native-modal";
import { Dimensions } from 'react-native';
import { strings } from '../../src/locales/i18n';
import { p } from './common/normalize';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration } from 'react-native-power-translator';
import { showMessage } from "react-native-flash-message";
import { removeInvitation } from './../redux/action'

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

var sendNotification = function (data) {
    var headers = {
        Accept: 'application/json',
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic ZThlM2NkOTItMDIwZS00NTQ4LTk4MWItNDQ0YmNmMTE1NTFk"
    };
    fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then((responseJson) => {
            // console.log(responseJson)
        })
        .catch((error) => {
            // console.log("------------");
            console.error(error);
        });

};

class StartScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        console.log();
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        middleViewWidth = viewportWidth - 56 * 2;
        return {
            title: 'Welcome',
            headerTitle:
                <View style={{ flexDirection: 'row', flex: 1, marginRight: 56 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                            {/* {strings('HomeScreen.home_screen')} */}
                        </Text>
                    </View>
                    {/* <View style={{ width:112, flexDirection:'row',justifyContent:'flex-end', alignItems:'center', paddingRight:15, backgroundColor:'translate'}}>
        <TouchableOpacity style={{marginRight:10}}>
          <Icon
                  color='white'
                  name='ios-notifications'
                  type='ionicon'
                  // type='font-awesome'
                  onPress={() => 
                    // this.props.navigation.navigate('FriendsList')
                    params.handleThis()
                  } 
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name='message'  type='material-community' color='white' 
                onPress={() => 
                  params.openMessages()
                } />
        </TouchableOpacity>
        </View> */}
                </View>
            ,
            headerStyle: {
                backgroundColor: '#2496BE',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerLeft: <View></View>
        }
    };
    constructor(props) {
        super(props);
        // this.state = {
        //     slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        //     ImagesToGuess: ['']
        // };
        this._renderItem = this._renderItem.bind(this);
        this.setThirdModalVisibleTrue = this.setThirdModalVisibleTrue.bind(this);
        this.setFourthModalVisibleTrue = this.setFourthModalVisibleTrue.bind(this);
        // this.state = { languageCode: 'fr' };
    }

    state = {
        email: '',
        password: '',
        error: '',
        checkedMale: false,
        loading: false,
        loggedInUser: true,
        modalVisible: false,
        SecondmodalVisible: false,
        ThirdmodalVisible: false,
        FourthmodalVisible: false,
        ImagesToGuess: [''],
        selectScreenPhase: 0,
        loadingCarousel: true,
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        language: '',
        TopicPictures: {},
        newestMsg: '',
        SelectTab: 1,
        notificationPresent: false
    };

    snapshotToArray(snapshot) {

        var returnArr = [];
        var item = { notEmpty: 'notEmpty' };

        snapshot.forEach(function (childSnapshot) {
            var item = { notEmpty: 'notEmpty' };
            item.myURL = childSnapshot.myURL;
            item.response = childSnapshot.correctResponse;
            item.response2 = childSnapshot.correctResponse2;

            returnArr.push(item);
        });

        return returnArr;
    };

    UNSAFE_componentWillMount() {
        // var self = this;

        // database().ref('/topicsPictures').on('value', function (snapshot) {

        //   const values = snapshot.val();
        //   // console.log(values);

        //   self.setState({ TopicPictures: values });

        // })
        firestore().collection('topics').doc('topicsPictures').get().then(doc => {
            this.setState({ TopicPictures: doc.data() })
        })

    }

    componentDidMount() {
        var message = {
            "app_id": "59a1ed67-ec8a-4cc1-b38a-ec225843a6b0",
            "data": { "foo": "bar" },
            "contents": { "en": "New Content Is Posted By " },
            // included_segments: ["All"],
            // include_player_ids: items,
            "include_player_ids": ["9cfcbe22-950e-4200-8192-8b40a19f8821"]
        };

        //sendNotification(message);

        var self = this;

        this.props.navigation.setParams({
            handleThis: this.setThirdModalVisibleTrue,
            openMessages: this.setFourthModalVisibleTrue
        });

        var selectedWordList = { words: ['airport', 'apartment', 'building', 'bakery', 'bank', 'barber', 'store', 'cafe', 'cathedral', 'church'] }
        var selectedGame = { screenTitle: 'SayTheImage' }
        this.setState({ selectedGame })
        this.setState({ selectedWordList })
        // console.log(this.state.myUser)
        // console.log(this.state.selectedWordList.words) 
        this.setState({ TopicNameForTextToText: 'Places1' });

        // database().ref().child('users').child(currentUser.uid).child('messages').orderByChild('seen').equalTo(false).on('value', function (snapshot) {
        //   console.log(snapshot.val());
        //   if (snapshot.val()) {
        //     self.setState({ notificationPresent: true });
        //     console.log('*********************** TENGO SEEEN *********************')
        //   }
        // }).catch(error=>{
        //   console.log(error.message)
        // });

        var lukas = this.props.user.pendDrawings;
        // if (result.Invitations != undefined) {
        // var invitations = this.props.user.Invitations;
        // self.setState({invitations});
        // }
        // var username = results.username;
        // self.setState({username});


        // console.log(lukas);

        var data = [];
        // var myInvitations = [];

        // for (var oneInv in invitations) {
        //   invitations[oneInv].drawingId = oneInv
        //   myInvitations.push(invitations[oneInv]);
        // }

        // console.log(myInvitations);

        for (var drawId in lukas) {
            lukas[drawId].drawingId = drawId
            data.push(lukas[drawId]);
        }

        this.setState({ ImagesToGuess: data });
        // console.log(data);
        // this.setState({ invitations: myInvitations });
        // console.log(result.languageNative);
        firestore().collection('topics').doc(`${this.props.lang.languageNative}`).get().then(doc => {
            const mytopics = doc.data();
            // console.log(mytopics);
            // var withNoDigits = questionText.replace(/[0-9]/g, '');

            var newData = [];
            for (var property in mytopics) {
                var numNameTemp = property.replace(/[0-9]/g, '');
                var numName = "num".concat(numNameTemp)

                var myObj = { notEmpty: 'notEmpty' };
                // console.log(property);
                // console.log(TopicNames[property]);
                myObj.title = this.capitalizeFirstLetter(property);
                // console.log(myObj.title);
                myObj.realTitle = property;
                myObj.PTtitle = TopicNames[property];
                myObj.numbers = TopicNames[numName];
                var mineProp = this.state.TopicPictures;
                // console.log(mineProp);

                myObj.illustration = mineProp[property];
                myObj.words = mytopics[property];
                newData.push(myObj)
            }
            this.setState({ Topics: newData });
            // console.log(newData);

            firestore().collection('chat').where('user', 'array-contains', 'FmIfeWNRGIh2s9iStQberUXIrgA3').get().then(snapshot => {
                var conversionID = null
                for (const doc of snapshot.docs) {
                    const user = doc.data().user
                    if (user.includes(this.props.user.uid)) {
                        conversionID = doc.id
                        break
                    }
                }
                if (conversionID) {
                    firestore().collection('chat').doc(conversionID).collection('msg').where(this.props.user.uid + '_state', '==', 'unread').limit(1).get().then(snapshot => {
                        if (snapshot.docs.length > 0) {
                            const time = snapshot.docs[0].id
                            const d = new Date(time)
                            const niceDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                            this.setState({ newestMsg: niceDate });
                        }
                    })
                }
            })
            // database().ref().child('chat').child(`/${this.props.user.uid}-FmIfeWNRGIh2s9iStQberUXIrgA3`).orderByChild('uid').equalTo('FmIfeWNRGIh2s9iStQberUXIrgA3').limitToLast(1)
            //     .once('value', snapIt => {
            //       const MyNewestResult = snapIt.val();

            //       for (var property in MyNewestResult) {
            //         // console.log(property);
            //         if (MyNewestResult[property].seen == false) {
            //           var latestMsg = MyNewestResult[property].createdAt;
            //           var d = new Date(latestMsg);
            //           var niceDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
            //           self.setState({ newestMsg: niceDate });
            //         }
            //       }

            //     })

        })

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    setSecondModalVisible(visible) {
        this.setState({ SecondmodalVisible: visible });
    }

    setThirdModalVisibleTrue() {
        this.setState({ ThirdmodalVisible: true });
    }

    setFourthModalVisibleTrue() {
        this.setState({ FourthmodalVisible: true });
    }

    setThirdModalVisible(visible) {
        this.setState({ ThirdmodalVisible: visible });
    }

    setFourthModalVisible(visible) {
        this.setState({ FourthmodalVisible: visible });
    }

    changeStateModal(image) {
        const { navigate } = this.props.navigation;

        this.setState({ modalVisible: false });
        navigate('PendingDrawing', image);
    }

    handleLanguage = (langValue) => {
        this.setState({ language: langValue });
        // console.log(langValue);
    }

    FirstSelectGame = (item) => {
        if (item.hasOwnProperty('stage')) {
            // console.log('IF ISIVERTINO I STAGE -----------');
            this.setState({ selectedGame: item });
            this.setState({ selectScreenPhase: 2 });
        } else {
            // console.log(item);
            var TextRealTitle = item.realTitle;
            this.setState({ selectedWordList: item });
            this.setState({ selectScreenPhase: 3 });
            this.setState({ TopicNameForTextToText: TextRealTitle });
        }
    }

    _renderItem({ item, index }) {


        var even = (index + 1) % 2 === 0;

        if (typeof (this.props.user) != 'undefined') {
            if (this.props.lang.languageLearning == 'Portuguese') {
                // console.log('ANGLISKAIS')
                var showTitle = item.title;
            } else {
                // console.log('PORTUGALISKAS');
                var showTitle = item.PTtitle;
            }
        }

        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        var baseOne = viewportWidth;
        // console.log(item);
        if (viewportHeight < viewportWidth) {
            baseOne = viewportHeight;
        }
        var frameWidth = baseOne * 0.3; //this should be same to itemWidth
        var frameHeight = baseOne * 0.25;
        var frameMargin = 0;

        return (
            <View style={{ width: frameWidth, height: frameHeight, padding: 5, backgroundColor: 'transparent' }}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '100%', height: '100%' }}
                    onPress={() => { this.FirstSelectGame(item) }}
                >
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: frameMargin,
                        right: frameMargin,
                        bottom: 18,
                        shadowColor: colors.black,
                        shadowOpacity: 0.25,
                        shadowOffset: { width: 0, height: 10 },
                        shadowRadius: 10,
                        borderRadius: 0
                    }} />
                    <View style={[{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 16,
                        backgroundColor: '#0076B6',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    },
                    even ? { backgroundColor: '#0076B6' } : {}]}>
                        <Text
                            style={[{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 7,
                                fontWeight: 'bold',
                                letterSpacing: 0.5
                            }]}
                            numberOfLines={2}
                        >
                            {showTitle}
                        </Text>
                        {/* <Text
                  style={[Mystyles.subtitle, even ? Mystyles.subtitleEven : {}]}
                  numberOfLines={2}
                >
                    Something...
                </Text> */}
                    </View>
                    <View style={[{
                        flex: 1,
                        marginBottom: 0, // Prevent a random Android rendering issue
                        backgroundColor: 'white',
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                    },
                    even ? { backgroundColor: 'black' } : {}]}>
                        <Image
                            source={{ uri: item.illustration }}
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                resizeMode: 'cover',
                                borderRadius: 0,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0
                            }}
                        />
                        <View style={[{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 0,
                            backgroundColor: 'white'
                        },
                        even ? { backgroundColor: colors.black } : {}]} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    capitalizeFirstLetter(string) {
        var title = string.replace(/[0-9]/g, " $&");
        var title2 = title.charAt(0).toUpperCase() + title.slice(1);
        return title2;
    }
    mainExample(dataForCarousel, titleBuy, title) {
        const { slider1ActiveSlide } = this.state;
        // console.log(dataForCarousel);
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

        var baseOne = viewportWidth;
        if (viewportHeight < viewportWidth) {
            baseOne = viewportHeight;
        }
        var frameWidth = baseOne * 0.3; //this should be same to itemWidth
        const carouselWidth = viewportWidth;
        const itemHMargin = 0; // viewportWidth*0.02
        const itemWidth = baseOne * 0.3;//viewportWidth*0.3;//-itemHMargin;
        return (
            <View style={{ paddingVertical: 30 }}>
                <Text style={{
                    paddingHorizontal: 30, backgroundColor: 'transparent', color: 'rgba(255, 255, 255, 0.9)', fontSize: 20, fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {/* {'${titleBuy}'} */}
                </Text>
                <Text style={{
                    marginTop: 5, paddingHorizontal: 30, backgroundColor: 'transparent', color: 'rgba(255, 255, 255, 0.75)', fontSize: 13,
                    fontStyle: 'italic', textAlign: 'center'
                }}>
                    {title}
                </Text>
                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={dataForCarousel}
                    renderItem={this._renderItem}
                    sliderWidth={carouselWidth}
                    itemWidth={itemWidth}
                    // hasParallaxImages={true}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.5}
                    // inactiveSlideShift={20}
                    containerCustomStyle={{ backgroundColor: 'transparent', marginTop: 15, overflow: 'visible' }}
                    contentContainerCustomStyle={{ paddingVertical: 10 }}
                    loop={true}
                    loopClonesPerSide={2}
                    //   autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                />
            </View>
        );
    }

    renderModalContent() {

        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#C3E3E4' }}>
                <ElevatedView style={{ width: '100%', height: 60, backgroundColor: '#2496BE' }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => {
                                this.setModalVisible(!this.state.modalVisible)
                            }}>
                                {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
                                <Icon name='arrow-left' type='feather' color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                {strings('PendingDrawing.you_can')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', paddingRight: 15 }}>
                            {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
                            {/* <Icon name='home'  type='FontAwesome' color='white'/> */}
                        </View>
                    </View>
                </ElevatedView>
                <ScrollView style={{ padding: 25 }}>
                    {this.state.ImagesToGuess.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => this.changeStateModal(image)}>
                            <View style={{ width: '100%', backgroundColor: 'white' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F00' }}>
                                    <Text style={{ fontSize: 18, color: 'white' }}>
                                        New Challenge
                  </Text>
                                </View>
                                <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: 150, height: 150, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            style={{
                                                alignSelf: 'center',
                                                height: 150,
                                                width: 150,
                                                borderWidth: 1,
                                                borderRadius: 95
                                            }}
                                            source={{ uri: image.myURL }}
                                            resizeMode="stretch"
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 10 }}></View>
                        </TouchableOpacity>

                    ))}
                </ScrollView>
            </View>
        )
    }

    renderThirdModalContent() {

        const { navigate } = this.props.navigation;
        // console.log(this.state.invitations);

        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#C3E3E4' }}>
                <ElevatedView style={{ width: '100%', height: 60, backgroundColor: '#2496BE' }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => {
                                this.setThirdModalVisible(!this.state.ThirdmodalVisible)
                            }}>
                                {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
                                <Icon name='arrow-left' type='feather' color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                {strings('HomeScreen.notifications')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', paddingRight: 15 }}>
                            {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
                            {/* <Icon name='home'  type='FontAwesome' color='white'/> */}
                        </View>
                    </View>
                </ElevatedView>
                <ScrollView style={{ width: '100%', padding: 25 }}>
                    {
                        Object.keys(this.props.Invitations).map((key, index) => (
                            <TouchableOpacity style={{ width: '100%', backdropColor: 'white' }} key={index} onPress={() => {
                                this.setThirdModalVisible(!this.state.ThirdmodalVisible)
                                // var deleteInvitation = database().ref(`/users/${currentUser.uid}/Invitations`);    //pEg path is company/employee                
                                //     deleteInvitation.child(item).remove();
                                // var deleteInvitation = database().ref(`/users/${currentUser.uid}/Invitations`);    //Eg path is company/employee                
                                // deleteInvitation.child(item.drawingId).remove();
                                this.props.removeInvitation(key)
                                firestore().collection('user').doc(this.props.user.uid).collection('Invitations').doc(key).delete()
                                // survey.child(user.uid).remove()
                                navigate(this.props.Invitations[key].game, { words: this.props.Invitations[key].words, myUser: this.props.Invitations[key].myUser, topicwords: this.props.Invitations[key].WordsFromTopic, TextToTextTitle: this.props.Invitations[key].TextToTextTitle })
                            }}>
                                {/* <RatingButton rating={rating} onButtonPress={this.onButtonPress} /> */}
                                <View style={{ padding: 15, width: '100%', flexDirection: 'row', backgroundColor: 'white' }}>
                                    <View style={{ width: 60, height: 60 }}>
                                        <Image style={{
                                            flex: 1,
                                            width: 60,
                                            height: 60,
                                            justifyContent: 'center',
                                        }} source={require('../assets/orange-noti.png')}
                                        />
                                    </View>
                                    <View style={{ flex: 9, paddingLeft: 15, width: 100, height: 60, justifyContent: 'center', backgroundColor: 'transparent' }}>
                                        <Text style={{ fontSize: 18 }}>{this.props.Invitations[key].myUser && this.props.Invitations[key].myUser.username}</Text>
                                        <Text style={{ fontSize: 12, marginTop: 5 }}>Invited you to Play {this.props.Invitations[key].game}</Text>
                                        <Text></Text>
                                    </View>
                                    <View style={{ flex: 1, height: 60, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent' }}>
                                        <View style={{ width: 20, height: 20 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 20,
                                                height: 20,
                                                justifyContent: 'center',
                                            }} source={require('../assets/noti-right.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: '100%', height: 10 }}></View>
                                {/* <Image
              style={{
                alignSelf: 'center',
                height: 200,
                width: 200,
                borderWidth: 1,
                borderRadius: 95
              }}
              source={{uri:image.myURL}}
              resizeMode="stretch"
            /> */}

                                {/* </Button> */}
                            </TouchableOpacity>

                        ))}
                </ScrollView>
            </View>
        )
    }


    renderFourthModalContent() {

        const { navigate } = this.props.navigation;
        // console.log(this.state.invitations);

        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#C3E3E4' }}>
                <ElevatedView style={{ width: '100%', height: 60, backgroundColor: '#2496BE' }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => {
                                this.setFourthModalVisible(!this.state.FourthmodalVisible)
                            }}>
                                {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
                                <Icon name='arrow-left' type='feather' color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                {strings('HomeScreen.notifications')}

                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', paddingRight: 15 }}>
                            {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
                            {/* <Icon name='home'  type='FontAwesome' color='white'/> */}
                        </View>
                    </View>
                </ElevatedView>
                <ScrollView style={{ width: '100%', padding: 25 }}>
                    {/* {this.state.invitations.map((item, index) => ( */}
                    {this.state.newestMsg != '' &&
                        <TouchableOpacity style={{ width: '100%', backdropColor: 'white' }} onPress={() => {
                            this.setFourthModalVisible(!this.state.FourthmodalVisible)
                            // var deleteInvitation = database().ref(`/users/${currentUser.uid}/Invitations`);    //Eg path is company/employee                
                            //     deleteInvitation.child(item).remove();
                            navigate('Chat', { uid: 'FmIfeWNRGIh2s9iStQberUXIrgA3' })
                        }}>
                            {/* <RatingButton rating={rating} onButtonPress={this.onButtonPress} /> */}
                            <View style={{ padding: 15, width: '100%', flexDirection: 'row', backgroundColor: 'white' }}>
                                <View style={{ width: 60, height: 60 }}>
                                    <Image style={{
                                        flex: 1,
                                        width: 60,
                                        height: 60,
                                        justifyContent: 'center',
                                    }} source={require('../assets/orange-noti.png')}
                                    />
                                </View>
                                <View style={{ flex: 9, paddingLeft: 15, width: 100, height: 60, justifyContent: 'center', backgroundColor: 'transparent' }}>
                                    <Text style={{ fontSize: 18 }}>YakVernac Support</Text>
                                    <Text style={{ fontSize: 12, marginTop: 5 }}>wrote you a message on {this.state.newestMsg}</Text>
                                    <Text></Text>
                                </View>
                                <View style={{ flex: 1, height: 60, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent' }}>
                                    <View style={{ width: 20, height: 20 }}>
                                        <Image style={{
                                            flex: 1,
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                        }} source={require('../assets/noti-right.png')}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 10 }}></View>
                            {/* <Image
              style={{
                alignSelf: 'center',
                height: 200,
                width: 200,
                borderWidth: 1,
                borderRadius: 95
              }}
              source={{uri:image.myURL}}
              resizeMode="stretch"
            /> */}

                            {/* </Button> */}
                        </TouchableOpacity>
                    }
                    {/* ))} */}
                </ScrollView>
            </View>
        )
    }

    onSendToFriend() {
        const { friendsNick } = this.state;

        // this.getRef().child("users").child(user.uid).child("friends").child(rowId)
        //     .set(row)
        //     .then(() => {

        //     this.setState({ loading: false })

        //   })
        //   .catch(() => {
        //     console.log('NEIRASE I DB !!!')
        //   })

        // navigate(this.state.selectedGame.screenTitle, { words: this.state.selectedWordList.words, myUser: this.state.myUser })
        var invitation = {
            game: this.state.selectedGame.screenTitle,
            words: this.state.selectedWordList.words,
            // myUser: this.props.user,
            TextToTextTitle: this.state.TopicNameForTextToText,
            WordsFromTopic: this.state.selectedWordList.words
        }
        firestore().collection('user').where('username', '==', `${friendsNick}`).get().then(snapshot => {
            for (const doc of snapshot.docs) {
                const friend = doc.data()
                if (friend) {
                    const friendID = doc.id;
                    firestore().collection('user').doc(friendID).collection('Invitations').doc(this.props.user.uid).set(invitation)
                }
            }
            this.setSecondModalVisible(false);
            this.setState({ selectScreenPhase: 0 })
        })
        // database().ref().child('users').orderByChild('username').equalTo(`${friendsNick}`)
        //   .once('value', function (snap) {

        //     // console.log(snap);

        //     if (snap.val() == undefined) {
        //       this.setState({ error: 'There is no user with the provided email!' })
        //     } else {
        //       // var userId = snap.node_.children_.root_.key;
        //       var userId = snap.node_.children_.root_.key;
        //       // console.log(userId);

        //       database().ref(`/users/${userId}/Invitations`)
        //         .push(invitation)
        //         .then(() => {
        //           // console.log('VISKAS KO REIKIA - TAI GERAI NU');
        //           this.setSecondModalVisible(false);
        //           this.setState({ selectScreenPhase: 0 })
        //           // console.log('VISKAS KO REIKIA - TAI GERAI NU 2222');

        //         })
        //         .catch(() => {
        //           // this.setState({selectScreenPhase:1})
        //           // console.log('VISKAS KO REIKIA - TAI GERAI NU');
        //           // this.setSecondModalVisible(!this.state.SecondmodalVisible);
        //           console.log('IRASO, BET EINA I CATCH :(')
        //         })
        //     }
        //   })

    }

    renderSelectScreens() {
        const { navigate } = this.props.navigation;
        // console.log(this.state.selectedGame);
        var game = this.state.selectedGame;
        var topic = this.state.selectedWordList;

        if (typeof (game) != 'undefined' && typeof (this.props.user) != 'undefined') {
            if (this.props.lang.languageLearning == 'Portuguese') {
                var selectedGameTitle = game.title;
            } else {
                var selectedGameTitle = game.PTtitle;
            }
        }

        if (typeof (topic) != 'undefined' && typeof (this.props.user) != 'undefined') {
            if (this.props.lang.languageLearning == 'Portuguese') {
                var selectedTopicTitle = topic.title;
            } else {
                var selectedTopicTitle = topic.PTtitle;
            }
        }

        if (this.state.SelectTab == 3) {
            return (
                <View>
                    <View style={{ width: '100%', paddingHorizontal: 90, marginBottom: 20 }}>
                        <Button text={selectedGameTitle}
                            style={{
                                container: {
                                    height: 45,
                                    backgroundColor: '#FF7F00',
                                    padding: 0,
                                    width: '100%',
                                },
                                text: {
                                    fontSize: 18,
                                    color: "#fff",
                                }
                            }}
                            upperCase={false}
                            onPress={() => this.setState({ selectScreenPhase: 1 })} />
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 90, marginBottom: 20 }}>
                        <Button text={selectedTopicTitle}
                            style={{
                                container: {
                                    height: 45,
                                    backgroundColor: '#FF7F00',
                                    padding: 0,
                                    width: '100%',
                                },
                                text: {
                                    fontSize: 18,
                                    color: "#fff",
                                }
                            }}
                            upperCase={false}
                            onPress={() => this.setState({ selectScreenPhase: 2 })} />
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 100, marginBottom: 20 }}>
                        <Button text={strings('Create.invite')}
                            style={{
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
                            onPress={() => this.setSecondModalVisible(!this.state.SecondmodalVisible)} />
                    </View>
                    {/* <Modal
            backdropColor={'black'}
            backdropOpacity={0.5}
            animationType="slide"
            transparent={true}
            isVisible={this.state.SecondmodalVisible}
            onRequestClose={() => {
              this.setSecondModalVisible(!this.state.SecondmodalVisible);
            }}>
            <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                  {strings('CreateInvite.invite_your')}
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                    this.setSecondModalVisible(!this.state.SecondmodalVisible);
                  }}>
                    <Icon
                      color='white'
                      size={25}
                      name='circle-with-cross'
                      type='entypo'
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{width:'100%',justifyContent:'center', alignItems:'center'}}>
                <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center',}}></View>
                  <View style={{width:'100%', height:50, justifyContent:'center', alignItems:'center',}}>
                    <TextInput
                      style={{ fontSize:18, width:'70%',backgroundColor:'#FFFFFF', borderRadius:3, borderWidth:0, borderColor:'#E0E0E0' }}
                      placeholder={strings('CreateInvite.friends_nickname')}
                      placeholderTextColor = "#D4D4D4"
                      value={this.state.friendsNick}
                      onChangeText={friendsNick => this.setState({ friendsNick })}
                    />
                  </View>          
                  <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center'}}></View>
                  <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:200,}}>
                      <Button text={strings('CreateInvite.send')}
                        style={{
                          container: {
                          height: 45,
                          backgroundColor: '#2496BE',
                          padding: 0,
                          width: '100%',
                          },
                          text: {
                            fontSize: 20,
                            color: "#fff",
                          }
                        }}
                        upperCase={false}
                        onPress={this.onSendToFriend.bind(this)} />
                    </View>
                  </View>
                  <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center'}}></View>
              </View>
            </ElevatedView>
            </View>
          </Modal> */}

                </View>
            );
        }
        else {
            return (null);
        }

        switch (this.state.selectScreenPhase) {
            case 0:
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 350, backgroundColor: 'transparent' }}>
                        {/* <Button text={strings('HomeScreen.select')} style={{container: {
              height: 45,
              backgroundColor: '#FF7F00',
              padding: 0,
              width: '50%',
            },
            text: {
              fontSize: 20,
              color: "#fff",
            }}}
              upperCase={false}
              onPress={() => this.setState({selectScreenPhase:1})} /> */}
                    </View>
                    // <Button 
                    // title='Select'
                    // onPress={() => this.setState({selectScreenPhase:1})}/>

                )
            case 1:
                return (
                    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 350, backgroundColor: 'transparent' }}>
                                <ScrollView>
                                    {this.mainExample(Games, 'Choose a Game', '', 1)}
                                </ScrollView>
                            </View>
                        </View>
                    </SafeAreaView>
                )
            case 2:

                return (
                    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                        <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            {/* <View style={{width:60,height:60,marginBottom:10, justifyContent:'center',alignItems:'center'}}>
                <Image style={{
                  flex: 1,
                  width: 60,
                  height: 60,
                  justifyContent: 'center',
                    }} source={require('../assets/edit.png')} 
                />
            </View> */}
                        </View>
                        <View style={{ width: '100%', paddingHorizontal: 90 }}>
                            <Button text={selectedGameTitle}
                                style={{
                                    container: {
                                        height: 45,
                                        backgroundColor: '#FF7F00',
                                        padding: 0,
                                        width: '100%',
                                    },
                                    text: {
                                        fontSize: 18,
                                        color: "#fff",
                                    }
                                }}
                                upperCase={false}
                                onPress={() => this.setState({ selectScreenPhase: 1 })} />
                        </View>
                        {/* <Button
          title={this.state.selectedGame.title}
          onPress={() => this.setState({selectScreenPhase:1})}/> */}

                        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                            <Text>{this.state.FirstSelectGame}</Text>
                            <ScrollView>
                                {this.mainExample(this.state.Topics, 'Select a Topic', '', 2)}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                )
            case 4:
                // console.log(this.state.selectedWordList.words);
                return (
                    <View>
                        <View style={{ width: '100%', paddingHorizontal: 90, marginBottom: 20 }}>
                            <Button text={selectedGameTitle}
                                style={{
                                    container: {
                                        height: 45,
                                        backgroundColor: '#FF7F00',
                                        padding: 0,
                                        width: '100%',
                                    },
                                    text: {
                                        fontSize: 18,
                                        color: "#fff",
                                    }
                                }}
                                upperCase={false}
                                onPress={() => this.setState({ selectScreenPhase: 1 })} />
                        </View>
                        <View style={{ width: '100%', paddingHorizontal: 90, marginBottom: 20 }}>
                            <Button text={selectedTopicTitle}
                                style={{
                                    container: {
                                        height: 45,
                                        backgroundColor: '#FF7F00',
                                        padding: 0,
                                        width: '100%',
                                    },
                                    text: {
                                        fontSize: 18,
                                        color: "#fff",
                                    }
                                }}
                                upperCase={false}
                                onPress={() => this.setState({ selectScreenPhase: 2 })} />
                        </View>

                        {/* <View style={{width:'100%', paddingHorizontal:100, marginBottom:20}}>
            <Button text={strings('Create.start')}
            style={{
              container: {
              height: 45,
              backgroundColor: '#F74B00',
              padding: 0,
              width: '100%',
              },
              text: {
                fontSize: 20,
                color: "#fff",
              }
            }}
            upperCase={false}
            onPress={() => navigate(this.state.selectedGame.screenTitle, { words: this.state.selectedWordList.words, myUser: this.state.myUser, topicwords: this.state.selectedWordList.words, TextToTextTitle:this.state.TopicNameForTextToText })} />
            </View> */}
                        <View style={{ width: '100%', paddingHorizontal: 100, marginBottom: 20 }}>
                            <Button text={strings('Create.invite')}
                                style={{
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
                                onPress={() => this.setSecondModalVisible(!this.state.SecondmodalVisible)} />
                        </View>
                        {/* <Modal
            backdropColor={'black'}
            backdropOpacity={0.5}
            animationType="slide"
            transparent={true}
            isVisible={this.state.SecondmodalVisible}
            onRequestClose={() => {
              this.setSecondModalVisible(!this.state.SecondmodalVisible);
            }}>
            <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                  {strings('CreateInvite.invite_your')}
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                    this.setSecondModalVisible(!this.state.SecondmodalVisible);
                  }}>
                    <Icon
                      color='white'
                      size={25}
                      name='circle-with-cross'
                      type='entypo'
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{width:'100%',justifyContent:'center', alignItems:'center'}}>
                <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center',}}></View>
                  <View style={{width:'100%', height:50, justifyContent:'center', alignItems:'center',}}>
                    <TextInput
                      style={{ fontSize:18, width:'70%',backgroundColor:'#FFFFFF', borderRadius:3, borderWidth:0, borderColor:'#E0E0E0' }}
                      placeholder={strings('CreateInvite.friends_nickname')}
                      placeholderTextColor = "#D4D4D4"
                      value={this.state.friendsNick}
                      onChangeText={friendsNick => this.setState({ friendsNick })}
                    />
                  </View>          
                  <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center'}}></View>
                  <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:200,}}>
                      <Button text={strings('CreateInvite.send')}
                        style={{
                          container: {
                          height: 45,
                          backgroundColor: '#2496BE',
                          padding: 0,
                          width: '100%',
                          },
                          text: {
                            fontSize: 20,
                            color: "#fff",
                          }
                        }}
                        upperCase={false}
                        onPress={this.onSendToFriend.bind(this)} />
                    </View>
                  </View>
                  <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center'}}></View>
              </View>
            </ElevatedView>
            </View>
          </Modal> */}

                    </View>
                )
        }
    }

    getStyles() {
        return {
            container: {
                padding: 40,
                backgroundColor: '#FAFAFA',
            },
            section: {
                marginTop: 15,
                marginBottom: 15,
            },
            title: {
                marginTop: 80,
                marginBottom: 5,
                fontWeight: 'bold',
                fontSize: 38,
                lineHeight: 38
            },
            subtitle: {
                color: '#B3B3B3',
            },
            p: {
                color: '#828280',
                lineHeight: 24
            },
            languageBar: {
                flexDirection: 'row',
                justifyContent: 'space-between'
            },
            languageBarItem: {
                color: '#828280',
            }
        }
    }

    changeLanguage(languageCode) {
        this.setState({ languageCode: languageCode });
    }

    signOutUser = async () => {
        const { navigate } = this.props.navigation;
        try {
            await auth().signOut();
            // navigate('Home');
            navigate('Auth');
        } catch (e) {
            console.log(e);
        }
    }

    increment_last(v) {
        return v.replace(/[0-9]+(?!.*[0-9])/, function (match) {
            return parseInt(match, 10) + 1;
        });
    }

    SetATopic(item, i) {

        // var trueTopic = i - 1;
        var topics = this.state.Topics;
        var a = item.replace(new RegExp("[0-9]", "g"), i)
        // var item = this.state.Topics[a];

        var myItem = topics.find(topic => topic.title === a);
        // console.log(a);
        var TextRealTitle = myItem.realTitle;
        this.setState({ selectedWordList: myItem });
        this.setState({ SelectTab: 2 })
        this.setState({ TopicNameForTextToText: TextRealTitle });
    }

    selectDropdownTopic(newTitle) {
        if (newTitle == this.state.selectedTitleTopic) {
            this.setState({ selectedTitleTopic: '' })
        } else {
            this.setState({ selectedTitleTopic: newTitle })
        }

    }
    renderHeaderTitle(tapno) {
        switch (this.state.SelectTab) {
            case 1:
                return (strings('HomeScreen.click_to_learn'));
            case 2:
                return (strings('HomeScreen.improve_my_skills'));
            case 3:
                return ('');
        }
    }

    BuyPremium() {
        showMessage({
            message: 'Premium required!',
            description: 'Please buy Premium in order to access this topic.',
            type: "danger",
        });
    }

    renderIfUnique(item, index, length) {
        var checkTitle = item.title;
        var PTtitle = item.PTtitle;
        var colTransparent = 'transparent';
        var colConnectLine = '#63B1DC';
        var colUpLine = colConnectLine;
        var colDownLine = colConnectLine;
        var colDivideLine = colConnectLine;
        if (index == 0) {
            colUpLine = colTransparent;
        }
        if (index === length - 1) {
            colDownLine = colTransparent;
            colDivideLine = colTransparent;
        }
        if (checkTitle.includes("1")) {
            // var newTitle = checkTitle.replace(/[0-9]/g, '');
            // console.log(this.state.myUser.languageLearning);
            if (this.props.lang.languageLearning == 'English') {
                var newTitle = PTtitle.replace(/[0-9]/g, '');
            } else {
                var newTitle = checkTitle.replace(/[0-9]/g, '');
            }
            // console.log(item); 
            let table = [];

            // console.log(newTitle);
            // console.log(selectedTitleTopic);

            // if (newTitle == selectedTitle) {
            //   <View style={{flexDirection: 'row'}}>
            //     {table}
            //   </View>
            // }

            // Outer loop to create parent
            for (let i = 1; i <= item.numbers; i++) {
                if (newTitle == this.state.selectedTitleTopic) {
                    if (this.props.user.premium || i <= 2) {
                        table.push(
                            <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.SetATopic(checkTitle, i)} style={{ width: 20, height: 20, borderRadius: 100 / 2, backgroundColor: '#84BCD5', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{i}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    } else {
                        table.push(
                            <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.BuyPremium()} style={{ width: 20, height: 20, borderRadius: 100 / 2, backgroundColor: '#588aa1', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{i}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }
            }

            switch (this.state.SelectTab) {
                case 1:
                    return (
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            {/* <Text onPress={() => this.selectDropdownTopic(newTitle)}>{newTitle}</Text>
            
            <View style={{flexDirection: 'row'}}>
              {table}
            </View> */}
                            <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                </View>
                                <View style={{ width: '80%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: 1, height: '50%', backgroundColor: colUpLine, position: 'absolute', left: '50%', top: 0 }} />
                                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#63B1DC' }} />
                                    <View style={{ width: 1, height: '50%', backgroundColor: colDownLine, position: 'absolute', left: '50%', bottom: 0 }} />
                                </View>
                            </View>
                            <View style={{ width: '70%', flexDirection: 'row', borderBottomColor: colDivideLine, borderBottomWidth: 1 }}>
                                <View style={{ width: '40%' }}>
                                    <View style={{ width: '100%', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 16, color: '#009CD7' }} onPress={() => this.selectDropdownTopic(newTitle)}>{newTitle}</Text>
                                        <Icon
                                            size={30}
                                            color='#F47A5B'
                                            name='angle-right'
                                            type='font-awesome'>
                                        </Icon>
                                    </View>
                                </View>
                                <View style={{ width: '60%' }}>
                                    {(table.length > 0) ? (
                                        <View style={{ widows: '100%', flexDirection: 'row' }}>
                                            <View style={{ width: '10%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <View style={{
                                                    width: 0,
                                                    height: 0,
                                                    right: 0,
                                                    backgroundColor: 'transparent',
                                                    borderStyle: 'solid',
                                                    borderTopWidth: 10,
                                                    borderRightWidth: 15,
                                                    borderBottomWidth: 10,
                                                    borderTopColor: 'transparent',
                                                    borderBottomColor: 'transparent',
                                                    borderRightColor: '#BED7D7'
                                                }}>
                                                </View>
                                            </View>
                                            <View style={{ width: '90%' }}>
                                                <View style={{
                                                    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginRight: 20, marginBottom: 10,
                                                    paddingLeft: 0, paddingTop: 10, paddingRight: 0, paddingBottom: 10, backgroundColor: '#BED7D7'
                                                }}>
                                                    {table}
                                                    {/* <View style={{ width:30,height:30, justifyContent:'center', alignItems:'center'}}>
                          <View style={{ width: 20, height: 20, borderRadius: 100/2,backgroundColor: '#84BCD5', justifyContent:'center', alignItems:'center' }}>
                            <Text style={{ fontSize:16, fontWeight:'bold', color:'white'}}>1</Text>
                          </View>
                        </View>
                        <View style={{ width:30,height:30, justifyContent:'center', alignItems:'center'}}>
                          <View style={{ width: 20, height: 20, borderRadius: 100/2,backgroundColor: '#84BCD5', justifyContent:'center', alignItems:'center' }}>
                              <Text style={{ fontSize:16, fontWeight:'bold', color:'white'}}>2</Text>
                          </View>
                        </View>
                        <View style={{ width:30,height:30, justifyContent:'center', alignItems:'center'}}>
                          <View style={{ width: 20, height: 20, borderRadius: 100/2,backgroundColor: '#84BCD5', justifyContent:'center', alignItems:'center' }}>
                            <Text style={{ fontSize:16, fontWeight:'bold', color:'white'}}>3</Text>
                          </View>
                        </View>
                        <View style={{ width:30,height:30, justifyContent:'center', alignItems:'center'}}>
                          <View style={{ width: 20, height: 20, borderRadius: 100/2,backgroundColor: '#84BCD5', justifyContent:'center', alignItems:'center' }}>
                            <Text style={{ fontSize:16, fontWeight:'bold', color:'white'}}>4</Text>
                          </View>
                        </View> */}
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                            <View style={{ width: '100%', height: 70 }}>
                                            </View>
                                        )}
                                </View>
                            </View>
                        </View>
                    )
                case 3:
                    return (
                        <View style={{ width: '100%', paddingHorizontal: 100, marginBottom: 20 }} />
                    )
            }
        }
    }

    SetAGame(topics) {
        var item = topics[Math.floor(Math.random() * topics.length)];
        this.setState({ selectedGame: item });
        this.setState({ SelectTab: 3 });
    }

    renderIfUnique2() {

        const { navigate } = this.props.navigation;
        var colTransparent = 'transparent';
        var colConnectLine = '#63B1DC';
        var colUpLine = colConnectLine;
        var colDownLine = colConnectLine;
        var colDivideLine = colConnectLine;
        // return table
        switch (this.state.SelectTab) {
            case 2:
                return (
                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '40%', height: 60, justifyContent: 'center', alignItems: 'center', borderBottomColor: colDivideLine, borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 16, color: '#009ECC' }} onPress={() => this.SetAGame([Games[2]])}>{strings('HomeScreen.speaking')}</Text>
                            </View>
                            <View style={{ width: '20%', height: 60 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 1, height: '50%', backgroundColor: colTransparent, position: 'absolute', left: '50%', top: 0 }} />
                                    <View style={{ width: 1, height: '50%', backgroundColor: colDownLine, position: 'absolute', left: '50%', bottom: 0 }} />
                                    <View style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#63B1DC' }} >
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 25,
                                                height: 25,
                                                justifyContent: 'center',
                                                resizeMode: 'stretch',
                                            }} source={require('../assets/mouth.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '40%' }}>
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '40%', height: 60, justifyContent: 'center', alignItems: 'center', borderBottomColor: colDivideLine, borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 16, color: '#009ECC' }} onPress={() => this.SetAGame([Games[2], Games[4]])}>{strings('HomeScreen.listening')}</Text>
                            </View>
                            <View style={{ width: '20%', height: 60 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 1, height: '50%', backgroundColor: colUpLine, position: 'absolute', left: '50%', top: 0 }} />
                                    <View style={{ width: 1, height: '50%', backgroundColor: colDownLine, position: 'absolute', left: '50%', bottom: 0 }} />
                                    <View style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#63B1DC' }} >
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 25,
                                                height: 25,
                                                justifyContent: 'center',
                                                resizeMode: 'stretch',
                                            }} source={require('../assets/ear.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '40%' }}>
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '40%', height: 60, justifyContent: 'center', alignItems: 'center', borderBottomColor: colDivideLine, borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 16, color: '#009ECC' }} onPress={() => this.SetAGame([Games[1], Games[3], Games[4]])}>{strings('HomeScreen.writing')}</Text>
                            </View>
                            <View style={{ width: '20%', height: 60 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 1, height: '50%', backgroundColor: colUpLine, position: 'absolute', left: '50%', top: 0 }} />
                                    <View style={{ width: 1, height: '50%', backgroundColor: colDownLine, position: 'absolute', left: '50%', bottom: 0 }} />
                                    <View style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#63B1DC' }} >
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 25,
                                                height: 25,
                                                justifyContent: 'center',
                                                resizeMode: 'stretch',
                                            }} source={require('../assets/keyboard.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '40%' }}>
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '40%', height: 60, justifyContent: 'center', alignItems: 'center', borderBottomColor: colDivideLine, borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 16, color: '#009ECC' }} onPress={() => this.SetAGame([Games[0], Games[1], Games[2], Games[3]])}>{strings('HomeScreen.reading')}</Text>
                            </View>
                            <View style={{ width: '20%', height: 60 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 1, height: '50%', backgroundColor: colUpLine, position: 'absolute', left: '50%', top: 0 }} />
                                    <View style={{ width: 1, height: '50%', backgroundColor: colDownLine, position: 'absolute', left: '50%', bottom: 0 }} />
                                    <View style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#63B1DC' }} >
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 25,
                                                height: 25,
                                                justifyContent: 'center',
                                                resizeMode: 'stretch',
                                            }} source={require('../assets/reading.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '40%' }}>
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '40%', height: 60, justifyContent: 'center', alignItems: 'center', borderBottomColor: colTransparent, borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 16, color: '#009ECC' }} onPress={() => this.SetAGame([Games[5]])}>{strings('HomeScreen.drawing')}</Text>
                            </View>
                            <View style={{ width: '20%', height: 60 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 1, height: '50%', backgroundColor: colUpLine, position: 'absolute', left: '50%', top: 0 }} />
                                    <View style={{ width: 1, height: '50%', backgroundColor: colTransparent, position: 'absolute', left: '50%', bottom: 0 }} />
                                    <View style={{ width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#63B1DC' }} >
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 25,
                                                height: 25,
                                                justifyContent: 'center',
                                                resizeMode: 'stretch',
                                            }} source={require('../assets/drawing.png')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '40%' }}>
                            </View>
                        </View>
                    </View>
                )
            case 3:
                return (
                    <View style={{ width: '100%', paddingHorizontal: 60, marginBottom: 20 }}>
                        <View style={{ width: '100%', height: 50 }}></View>
                        <Button text={strings('Create.start')}
                            style={{
                                container: {
                                    height: 60,
                                    backgroundColor: '#F7941D',
                                    padding: 0,
                                    width: '100%',
                                },
                                text: {
                                    fontSize: 20,
                                    color: "#fff",
                                }
                            }}
                            upperCase={false}
                            onPress={() => {
                                console.log('this.state.selectedGame.screenTitle:', this.state.selectedGame.screenTitle)
                                firestore().collection('user').doc(this.props.user.uid).collection('lesson').add({
                                    lang: this.props.lang.languageLearning,
                                    start: Date.now(),
                                    end: Date.now()
                                }).then(doc => {
                                    console.log("words : ", this.state.selectedWordList.words);
                                    console.log("topicwords : ", this.state.selectedWordList.words);
                                    console.log("TopicNameForTextToText : ", this.state.TopicNameForTextToText);
                                    navigate(this.state.selectedGame.screenTitle, { lessonID: doc.id, words: this.state.selectedWordList.words, topicwords: this.state.selectedWordList.words, TextToTextTitle: this.state.TopicNameForTextToText })
                                    // navigate('WriteTheImage', { words: this.state.selectedWordList.words, topicwords: this.state.selectedWordList.words, TextToTextTitle: this.state.TopicNameForTextToText })

                                })
                            }} />
                        <View style={{ width: '100%', height: 30 }}></View>
                        <Button text='or'
                            style={{
                                container: {
                                    height: 45,
                                    backgroundColor: 'transparent',
                                    padding: 0,
                                    width: '100%',
                                },
                                text: {
                                    fontSize: 20,
                                    color: "#00B3C5",
                                }
                            }}
                            upperCase={false} />
                        <View style={{ width: '100%', height: 30 }}></View>
                        <View>
                            <Button text=''
                                style={{
                                    container: {
                                        height: 35,
                                        backgroundColor: '#00BDCD',
                                        padding: 0,
                                        width: '100%',
                                    },
                                    text: {
                                        fontSize: 20,
                                        color: "#fff",
                                    }
                                }}
                                upperCase={false}
                                onPress={() => this.setSecondModalVisible(!this.state.SecondmodalVisible)} />
                            <TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.setSecondModalVisible(!this.state.SecondmodalVisible)}>
                                <View>
                                    <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>{strings('HomeScreen.send_to_a_friend')}</Text>
                                </View>
                                <View style={{ width: 15, height: 15 }}></View>
                                <View style={{ widows: 40, height: 22 }}>
                                    <Image style={{
                                        flex: 1,
                                        width: 40,
                                        height: 25,
                                        justifyContent: 'center',
                                        resizeMode: 'contain',
                                    }} source={require('../assets/sendfriend.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            backdropColor={'black'}
                            backdropOpacity={0.5}
                            animationType="slide"
                            transparent={true}
                            isVisible={this.state.SecondmodalVisible}
                            onRequestClose={() => {
                                this.setSecondModalVisible(!this.state.SecondmodalVisible);
                            }}>
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '80%', backgroundColor: 'white' }}>
                                    <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                                        <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                                            <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                                {strings('CreateInvite.invite_your')}
                                            </Text>
                                        </View>
                                        <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                                            <TouchableOpacity onPress={() => {
                                                this.setSecondModalVisible(!this.state.SecondmodalVisible);
                                            }}>
                                                <Icon
                                                    color='white'
                                                    size={25}
                                                    name='circle-with-cross'
                                                    type='entypo'
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center', }}></View>
                                        <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <TextInput
                                                style={{ fontSize: 18, width: '70%', backgroundColor: '#FFFFFF', borderRadius: 3, borderWidth: 0, borderColor: '#E0E0E0' }}
                                                placeholder={strings('CreateInvite.friends_nickname')}
                                                placeholderTextColor="#D4D4D4"
                                                value={this.state.friendsNick}
                                                onChangeText={friendsNick => this.setState({ friendsNick })}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}></View>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ width: 200, }}>
                                                <Button text={strings('CreateInvite.send')}
                                                    style={{
                                                        container: {
                                                            height: 45,
                                                            backgroundColor: '#2496BE',
                                                            padding: 0,
                                                            width: '100%',
                                                        },
                                                        text: {
                                                            fontSize: 20,
                                                            color: "#fff",
                                                        }
                                                    }}
                                                    upperCase={false}
                                                    onPress={this.onSendToFriend.bind(this)} />
                                            </View>
                                        </View>
                                        <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}></View>
                                    </View>
                                </ElevatedView>
                            </View>
                        </Modal>

                    </View>
                )

        }
    }

    renderNotification() {
        if (this.state.notificationPresent == true) {
            return (
                <Icon
                    name='notifications-active' />
            )
        }
    }

    render() {
        // The screen's current route is passed in to `props.navigation.state`:
        const { navigate } = this.props.navigation;
        TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyAuwqe2vERpF-nHO2-fBdMp2Mh0uxIFbls', 'en');
        // console.log(myUser);

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Image style={{
                        flex: 1,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                    }} source={require('../assets/mountainbg.png')}
                    />
                    <View style={{ flex: 1, backgroundColor: 'rgba(190, 255, 235, 0.7)' }}
                    // style={[styles.scrollview, {backgroundColor:'rgba(190, 255, 235, 0.7)'}]}
                    // scrollEventThrottle={200}
                    // directionalLockEnabled={true}
                    >

                        {/* <PowerTranslator style={{ marginLeft: 5, fontSize: 15, color: '#81CBEB' }} text={'Hola'} /> */}
                        {/*<Text>You have {this.state.xp} XP</Text> */}
                        <View style={{ width: '100%', height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                            <View style={{ width: '25%', height: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                {this.props.user &&
                                    <Avatar
                                        width={50}
                                        height={50}
                                        placeholder="Add \n Photo"
                                        source={{
                                            uri: this.props.profilePics.profilePics.length > 0 ? this.props.profilePics.profilePics[this.props.profilePics.profilePics.length - 1].illustration : this.props.user.myPic
                                        }}
                                        activeOpacity={0.7}
                                        avatarStyle={{ borderRadius: 50 / 2 }}
                                        overlayContainerStyle={{ backgroundColor: 'transparent' }}
                                    // onPress={() => this.setState({ visibleModal: 6 })}
                                    />
                                }
                            </View>
                            <View style={{ width: '25%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ fontSize: 10, color: '#4C4C4C' }}>
                                    {strings('HomeScreen.username')}
                                </Text>
                                <Text style={{ fontSize: 8, color: '#7F7F7F' }}>
                                    {/* {this.state.myUser.username} */}
                                    {this.props.user && this.props.user.username}
                                </Text>
                            </View>
                            <View style={{ width: '25%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ fontSize: 10, color: '#4C4C4C' }}>
                                    {strings('HomeScreen.learning')}
                                </Text>
                                <Text style={{ fontSize: 8, color: '#7F7F7F' }}>
                                    {this.props.user && this.props.lang.languageLearning}
                                </Text>
                            </View>
                            <View style={{ width: '25%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ fontSize: 10, color: '#4C4C4C' }}>
                                    {strings('HomeScreen.age')}
                                </Text>
                                <Text style={{ fontSize: 8, color: '#7F7F7F' }}>
                                    {this.props.user && this.props.user.age}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F00' }}
                                onPress={() => navigate('Profile')}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                                    {strings('HomeScreen.profile')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F74B00' }}
                                onPress={() => navigate('Buy')}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                                    {strings('HomeScreen.buy')}
                                </Text>
                                {/* <Button 
                title='Buy'this.state.myUser
                onPress={() => navigate('Buy')}/> */}
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F00' }}
                                onPress={() => navigate('FriendsList')}>
                                {/* // this.props.navigation.navigate("FriendsList")}> */}
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                                    {strings('HomeScreen.social')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F74B00' }}
                                onPress={() => navigate('Create', { myUser: this.props.user })}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                                    {strings('HomeScreen.create')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', left: 0, top: 0, width: '75%', height: 70, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <View style={{ width: 20, height: 20, right: 0, bottom: 0 }}>
                                {(this.state.notificationPresent == true) ? (
                                    <Icon
                                        size={18}
                                        color='blue'
                                        name='notifications-active' />
                                ) : (null)}
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5FC8D7' }}>

                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5FC8D7' }}
                                onPress={() => this.setState({ SelectTab: 1 })}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: (this.state.SelectTab > 1) ? '#009CD7' : 'white' }}>
                                    {strings('HomeScreen.topic')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5FC8D7' }}
                                onPress={() => this.setState({ SelectTab: 2 })}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: (this.state.SelectTab > 2) ? '#009CD7' : 'white' }}>
                                    {strings('HomeScreen.lesson')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '25%', height: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5FC8D7' }}
                                onPress={() => this.setState({ SelectTab: 3 })}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                                    {strings('HomeScreen.ready')}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ position: 'absolute', width: '100%', height: 15, flex: 1, bottom: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }} >
                                    {(this.state.SelectTab == 1) ? (
                                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginTop: 5 }}>
                                            <View style={{
                                                width: 0,
                                                height: 0,
                                                backgroundColor: 'transparent',
                                                borderStyle: 'solid',
                                                borderLeftWidth: 10,
                                                borderRightWidth: 10,
                                                borderBottomWidth: 10,
                                                borderLeftColor: 'transparent',
                                                borderRightColor: 'transparent',
                                                borderBottomColor: 'rgba(190, 255, 235, 0.7)'
                                            }}>
                                            </View>
                                        </View>
                                    ) : (null)}
                                    {(this.state.SelectTab > 1) ? (
                                        <Text style={{ fontSize: 8, color: '#009CD7' }} >Click to Edit</Text>
                                    ) : (null)}
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }} >
                                    {(this.state.SelectTab == 2) ? (
                                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginTop: 5 }}>
                                            <View style={{
                                                width: 0,
                                                height: 0,
                                                backgroundColor: 'transparent',
                                                borderStyle: 'solid',
                                                borderLeftWidth: 10,
                                                borderRightWidth: 10,
                                                borderBottomWidth: 10,
                                                borderLeftColor: 'transparent',
                                                borderRightColor: 'transparent',
                                                borderBottomColor: 'rgba(190, 255, 235, 0.7)'
                                            }}>
                                            </View>
                                        </View>
                                    ) : (null)}
                                    {(this.state.SelectTab > 2) ? (
                                        <Text style={{ fontSize: 8, color: '#009CD7' }} >Click to Edit</Text>
                                    ) : (null)}
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }} >
                                    {(this.state.SelectTab == 3) ? (
                                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginTop: 5 }}>
                                            <View style={{
                                                width: 0,
                                                height: 0,
                                                backgroundColor: 'transparent',
                                                borderStyle: 'solid',
                                                borderLeftWidth: 10,
                                                borderRightWidth: 10,
                                                borderBottomWidth: 10,
                                                borderLeftColor: 'transparent',
                                                borderRightColor: 'transparent',
                                                borderBottomColor: 'rgba(190, 255, 235, 0.7)'
                                            }}>
                                            </View>
                                        </View>
                                    ) : (null)}
                                </View>
                            </View>
                        </View>

                        <View style={{ width: '100%', height: 40, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <View style={{ flex: 9, justifyContent: 'center' }}>
                                <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold', color: '#00B3C5' }}>
                                    {this.renderHeaderTitle(this.SelectTab)}
                                </Text>
                            </View>
                            <View style={{ flex: 1, padding: 3 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => this.setModalVisible(true)}>
                                        <Image style={{
                                            flex: 1,
                                            width: 35,
                                            height: 35,
                                            justifyContent: 'center',
                                        }} source={require('../assets/edit.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* {this.state.Topics && Object.keys(this.state.g).map(function(key) {
                  return <div>Key: {key}, Value: {this.state.Topics[title]}</div>;
                })} */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
                            {(this.state.SelectTab == 1) ? (
                                <ScrollView style={{ width: '100%', height: '100%', flex: 1 }}>
                                    {this.state.Topics && this.state.Topics.map((item, index) => (
                                        this.renderIfUnique(item, index, this.state.Topics.length)
                                    ))}
                                    {this.renderIfUnique2()}
                                </ScrollView>
                            ) : (null)}
                            {(this.state.SelectTab == 2) ? (
                                <ScrollView style={{ width: '100%', height: '100%', flex: 1 }}>
                                    {this.renderIfUnique2()}
                                </ScrollView>
                            ) : (null)}
                            {(this.state.SelectTab == 3) ? (
                                <View style={{ width: '100%', height: '100%', flex: 1 }}>
                                    {this.renderIfUnique2()}
                                </View>
                            ) : (null)}
                        </View>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            style={{ margin: 0, padding: 0, width: '100%', height: '100%', backgroundColor: 'blue' }}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                this.setModalVisible(!this.state.modalVisible)
                                // navigate('Start');
                            }}>
                            {this.renderModalContent()}
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            style={{ margin: 0, padding: 0, width: '100%', height: '100%', backgroundColor: 'blue' }}
                            visible={this.state.ThirdmodalVisible}
                            onRequestClose={() => {
                                this.setThirdModalVisible(!this.state.ThirdmodalVisible)
                            }}>
                            {this.renderThirdModalContent()}
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={false}
                            style={{ margin: 0, padding: 0, width: '100%', height: '100%', backgroundColor: 'blue' }}
                            visible={this.state.FourthmodalVisible}
                            onRequestClose={() => {
                                this.setFourthModalVisible(!this.state.FourthmodalVisible)
                            }}>
                            {this.renderFourthModalContent()}
                        </Modal>

                    </View>
                </View>
                <View style={{
                    flex: 1,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                }}>
                    <View style={{
                        flex: 9,
                        width: '100%',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                    }}>
                    </View>
                    <View style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        //backgroundColor:'green',
                    }}>
                        <View style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    title='Logout'
                                    onPress={() => this.signOutUser()}>
                                    <Image style={{
                                        flex: 1,
                                        width: 35,
                                        height: 35,
                                        justifyContent: 'center',
                                    }}
                                        source={require('../assets/logout.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        Invitations: state.Invitations,
        lang: state.lang,
        profilePics: state.profilePics
    }
}

export default connect(mapStateToProps, { removeInvitation })(StartScreen);
