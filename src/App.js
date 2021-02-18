import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, YellowBox, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import { Button } from 'react-native-material-ui';
import Spinner from "react-native-loading-spinner-overlay";
import FlashMessage from "react-native-flash-message";
import OneSignal from "react-native-onesignal";
import LoginForm from './components/LoginForm';
import ProfileScreen from './components/ProfileScreen';
import OtherProfileScreen from './components/OtherProfileScreen';
import StartScreen from './components/StartScreen';
import CreateScreen from './components/CreateScreen';
import BuyScreen from './components/BuyScreen';
import BuyScreenSecond from './components/BuyScreenSecond';
import VisualAwarenessScreen from './components/VisualAwarenessScreen';
import WriteTheImageScreen from './components/WriteTheImage';
import ListenWriteScreen from './components/ListenWriteScreen';
import TextToTextScreen from './components/TextToTextScreen';
import SayTheImageScreen from './components/SayTheImageScreen';
import DrawThisScreen from './components/DrawThisScreen';
import PendingDrawingScreen from './components/PendingDrawingScreen';
import FriendsListScreen from './components/FriendsListScreen';
import Chat from './components/Chat';
import ResetPassword from './components/ResetPassword';
import NewPost from './components/NewPost';
import PostScreen from './components/PostScreen';
import ViewPost from './components/ViewPost'
import Comments from './components/Comments';
import Gallery from './components/Gallery';
import { loadString } from './locales/i18n';
import Introductions from './components/creategame/Introductions'
import ChooseTheImage from './components/creategame/ChooseTheImage'
import ListenThenWrite from './components/creategame/ListenThenWrite'
import SayTheImage from './components/creategame/SayTheImage'
import TextToText from './components/creategame/TextToText'
import WriteThisImage from './components/creategame/WriteThisImage'
import ThanksGame from './components/creategame/ThanksGame'
import InAppPurchase from './components/InAppPurchase'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {
    login,
    setInvitation,
    setFriends,
    setLang,
    setBlockeds,
} from './redux/action'
import { Dimensions } from 'react-native';
import I18n from 'react-native-i18n';
// import HomeTitle from './components/StartScreen';
import { strings } from '../src/locales/i18n';
import { connect } from 'react-redux'
import UUIDGenerator from 'react-native-uuid-generator'

import testID from './utils/testID';
import Global from './utils/global';
import { CustomHeader } from './components/common/CustomHeader'
import GetStartedScreen from './components/GetStartedScreen';
import LoginEmailScreen from './components/LoginEmailScreen';
import LoginPasswordScreen from './components/LoginPasswordScreen';
import WantToLearn from './components/WantToLearn';
import CustomBottomBar from './components/CustomBottomBar';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import SplashScreen from 'react-native-splash-screen'
import PaymentScreen from './components/PaymentScreen'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather'



const robotoLight = 'Roboto-Light';

const CreateGames = [
    {
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/Game%20Selection%20Icons%2F001-line.png?alt=media&token=166751d1-5f1c-4c02-946b-1b17420207ac',
        title: 'Create.introductions',
        eng: 'Introductions',
        port: 'Introduções',
        name: 'introductions',
        order: 1
    },
    {
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/Game%20Selection%20Icons%2F002-translator.png?alt=media&token=6db555c3-aaaa-455b-acad-77120bd8b9cd',
        title: 'Create.texttotext',
        eng: 'Text To Text',
        port: 'Texto ao texto',
        name: 'texttotext',
        order: 3
    },
    {
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/Game%20Selection%20Icons%2F005-eye.png?alt=media&token=892573f5-44ac-423b-a71c-b985db5bdea9',
        title: 'Create.writethisimage',
        eng: 'Write this image',
        port: 'Escreva esta imagem',
        name: 'writethisimage',
        order: 6
    },
    {
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/Game%20Selection%20Icons%2F004-headphones.png?alt=media&token=338824c2-ae6f-4c13-9f5d-0fcc3e3336a9',
        title: 'Create.listenthenwrite',
        eng: 'Listen then write',
        port: 'Ouça e depois escreva',
        name: 'listenthenwrite',
        order: 5
    },
    {
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/Game%20Selection%20Icons%2F006-microphone.png?alt=media&token=62cc49d4-eb1d-4e3c-aaaf-d7473d6dabd0',
        title: 'Create.saytheimage',
        eng: 'Say the image',
        port: 'Say the image',
        name: 'saytheimage',
        order: 2
    },
    {
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/Game%20Selection%20Icons%2F007-paint-palette.png?alt=media&token=8611b263-2116-4f73-b293-d246194681ba',
        title: 'Create.choosetheimage',
        eng: 'Choose the image',
        port: 'Choose the image',
        name: 'choosetheimage',
        order: 4
    }
]


const PremiumStuff = [
    {
        title: 'Unlimited Translations Button',
        PTtitle: 'Botão de tradução ilimitado',
        description: 'Use the translation button without limit within the chat feature.',
        PTdescription: 'Use o botão de tradução sem limites do bate-papo.',
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/VIPicons%2F005-language.png?alt=media&token=35d5e563-1f7c-4200-a1f5-e0143d3bd2b1'
    },
    {
        title: 'Full Access',
        PTtitle: 'Acesso completo',
        description: 'Enjoy all the features available on the free version of the app.',
        PTdescription: 'Aproveite todas as ferramentas disponíveis na versão grátis do aplicativo.',
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/VIPicons%2F004-layers.png?alt=media&token=7eed73bc-3def-45a5-a7d2-a6af6e6979da'
    },
    {
        title: 'No Ads',
        PTtitle: 'Sem propagandas',
        description: 'as a bonus you will never recieve ads while on a premium subscription.',
        PTdescription: 'Você nunca receberá propagandas enquanto for um inscrito premium.',
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/VIPicons%2F002-stamp.png?alt=media&token=1c1af227-e369-4aab-9bc6-da18b55d9196'
    },
    {
        title: 'V.I.P',
        PTtitle: 'V.I.P',
        description: 'Buying premium will help make Yak Vernac add more awesome content and features.',
        PTdescription: 'Comparando a assinatura premium, ajudará a Yac Vernac a melhorar o aplicativo.',
        illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/VIPicons%2F003-postcard.png?alt=media&token=eb94b0b4-7dda-4d1d-85b5-db96b78f974e'
    }
];

// stripe.setOptions({
//     publishableKey: 'pk_live_8fAq6qzETYGHbMeecCXWKPWx',
//     merchantId: '<MERCHANT_ID>',
//     androidPayMode: 'production', //wallet_environment : production/test
// })

// stripe.setOptions({
//     publishableKey: 'pk_test_51GqD62IPfg23ynjHsIGAz7lECaAqnIAFVmN3Z1yR0b0RqompSbo5XI3QcZVDMXihpQJPaJ2FsPtVuO2BYyfb5KDw00T67G8uY8',
//     merchantId: '<MERCHANT_ID>',
//     androidPayMode: 'test', //wallet_environment : production/test
// })

// stripe.setOptions({
//     publishableKey: 'pk_live_pcZMfbObmIR8mtoKIvlPl98K00MY1mWFUL',
//     merchantId: '<MERCHANT_ID>',
//     androidPayMode: 'production', //wallet_environment : production/test
// })

YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
    'Module RCTImageLoader requires',
]);
console.disableYellowBox = true;
var isFirst = true;
var isOpened = false;
var openResult;

//59a1ed67-ec8a-4cc1-b38a-ec225843a6b0
export class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        OneSignal.init("8f75150f-ba91-4fa4-a712-54ab1345b3e9", { kOSSettingsKeyAutoPrompt: true, kOSSettingsKeyInFocusDisplayOption: 2 });
        // OneSignal.addEventListener('received', this.onReceived.bind(this));
        OneSignal.addEventListener('opened', this.onOpened);

        // OneSignal.addEventListener('received', (notification) => {
        //     console.log('OneSignal:', "Notification received");
        //     let type = notification.payload.additionalData.type
        //     if (type == "CHAT") {
        //         // props.navigation.navigate('Chat', { uid: notification.payload.additionalData.fromUserId })
        //     } else {
        //         // props.navigation.navigate("PostScreen")
        //     }
        // });
        // OneSignal.addEventListener('opened', openResult => {
        //     console.log('OneSignal:', "Notification opened");
        //     this.isOpened = true;
        //     this.openResult = openResult;
        //     let type = notification.payload.additionalData.type
        //     if (type == "CHAT") {
        //         props.navigation.navigate('Chat', { uid: notification.payload.additionalData.fromUserId })
        //     } else {
        //         props.navigation.navigate("PostScreen")
        //     }
        // });

        OneSignal.addEventListener('ids', device => {

            if (device.userId === null) {
                //alert("Please check your Internet Connection and try again!");
                return;
            }
            if (!isFirst) return;
            isFirst = false;
            Global.getInstance().playerId = device.userId;
        });
    }

    static navigationOptions = {
        title: 'Welcome',
        header: null,
    };

    state = {
        loggedIn: false,
        loading: false,
        token: null,
        counterItem1: 0,
        counterItem2: 0,
        user: {},
    }

    nonProfile = false

    usersToFirestore() {
        console.log('usersToFirestore')
        database().ref().child('users').once('value').then(async snapshot => {
            const users = snapshot.val();
            for (const id in users) {
                try {
                    const user = users[id]
                    const Invitations = user.Invitations
                    if (Invitations) {
                        // for (const invitationId in Invitations) {
                        //   try {
                        //     const invitation = Invitations[invitationId]
                        //     await firestore().collection('user').doc(`${id}`).collection('Invitations').doc(invitationId).set(invitation)
                        //     console.log('invitation:', invitation)
                        //   } catch (error) {
                        //     console.log(error.message)        
                        //   }
                        // }
                        delete user.Invitations
                    }
                    const blockedBy = user.blockedBy
                    const blockedByArray = []
                    if (blockedBy) {
                        for (const key in blockedBy) {
                            if (key == 'Nobody') {
                                continue
                            }
                            blockedByArray.push(key)
                        }
                        delete user.blockedBy
                        user.blockedBy = blockedByArray
                    }
                    const friends = user.friends
                    user.friends = Object.keys(friends)
                    if (user.languageNative == 'PT') {
                        user.languageNative = 'Portuguese'
                    } else if (user.languageNative == 'EN') {
                        user.languageNative = 'English'
                    }
                    if (user.languageLearning == 'PT') {
                        user.languageLearning = 'Portuguese'
                    } else if (user.languageLearning == 'EN') {
                        user.languageLearning = 'English'
                    }
                    if (user.checkedFemale) {
                        user.sex = 'female'
                    }
                    if (user.checkedMale) {
                        user.sex = 'male'
                    }
                    delete user.checkedFemale
                    delete user.checkedMale
                    await firestore().collection('user').doc(id).set(user)
                } catch (error) {
                    console.log(error.message)
                }
            }
            console.log('usersToFirestore end')
        }).catch(error => {
            console.log(error.message)
        })
    }

    async profilePicsToFirestore() {
        console.log('profilePicsToFirestore start!')
        const snapshot = await database().ref().child('profilePics').once('value')
        const islandPics = snapshot.val()
        const islandPicArray = []
        const portuguese = {}
        const english = {}
        for (const id in islandPics) {
            const islandPic = {
                illustration: islandPics[id].illustration,
                illustrationFull: islandPics[id].illustrationFull,
                xp: islandPics[id].xp,
            }
            const title = islandPics[id].title.replace(/\s/g, '')
            islandPic.title = 'profilePic.' + title
            english[title] = islandPics[id].title
            portuguese[title] = islandPics[id].PTtitle
            islandPicArray.push(islandPic)
        }
        await firestore().collection('App').doc('pic').set({ profile: islandPicArray })
        await firestore().collection('string').doc('Portuguese').update({ profilePic: portuguese })
        await firestore().collection('string').doc('English').update({ profilePic: english })
        console.log('profilePicsToFirestore end!')

    }

    async islandPicsToFirestore() {
        console.log('islandPicsToFirestore start!')
        const snapshot = await database().ref().child('islandPics').once('value')
        const islandPics = snapshot.val()
        const islandPicArray = []
        const portuguese = {}
        const english = {}
        for (const id in islandPics) {
            const islandPic = {
                illustration: islandPics[id].illustration,
                xp: islandPics[id].xp,
                type: islandPics[id].type,
            }
            const title = islandPics[id].title.replace(/\s/g, '')
            islandPic.title = 'islandPic.' + title
            english[title] = islandPics[id].title
            portuguese[title] = islandPics[id].PTtitle
            islandPicArray.push(islandPic)
        }
        await firestore().collection('App').doc('pic').update({ island: islandPicArray })
        await firestore().collection('string').doc('Portuguese').update({ islandPic: portuguese })
        await firestore().collection('string').doc('English').update({ islandPic: english })
        console.log('islandPicsToFirestore end!')

    }

    chatToFirestore() {
        // console.log('chatToFirestore')
        database().ref().child('chat').once('value').then(snapshot => {
            const chats = snapshot.val()
            for (const id in chats) {
                const chat = chats[id]
                for (const chatid in chat) {
                    const oneChat = chat[chatid]
                    console.log(oneChat)
                    firestore().collection('chat').doc(id).collection(chatid).add(oneChat)
                }
            }
        }).catch(error => {
            console.log(error.message)
        })

    }

    paymentsToFirestore() {
        console.log('paymentsToFirestore')
        database().ref().child('payments').once('value').then(snapshot => {
            const payments = snapshot.val()
            for (const id in payments) {
                const payment = payments[id]
                firestore().collection('user').doc(id).collection('payment').add(payment).then(() => {
                   
                    console.log(payment)
                }).catch(error => {
                    console.log(error.message)
                })
            }
        }).catch(error => {
            console.log(error.message)
        })

    }

    PostToFirestore() {
        console.log('PostToFirestore')
        database().ref().child('Post').once('value').then(snapshot => {
            const Posts = snapshot.val()
            for (const id in Posts) {
                const Post = Posts[id]
                firestore().collection('Post').doc(id).set(Post).then(() => {
                    console.log(Post)
                    
                }).catch(error => {
                    console.log(error.message)
                })
            }
        }).catch(error => {
            console.log(error.message)
        })

    }

    topicsENToFirestore() {
        console.log('topicsENToFirestore')
        database().ref().child('topicsEN').once('value').then(snapshot => {
            const topicsENs = snapshot.val()
            firestore().collection('topics').doc('English').set(topicsENs).then(() => {
            }).catch(error => {
                console.log(error.message)
            })
        }).catch(error => {
            console.log(error.message)
        })

    }

    topicsPicturesToFirestore() {
        console.log('topicsPicturesToFirestore')
        database().ref().child('topicsPictures').once('value').then(snapshot => {
            const topicsPictures = snapshot.val()
            firestore().collection('topics').doc('topicsPictures').set(topicsPictures).then(() => {
            }).catch(error => {
                console.log(error.message)
            })
        }).catch(error => {
            console.log(error.message)
        })

    }

    topicsPTToFirestore() {
        console.log('topicsPTToFirestore')
        database().ref().child('topicsPT').once('value').then(snapshot => {
            const topicsPT = snapshot.val()
            firestore().collection('topics').doc('Portuguese').set(topicsPT).then(() => {
            }).catch(error => {
                console.log(error.message)
            })
        }).catch(error => {
            console.log(error.message)
        })

    }

    VocabularyENPTToFirestore() {//569
        console.log('VocabularyENPTToFirestore')
        database().ref().child('VocabularyENPT').once('value').then(snapshot => {
            const VocabularyENPTs = snapshot.val()
            for (const id in VocabularyENPTs) {
                const VocabularyENPT = VocabularyENPTs[id]
                firestore().collection('VocabularyEnglishPortuguese').doc(id).set(VocabularyENPT).then(() => {
                    console.log(VocabularyENPT)
                }).catch(error => {
                    console.log(error.message)
                })
            }
        }).catch(error => {
            console.log(error.message)
        })

    }

    VocabularyPTENToFirestore() {//599
        console.log('VocabularyPTENToFirestore')
        database().ref().child('VocabularyPTEN').once('value').then(snapshot => {
            const VocabularyPTENs = snapshot.val()
            for (const id in VocabularyPTENs) {
                const VocabularyPTEN = VocabularyPTENs[id]
                firestore().collection('VocabularyPortugueseEnglish').doc(id).set(VocabularyPTEN).then(() => {
                    console.log(VocabularyPTEN)
                }).catch(error => {
                    console.log(error.message)
                })
            }
        }).catch(error => {
            console.log(error.message)
        })

    }

    async creategamesToFirestore() {
        if (this.start) {
            return
        }
        console.log('creategamesToFirestore start!')
        this.start = true
        const English = {}
        const Portuguese = {}
        for (const game of CreateGames) {
            console.log(game)
            await firestore().collection('creategames').add({
                illustration: game.illustration,
                title: game.title,
                order: game.order,
                name: game.name
            })
            English[game.name] = game.eng
            Portuguese[game.name] = game.port
        }
        await firestore().collection('string').doc('English').update({
            Create: English
        })
        await firestore().collection('string').doc('Portuguese').update({
            Create: Portuguese
        })
        console.log('creategamesToFirestore end!')
    }

    gotoProfile = async (user) => {
        if (this.nonProfile) {
            return
        }
        this.nonProfile = true
        const [languageLearning, languageNative] = (I18n.currentLocale() == 'Portuguese') ? ['English', 'Portuguese'] : ['Portuguese', 'English']
        const myPic = 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.png?alt=media&token=ee7f968c-00c9-4097-8e0b-53f3a3562c05'

        const friends = [
            'FmIfeWNRGIh2s9iStQberUXIrgA3'
        ]

        const friendData = {}
        const friend = await firestore().collection('user').doc('FmIfeWNRGIh2s9iStQberUXIrgA3').get()
        const lastMessage = "This is the Yak Vernac team. Feel free to message us here about any issues or suggestions you may have. \n\nHere is a helpful 'how to use Yak Vernac app' link - http://www.yakvernac.com \n\nTo read our Privacy Policy click here http://www.yakvernac.com/privacy-policy or the Terms and Conditions http://www.yakvernac.com/terms-and-conditions. \n\nPlease note that we will only respond to text messages concerning issues and suggestions."
        if (friend.exists) {
            friendData['FmIfeWNRGIh2s9iStQberUXIrgA3'] = friend.data()
            friendData['FmIfeWNRGIh2s9iStQberUXIrgA3']['lastMessage'] = lastMessage.substring(0, 25) + '...'
        }

        const username = user.email.substring(0, user.email.indexOf('@'))
        const myuser = {
            uid: user.uid,
            email: user.email,
            username,
            playerId: Global.getInstance().playerId,
            notify: 1,
            languageLearning,
            languageNative,
            xp: 50,
            freeTranslations: 0,
            friends,
            blockedBy: [],
            myPic,
            sex: 'male',
            premium: false,
            age: 18,
            interests: '',
            introduction: ''
        }
        firestore().collection('user').doc(user.uid).set(myuser).then(() => {
            UUIDGenerator.getRandomUUID(uuid => {
                const current = Date.now().toString()
                const oneMessage = {
                    'FmIfeWNRGIh2s9iStQberUXIrgA3_state': 'unread',
                    _id: uuid,
                    createdAt: new Date(),
                    text: "This is the Yak Vernac team. Feel free to message us here about any issues or suggestions you may have. \n\nHere is a helpful 'how to use Yak Vernac app' link - http://www.yakvernac.com \n\nTo read our Privacy Policy click here http://www.yakvernac.com/privacy-policy or the Terms and Conditions http://www.yakvernac.com/terms-and-conditions. \n\nPlease note that we will only respond to text messages concerning issues and suggestions.",
                    'user': {
                        '_id': 'FmIfeWNRGIh2s9iStQberUXIrgA3',
                        avatar: {
                            uri: friendData.profilePics && friendData.profilePics.length > 0 ? friendData.profilePics[friendData.profilePics.length - 1].illustration : friendData.myPic
                        }
                    }
                }
                oneMessage[user.uid + '_state'] = 'unread'
                firestore().collection('chat').where('user', 'array-contains', 'FmIfeWNRGIh2s9iStQberUXIrgA3').get().then(snapshot => {
                    var conversionID = null
                    for (const doc of snapshot.docs) {
                        const user = doc.data().user
                        if (user.includes(user.uid)) {
                            conversionID = doc.id
                            break
                        }
                    }
                    if (conversionID) {
                        const docID = collection.docs[0].id
                        firestore().collection('chat').doc(conversionID).collection('msg').doc(`${current}`).set(oneMessage)
                    } else {
                        const docRef = firestore().collection('chat').doc(`${current}`)
                        docRef.set({
                            user: [
                                user.uid,
                                'FmIfeWNRGIh2s9iStQberUXIrgA3'
                            ]
                        }).then(() => {
                            docRef.collection('msg').doc(`${current}`).set(oneMessage)
                        })

                    }
                    this.props.login(myuser)
                    this.props.setFriends(friendData)
                    this.props.navigation.navigate('Start')
                    setTimeout(() => {
                        this.props.navigation.navigate('Profile')

                    }, 200)

                })
            })
        })

    }

    UNSAFE_componentWillMount() {
        OneSignal.setRequiresUserPrivacyConsent(true)
        OneSignal.provideUserConsent(true);
        OneSignal.enableSound(true);
        OneSignal.inFocusDisplaying(2);
        OneSignal.clearOneSignalNotifications();

        const { navigate } = this.props.navigation;
        auth().onAuthStateChanged(user => {
            if (user) {
                // this.creategamesToFirestore(); return;
                // this.usersToFirestore()
                // this.VocabularyENPTToFirestore()
                // this.VocabularyPTENToFirestore()
                // this.paymentsToFirestore()
                // this.profilePicsToFirestore()
                // this.islandPicsToFirestore()
                // return
                alert("appUser")
                this.setState({ loggedIn: true });
                firestore().collection('user').doc(user.uid).get().then(async doc => {
                    if (doc.exists) {
                      
                        const appUser = doc.data()
                        
                        appUser.playerId = Global.getInstance().playerId
                        appUser.notify = appUser.notify == 0 ? 0 : 1
                        firestore().collection('user').doc(user.uid).update(appUser)
                        appUser.uid = user.uid
                        // this.props.setLang({
                        //     languageLearning: appUser.languageLearning,
                        //     languageNative: appUser.languageNative
                        // })
                        this.props.login(appUser)
                        const Invitations = {}
                        firestore().collection('user').doc(user.uid).collection('Invitations').get().then(collection => {
                            for (const doc of collection.docs) {
                                Invitations[doc.id] = doc.data()
                            }
                            this.props.setInvitation(Invitations)
                        })
                        const friends = {}
                        const friendIds = appUser.friends
                        for (const id of friendIds) {
                            const friend = await firestore().collection('user').doc(id).get()
                            if (friend.data()) {
                                friends[id] = friend.data()
                                const snapshot = await firestore().collection('chat').where('user', 'array-contains', user.uid).get()
                                var conversionID = null
                                for (const doc of snapshot.docs) {
                                    const user = doc.data().user
                                    if (user.includes(id)) {
                                        conversionID = doc.id
                                    }
                                }
                                if (conversionID) {
                                    const lastMessageSnapshot = await firestore().collection('chat').doc(conversionID).collection('msg').orderBy('createdAt', 'desc').limit(1).get()
                                    if (lastMessageSnapshot.docs.length > 0) {
                                        const lastMessage = lastMessageSnapshot.docs[0].data()
                                        var text = lastMessage.text

                                        if (text) {
                                            if (text.length > 25) {
                                                text = text.substring(0, 25) + '...'
                                            }
                                            friends[id]['lastMessage'] = text
                                        }
                                    }
                                }
                            }
                        }
                        this.props.setFriends(friends)
                        const blockedBy = {}
                        const blockedByIDs = appUser.blockedBy
                        for (const id of blockedByIDs) {
                            const blocked = await firestore().collection('user').doc(id).get()
                            if (blocked.data()) {
                                blockedBy[id] = blocked.data()
                            }
                        }
                        this.props.setBlockeds(blockedBy)
                        if (this.isOpened) {
                            if (this.openResult !== undefined) {
                                let type = this.openResult.notification.payload.additionalData.type;
                                // navigate('Start');
                                if (type == "CHAT") {
                                    // navigate('Chat', { uid: this.openResult.notification.payload.additionalData.fromUserId })
                                } else if (type == "WALLPOST") {
                                    navigate("PostScreen")
                                }
                            }

                        } else {
                           
                            navigate('Start');
                          
                        }
                    } else {
                        this.gotoProfile(user)

                    }

                }).catch(error => {
               alert(error)
                    console.log(error.message)
                    this.gotoProfile(user)
                })
            } else {
                this.setState({ loggedIn: false });
            }
        });
    }

    componentWillUnmount() {
        // OneSignal.removeEventListener('received', this.onReceived.bind(this));
        OneSignal.removeEventListener('opened', this.onOpened);

    }

    onReceived(notification) {
        let type = notification.payload.additionalData.type
        if (type === "CHAT") {
            // navigate('Chat', { uid: openResult.notification.payload.additionalData.toUserId })
        }
    }

    onOpened = (openResult) => {
        OneSignal.clearOneSignalNotifications()
        console.log('OneSignal:', "Notification opened");
        this.isOpened = true;
        this.openResult = openResult;
        let type = openResult.notification.payload.additionalData.type;
        if (type === "CHAT") {
            this.props.navigation.navigate('Chat', { uid: openResult.notification.payload.additionalData.fromUserId })
        }
    }

    static onIds(device) {
        // console.log("Device", device);
    }

    renderContent() {
        const { push } = this.props.navigation;
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        const buttonH = 60;
        const logoViewH = (viewportHeight - 60) * 0.7;
        const middleViewH = (viewportHeight - 60) * 0.3;
        const logoImgH = logoViewH * 0.8;

        switch (this.state.loggedIn) {
            case false:
                return (
                    <View style={style.homeContainer}>
                        <Image style={style.iconContainer} source={require('./assets/start_bg.png')} />
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', }}>
                            <View style={{ width: '100%', height: logoViewH, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent' }}>
                                <View style={{ width: logoImgH, height: logoImgH, backgroundColor: 'transparent' }}>
                                    <Image style={{
                                        width: '100%', height: '100%',
                                        resizeMode: 'cover',
                                    }}
                                        source={require('./assets/LOGO.png')} />
                                </View>
                            </View>
                            <View style={{ width: '100%', height: middleViewH, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                                <Text style={style.textMessage}>{strings('App.what_language')}</Text>
                            </View>

                            <View style={style.bottomContainer}>
                                <Button style={englishButton}
                                    text={strings('App.english')}
                                    onPress={() => {
                                        I18n.defaultLocale = "English";
                                        I18n.locale = "English";
                                        I18n.currentLocale();
                                        push('Login')
                                    }} />


                                <Button style={portugueseButton}
                                    text={strings('App.portuguese')}
                                    onPress={() => {
                                        I18n.defaultLocale = "Portuguese";
                                        I18n.locale = "Portuguese";
                                        I18n.currentLocale();
                                        push('Login')
                                    }} />
                            </View>
                        </View>
                    </View>
                );
            default:
                return (
                    <Spinner visible={!this.state.loggedIn} />
                );
        }

    }

    render() {
        return (
            <View>
                {this.renderContent()}
            </View>
        )
    }
}

const englishButton = {
    container: {
        height: 60,
        backgroundColor: '#FE330A',
        padding: 6,
        width: '50%',
    },
    text: {
        fontSize: 16,
        color: "#ffffff",
    }
};

const portugueseButton = {
    container: {
        height: 60,
        backgroundColor: '#FF7F00',
        padding: 6,
        width: '50%',
    },
    text: {
        fontSize: 16,
        color: "#ffffff",
        fontFamily: 'Roboto'
    }
};

const style = StyleSheet.create({
    homeContainer: {
        width: '100%',
        height: '100%',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconContainer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    logo: {
        aspectRatio: 0.75,
        resizeMode: 'contain',
        marginHorizontal: 25,
    },
    textMessage: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: robotoLight,
    },
    bottomContainer: {
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        padding: 0,
        paddingHorizontal: 0,
        marginHorizontal: 0,
        bottom: 0,
        width: '100%',
    },

});

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

const AuthStack = createStackNavigator({
    GetStarted: {
        screen: GetStartedScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    LoginEmail: {
        screen: LoginEmailScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    LoginPassword: {
        screen: LoginPasswordScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    WantToLearn: {
        screen: WantToLearn,
        navigationOptions: {
            headerShown: false
        }
    },
});

const AppStack = createStackNavigator({
    /*Gallery: { screen: Gallery },*/
    // NewPost: { screen: NewPost },
    Dashboard: {
        screen: CustomBottomBar,
        navigationOptions: {
            headerShown: false
        }
    },
   

    PaymentScreen:{
        screen: PaymentScreen,
       navigationOptions: {
        headerShown: Platform.OS == 'android'?false:true
       } 
    },
    Home: { screen: connect(mapStateToProps, { login, setInvitation, setFriends, setLang, setBlockeds })(HomeScreen) },
    // Login: { screen: LoginForm },
    // Profile: {
    //     screen: ProfileScreen,
    //     navigationOptions: ({ navigation }) => ({
    //         title: 'Profile'
    //     })
    // },
    OtherProfile: { screen: OtherProfileScreen },
    // Start: { screen: StartScreen },
    // Buy: { screen: BuyScreen },
    // Create: {
    //     screen: CreateScreen,
    //     navigationOptions: ({ navigation }) => ({
    //         title: 'Welcome',
    //         headerTitle: <CustomHeader navigation={navigation} />,
    //         headerStyle: {
    //             backgroundColor: '#2496BE',
    //         },
    //         headerTintColor: '#fff',
    //         headerTitleStyle: {
    //             fontWeight: 'bold',
    //         },
    //     })
    // },
    VisualAwareness: { screen: VisualAwarenessScreen },
    SayTheImage: { screen: SayTheImageScreen },
    TextToText: { screen: TextToTextScreen },
    WriteTheImage: { screen: WriteTheImageScreen },
    ListenWrite: { screen: ListenWriteScreen },
    DrawThis: { screen: DrawThisScreen },
    PendingDrawing: { screen: PendingDrawingScreen },
    FriendsList: { screen: FriendsListScreen },
    NewPost: { screen: NewPost },
    PostScreen: { screen: PostScreen },
    ViewPost: {
        screen: ViewPost,
        navigationOptions: ({ navigation }) => {
            return {
                header: null
                // headerStyle: {
                //     backgroundColor: '#2496BE',
                // },
                // headerTintColor: '#fff',
                // headerTitleStyle: {
                //     fontWeight: 'bold',
                // },
            };
        }
    },
    Chat: { screen: Chat },
    ResetPassword: { screen: ResetPassword },
    BuyScreenSecond: { screen: BuyScreenSecond },
    Comments: { screen: Comments },
    InAppPurchase: {screen: InAppPurchase},
    introductions: {
        screen: Introductions,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} title='Introduction' />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }
    },
    saytheimage: {
        screen: SayTheImage,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} title='Say the image' />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }
    },
    texttotext: {
        screen: TextToText,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} title='Text to text' />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }
    },
    choosetheimage: {
        screen: ChooseTheImage,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} title='Choose the image' />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }
    },
    listenthenwrite: {
        screen: ListenThenWrite,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} title='Listen then write' />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }
    },
    writethisimage: {
        screen: WriteThisImage,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} title='Write this image' />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }
    },
    ThanksGame: {
        screen: ThanksGame,
        navigationOptions: ({ navigation }) => {
            return ({
                headerTitle: <CustomHeader navigation={navigation} />,
                headerStyle: {
                    backgroundColor: '#2496BE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })
        }

    }
});

const mainNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        App: AppStack
    }, {
    initialRouteName: 'AuthLoading',
}
);

const SimpleApp = createAppContainer(mainNavigator);

export default class App extends Component {
    state = { loggedIn: null, language: "", loading: false };

    componentDidMount() {
        SplashScreen.hide();
        Icon.loadFont();
        Entypo.loadFont();
        Ionicons.loadFont();
        EvilIcons.loadFont();
        AntDesign.loadFont();
        MaterialIcons.loadFont();
        MaterialCommunityIcons.loadFont();
        Feather.loadFont();
        loadString(() => {
            this.setState({ loading: true })
        })
    }

    // renderContent() {

    //     switch (this.state.language) {
    //         case "Portuguese":
    //             return (
    //                 <LoginForm lang="Portuguese" />
    //             );
    //         case "English":
    //             return (
    //                 <LoginForm lang="English" />
    //             );
    //         default:
    //             return <LoginForm lang="English" />
    //     }

    // }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <SimpleApp />
                    <FlashMessage position="top" />
                </View>
            )

        }
        return <View />
    }

}

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   Alert,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   SafeAreaView
// } from 'react-native';
// // import { RNCamera } from 'react-native-camera';

// import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
// import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

// export default class App extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       example: 0,
//       color: '#FF0000',
//       thickness: 5,
//       message: '',
//       photoPath: null,
//       scrollEnabled: true
//     }
//   }

//   takePicture = async function () {
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options)
//       this.setState({
//         photoPath: data.uri.replace('file://', '')
//       })
//     }
//   };

//   render() {
//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         {
//           this.state.example === 0 &&
//           <View style={{ justifyContent: 'center', alignItems: 'center', width: 340 }}>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 1 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 1 -</Text>
//               <Text>Use build-in UI components</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 2 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 2 -</Text>
//               <Text>Use canvas only and customize UI components</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 3 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 3 -</Text>
//               <Text>Sync two canvases</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 4 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 4 -</Text>
//               <Text>Take a photo first</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 5 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 5 -</Text>
//               <Text>Load local image</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 6 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 6 -</Text>
//               <Text>Draw text on canvas</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => {
//               this.setState({ example: 7 })
//             }}>
//               <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 18 }}>- Example 7 -</Text>
//               <Text>Multiple canvases in ScrollView</Text>
//             </TouchableOpacity>
//           </View>
//         }

//         {
//           this.state.example === 1 &&
//           <View style={{ flex: 1, flexDirection: 'row' }}>
//             <RNSketchCanvas
//               containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               onStrokeEnd={data => {
//               }}
//               closeComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Close</Text></View>}
//               onClosePressed={() => {
//                 this.setState({ example: 0 })
//               }}
//               undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
//               onUndoPressed={(id) => {
//                 // Alert.alert('do something')
//               }}
//               clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
//               onClearPressed={() => {
//                 // Alert.alert('do something')
//               }}
//               eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
//               strokeComponent={color => (
//                 <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
//               )}
//               strokeSelectedComponent={(color, index, changed) => {
//                 return (
//                   <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
//                 )
//               }}
//               strokeWidthComponent={(w) => {
//                 return (<View style={styles.strokeWidthButton}>
//                   <View style={{
//                     backgroundColor: 'white', marginHorizontal: 2.5,
//                     width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
//                   }} />
//                 </View>
//                 )
//               }}
//               defaultStrokeIndex={0}
//               defaultStrokeWidth={5}
//               saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
//               savePreference={() => {
//                 return {
//                   folder: "RNSketchCanvas",
//                   filename: String(Math.ceil(Math.random() * 100000000)),
//                   transparent: false,
//                   imageType: "png"
//                 }
//               }}
//               onSketchSaved={(success, path) => {
//                 Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
//               }}
//               onPathsChange={(pathsCount) => {
//                 console.log('pathsCount', pathsCount)
//               }}
//             />
//           </View>
//         }

//         {
//           this.state.example === 2 &&
//           <View style={{ flex: 1, flexDirection: 'row' }}>
//             <View style={{ flex: 1, flexDirection: 'column' }}>
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                 <TouchableOpacity style={styles.functionButton} onPress={() => {
//                   this.setState({ example: 0 })
//                 }}>
//                   <Text style={{ color: 'white' }}>Close</Text>
//                 </TouchableOpacity>
//                 <View style={{ flexDirection: 'row' }}>
//                   <TouchableOpacity style={styles.functionButton} onPress={() => {
//                     this.setState({ thickness: 10 })
//                   }}>
//                     <Text style={{ color: 'white' }}>Thick</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.functionButton} onPress={() => {
//                     this.setState({ thickness: 5 })
//                   }}>
//                     <Text style={{ color: 'white' }}>Thin</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <SketchCanvas
           
//                 localSourceImage={{ filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit' }}
//                 // localSourceImage={{ filename: 'bulb.png', directory: RNSketchCanvas.MAIN_BUNDLE }}
//                 ref={ref => this.canvas = ref}
//                 style={{ flex: 1 }}
//                 strokeColor={this.state.color}
//                 strokeWidth={this.state.thickness}
//                 onStrokeStart={(x, y) => {
//                   console.log('x: ', x, ', y: ', y)
//                   this.setState({ message: 'Start' })
//                 }}
//                 onStrokeChanged={(x, y) => {
//                   console.log('x: ', x, ', y: ', y)
//                   this.setState({ message: 'Changed' })
//                 }}
//                 onStrokeEnd={() => {
//                   this.setState({ message: 'End' })
//                 }}
//                 onPathsChange={(pathsCount) => {
//                   console.log('pathsCount', pathsCount)
//                 }}

                
//               />
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <View style={{ flexDirection: 'row' }}>
//                   <TouchableOpacity style={[styles.functionButton, { backgroundColor: 'red' }]} onPress={() => {
//                     this.setState({ color: '#FF0000' })
//                   }}>
//                     <Text style={{ color: 'white' }}>Red</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.functionButton, { backgroundColor: 'black' }]} onPress={() => {
//                     this.setState({ color: '#000000' })
//                   }}>
//                     <Text style={{ color: 'white' }}>Black</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={{ marginRight: 8, fontSize: 20 }}>{this.state.message}</Text>
//                 <TouchableOpacity style={[styles.functionButton, { backgroundColor: 'black', width: 90 }]} onPress={() => {
//                   console.log(this.canvas.getPaths())
//                   Alert.alert(JSON.stringify(this.canvas.getPaths()))
//                   this.canvas.getBase64('jpg', false, true, true, (err, result) => {
//                     console.log(result)
//                   })
//                 }}>
//                   <Text style={{ color: 'white' }}>Get Paths</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         }

//         {
//           this.state.example === 3 &&
//           <View style={{ flex: 1, flexDirection: 'column' }}>
//             <RNSketchCanvas
//               ref={ref => this.canvas1 = ref}
//               user={'user1'}
//               containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               onStrokeEnd={data => {
//               }}
//               closeComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Close</Text></View>}
//               onClosePressed={() => {
//                 this.setState({ example: 0 })
//               }}
//               undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
//               onUndoPressed={(id) => {
//                 this.canvas2.deletePath(id)
//               }}
//               clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
//               onClearPressed={() => {
//                 this.canvas2.clear()
//               }}
//               eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
//               strokeComponent={color => (
//                 <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
//               )}
//               strokeSelectedComponent={(color, index, changed) => {
//                 return (
//                   <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
//                 )
//               }}
//               strokeWidthComponent={(w) => {
//                 return (<View style={styles.strokeWidthButton}>
//                   <View style={{
//                     backgroundColor: 'white', marginHorizontal: 2.5,
//                     width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
//                   }} />
//                 </View>
//                 )
//               }}
//               defaultStrokeIndex={0}
//               defaultStrokeWidth={5}
//               saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
//               savePreference={() => {
//                 return {
//                   folder: 'RNSketchCanvas',
//                   filename: String(Math.ceil(Math.random() * 100000000)),
//                   transparent: true,
//                   imageType: 'jpg'
//                 }
//               }}
//               onSketchSaved={(success, path) => {
//                 Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
//               }}
//               onStrokeEnd={(path) => {
//                 this.canvas2.addPath(path)
//               }}
//               onPathsChange={(pathsCount) => {
//                 console.log('pathsCount(user1)', pathsCount)
//               }}
//             />
//             <RNSketchCanvas
//               ref={ref => this.canvas2 = ref}
//               user={'user2'}
//               containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               onStrokeEnd={data => {
//               }}
//               undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
//               onUndoPressed={(id) => {
//                 this.canvas1.deletePath(id)
//               }}
//               clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
//               onClearPressed={() => {
//                 this.canvas1.clear()
//               }}
//               eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
//               strokeComponent={color => (
//                 <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
//               )}
//               strokeSelectedComponent={(color, index, changed) => {
//                 return (
//                   <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
//                 )
//               }}
//               strokeWidthComponent={(w) => {
//                 return (<View style={styles.strokeWidthButton}>
//                   <View style={{
//                     backgroundColor: 'white', marginHorizontal: 2.5,
//                     width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
//                   }} />
//                 </View>
//                 )
//               }}
//               defaultStrokeIndex={0}
//               defaultStrokeWidth={5}
//               saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
//               savePreference={() => {
//                 return {
//                   folder: 'RNSketchCanvas',
//                   filename: String(Math.ceil(Math.random() * 100000000)),
//                   transparent: true,
//                   imageType: 'jpg'
//                 }
//               }}
//               onSketchSaved={(success, path) => {
//                 Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
//               }}
//               onStrokeEnd={(path) => {
//                 this.canvas1.addPath(path)
//               }}
//               onPathsChange={(pathsCount) => {
//                 console.log('pathsCount(user2)', pathsCount)
//               }}
//             />
//           </View>
//         }

//         {
//           this.state.example === 4 &&
//           (this.state.photoPath === null ?
//             <View style={styles.cameraContainer}>
//               {/* <RNCamera
//                 ref={ref => {
//                   this.camera = ref;
//                 }}
//                 style={styles.preview}
//                 type={RNCamera.Constants.Type.back}
//                 flashMode={RNCamera.Constants.FlashMode.on}
//                 permissionDialogTitle={'Permission to use camera'}
//                 permissionDialogMessage={'We need your permission to use your camera phone'}
//               /> */}
//               <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', }}>
//                 <TouchableOpacity
//                   onPress={this.takePicture.bind(this)}
//                   style={styles.capture}
//                 >
//                   <Text style={{ fontSize: 14 }}> SNAP </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             :
//             <View style={{ flex: 1, flexDirection: 'row' }}>
//               <RNSketchCanvas
//                 localSourceImage={{ filename: this.state.photoPath, directory: null, mode: 'AspectFit' }}
//                 containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
//                 canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
//                 onStrokeEnd={data => {
//                 }}
//                 closeComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Close</Text></View>}
//                 onClosePressed={() => {
//                   this.setState({ example: 0 })
//                 }}
//                 undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
//                 onUndoPressed={(id) => {
//                   // Alert.alert('do something')
//                 }}
//                 clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
//                 onClearPressed={() => {
//                   // Alert.alert('do something')
//                 }}
//                 eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
//                 strokeComponent={color => (
//                   <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
//                 )}
//                 strokeSelectedComponent={(color, index, changed) => {
//                   return (
//                     <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
//                   )
//                 }}
//                 strokeWidthComponent={(w) => {
//                   return (<View style={styles.strokeWidthButton}>
//                     <View style={{
//                       backgroundColor: 'white', marginHorizontal: 2.5,
//                       width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
//                     }} />
//                   </View>
//                   )
//                 }}
//                 defaultStrokeIndex={0}
//                 defaultStrokeWidth={5}
//                 saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
//                 savePreference={() => {
//                   return {
//                     folder: 'RNSketchCanvas',
//                     filename: String(Math.ceil(Math.random() * 100000000)),
//                     transparent: false,
//                     imageType: 'png'
//                   }
//                 }}
//                 onSketchSaved={(success, path) => {
//                   Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
//                 }}
//                 onPathsChange={(pathsCount) => {
//                   console.log('pathsCount', pathsCount)
//                 }}
//               />
//             </View>)
//         }

//         {
//           this.state.example === 5 &&
//           <View style={{ flex: 1, flexDirection: 'row' }}>
//             <RNSketchCanvas
//               localSourceImage={{ filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit' }}
//               // localSourceImage={{ filename: 'bulb.png', directory: RNSketchCanvas.MAIN_BUNDLE }}
//               containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               onStrokeEnd={data => {
//               }}
//               closeComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Close</Text></View>}
//               onClosePressed={() => {
//                 this.setState({ example: 0 })
//               }}
//               undoComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Undo</Text></View>}
//               onUndoPressed={(id) => {
//                 // Alert.alert('do something')
//               }}
//               clearComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Clear</Text></View>}
//               onClearPressed={() => {
//                 // Alert.alert('do something')
//               }}
//               eraseComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Eraser</Text></View>}
//               strokeComponent={color => (
//                 <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
//               )}
//               strokeSelectedComponent={(color, index, changed) => {
//                 return (
//                   <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
//                 )
//               }}
//               strokeWidthComponent={(w) => {
//                 return (<View style={styles.strokeWidthButton}>
//                   <View  style={{
//                   backgroundColor: 'white', marginHorizontal: 2.5,
//                   width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
//                   }} />
//                 </View>
//               )}}
//               defaultStrokeIndex={0}
//               defaultStrokeWidth={5}
//               saveComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Save</Text></View>}
//               savePreference={() => {
//                 return {
//                   folder: 'RNSketchCanvas',
//                   filename: String(Math.ceil(Math.random() * 100000000)),
//                   transparent: false,
//                   includeImage: false,
//                   cropToImageSize: false,
//                   imageType: 'jpg'
//                 }
//               }}
//               onSketchSaved={(success, path) => {
//                 Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
//               }}
//               onPathsChange={(pathsCount) => {
//                 console.log('pathsCount', pathsCount)
//               }}
//             />
//           </View>
//         }

//         {
//           this.state.example === 6 &&
//           <View style={{ flex: 1, flexDirection: 'row' }}>
//             <RNSketchCanvas
//               text={[
//                 { text: 'Welcome to my GitHub', font: 'fonts/IndieFlower.ttf', fontSize: 30, position: { x: 0, y: 0 }, anchor: { x: 0, y: 0 }, coordinate: 'Absolute', fontColor: 'red' },
//                 { text: 'Center\nMULTILINE', fontSize: 25, position: { x: 0.5, y: 0.5 }, anchor: { x: 0.5, y: 0.5 }, coordinate: 'Ratio', overlay: 'SketchOnText', fontColor: 'black', alignment: 'Center', lineHeightMultiple: 1 },
//                 { text: 'Right\nMULTILINE', fontSize: 25, position: { x: 1, y: 0.25 }, anchor: { x: 1, y: 0.5 }, coordinate: 'Ratio', overlay: 'TextOnSketch', fontColor: 'black', alignment: 'Right', lineHeightMultiple: 1 },
//                 { text: 'Signature', font: 'Zapfino', fontSize: 40, position: { x: 0, y: 1 }, anchor: { x: 0, y: 1 }, coordinate: 'Ratio', overlay: 'TextOnSketch', fontColor: '#444444' }
//               ]}
//               containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
//               onStrokeEnd={data => {
//               }}
//               closeComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Close</Text></View>}
//               onClosePressed={() => {
//                 this.setState({ example: 0 })
//               }}
//               undoComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Undo</Text></View>}
//               onUndoPressed={(id) => {
//                 // Alert.alert('do something')
//               }}
//               clearComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Clear</Text></View>}
//               onClearPressed={() => {
//                 // Alert.alert('do something')
//               }}
//               eraseComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Eraser</Text></View>}
//               strokeComponent={color => (
//                 <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
//               )}
//               strokeSelectedComponent={(color, index, changed) => {
//                 return (
//                   <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
//                 )
//               }}
//               strokeWidthComponent={(w) => {
//                 return (<View style={styles.strokeWidthButton}>
//                   <View  style={{
//                   backgroundColor: 'white', marginHorizontal: 2.5,
//                   width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
//                   }} />
//                 </View>
//               )}}
//               defaultStrokeIndex={0}
//               defaultStrokeWidth={5}
//               saveComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Save</Text></View>}
//               savePreference={() => {
//                 return {
//                   folder: 'RNSketchCanvas',
//                   filename: String(Math.ceil(Math.random() * 100000000)),
//                   transparent: false,
//                   includeImage: false,
//                   includeText: false,
//                   cropToImageSize: false,
//                   imageType: 'jpg'
//                 }
//               }}
//               onSketchSaved={(success, path) => {
//                 Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
//               }}
//               onPathsChange={(pathsCount) => {
//                 console.log('pathsCount', pathsCount)
//               }}
//             />
//           </View>
//         }

//         {
//           this.state.example === 7 &&
//           <View style={{ flex: 1, flexDirection: 'row' }}>
//             <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 36 }}
//               scrollEnabled={this.state.scrollEnabled}
//             >
//               <TouchableOpacity onPress={() => this.setState({ example: 0 })}>
//                 <Text>Close</Text>
//               </TouchableOpacity>
//               <SketchCanvas
//                 text={[
//                   { text: 'Page 1', position: { x: 20, y: 20 }, fontSize: Platform.select({ ios: 24, android: 48 }) },
//                   { text: 'Signature', font: Platform.select({ ios: 'Zapfino', android: 'fonts/IndieFlower.ttf' }), position: { x: 20, y: 220 }, fontSize: Platform.select({ ios: 24, android: 48 }), fontColor: 'red' }
//                 ]}
//                 localSourceImage={{ filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit' }}
//                 style={styles.page}
//                 onStrokeStart={() => this.setState({ scrollEnabled: false })}
//                 onStrokeEnd={() => this.setState({ scrollEnabled: true })}
//               />
//               <SketchCanvas
//                 text={[{ text: 'Page 2', position: { x: 0.95, y: 0.05 }, anchor: { x: 1, y: 0 }, coordinate: 'Ratio', fontSize: Platform.select({ ios: 24, android: 48 }) }]}
//                 style={styles.page}
//                 onStrokeStart={() => this.setState({ scrollEnabled: false })}
//                 onStrokeEnd={() => this.setState({ scrollEnabled: true })}
//               />
//               <SketchCanvas
//                 text={[{ text: 'Page 3', position: { x: 0.5, y: 0.95 }, anchor: { x: 0.5, y: 1 }, coordinate: 'Ratio', fontSize: Platform.select({ ios: 24, android: 48 }) }]}
//                 style={styles.page}
//                 onStrokeStart={() => this.setState({ scrollEnabled: false })}
//                 onStrokeEnd={() => this.setState({ scrollEnabled: true })}
//               />
//               <SketchCanvas
//                 text={[{ text: 'Page 4', position: { x: 20, y: 20 }, fontSize: Platform.select({ ios: 24, android: 48 }) }]}
//                 style={styles.page}
//                 onStrokeStart={() => this.setState({ scrollEnabled: false })}
//                 onStrokeEnd={() => this.setState({ scrollEnabled: true })}
//               />
//             </ScrollView>
//           </View>
//         }
//       </View>
//       </SafeAreaView>
//    );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   strokeColorButton: {
//     marginHorizontal: 2.5,
//     marginVertical: 8,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//   },
//   strokeWidthButton: {
//     marginHorizontal: 2.5,
//     marginVertical: 8,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#39579A'
//   },
//   functionButton: {
//     marginHorizontal: 2.5,
//     marginVertical: 8,
//     height: 30,
//     width: 60,
//     backgroundColor: '#39579A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   cameraContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black',
//     alignSelf: 'stretch'
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   capture: {
//     flex: 0,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 15,
//     paddingHorizontal: 20,
//     alignSelf: 'center',
//     margin: 20
//   },
//   page: {
//     flex: 1,
//     height: 300,
//     elevation: 2,
//     marginVertical: 8,
//     backgroundColor: 'white',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.75,
//     shadowRadius: 2
//   }
// });

// AppRegistry.registerComponent('example', () => App);

