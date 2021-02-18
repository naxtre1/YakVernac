import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ImageBackground, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../static/constant';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { strings } from '../locales/i18n';
import { connect } from 'react-redux'
import { getLangResourceByType } from '../utils/helpers';
import Toast from 'react-native-simple-toast'
import firestore, { firebase } from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import UUIDGenerator from 'react-native-uuid-generator'
import {
    login,
    setInvitation,
    setFriends,
    setLang,
    setBlockeds,
} from '../redux/action'
import Global from '../utils/global';
import I18n from 'react-native-i18n';
import SimpleToast from 'react-native-simple-toast';

const connector = connect((state) => {
    return {
        lang: state.lang,
        user: state.user
    }
}, { login, setInvitation, setFriends, setLang, setBlockeds });

const LoginPasswordScreen = (props) => {
    const { email, isFromSignUp } = props.navigation.state.params;
    const { navigate } = props.navigation;

    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [togglePassword, setTogglePassword] = useState(true);
    const lang = props.lang;

    const [loggedIn, setLoggedIn] = useState(false);
    let nonProfile = false;
    var isOpened = false;
    var openResult;

    const createUser = (user) => {
        const friends = ['FmIfeWNRGIh2s9iStQberUXIrgA3'];
        const myPic = 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.png?alt=media&token=ee7f968c-00c9-4097-8e0b-53f3a3562c05';

        let username = user.email.substring(0, user.email.indexOf('@'))
        let myuser = {
            uid: user.uid,
            email: user.email,
            username,
            playerId: Global.getInstance().playerId,
            notify: 1,
            languageLearning: props.lang.languageLearning,
            languageNative: props.lang.languageNative,
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
            setIsLoading(false)
            props.login(myuser);

            props.navigation.navigate('Start');
        }).catch((error) => {
            setIsLoading(false)
            SimpleToast.show(strings('Password.login_failed'));

            props.navigation.navigate('Auth');
        });
    }

    const onInputChange = (input) => {
        if (input.length > 7) {
            setIsValid(true);
            setErrorMessage('');
        } else {
            setIsValid(false);
            setErrorMessage('');
        }
        setPassword(input);
    }

    const onContinue = () => {
        if (isValid) {
            authUser();
        } else {
            if (password.length == 0) {
                setErrorMessage(strings('Password.required'));
            } else if (password.length < 8) {
                setErrorMessage(strings('Password.invalid'));
            }
        }
    }

    const authUser = () => {
        setIsLoading(true);
        try {
            if (isFromSignUp) {
                auth().createUserWithEmailAndPassword(email, password)
                    .then((result) => onLoginSuccess(result.user))
                    .catch((error) => {
                        console.log("isFromSignUp", error);
                        if (error.code === 'auth/email-already-in-use') {
                            onLoginFail(strings('Password.already_exist'));
                        } else if (error.code === 'auth/invalid-email') {
                            onLoginFail(strings('Password.invalid_email'));
                        } else {
                            onLoginFail(strings('Password.something_wrong'));
                        }
                    });
            } else {
                auth().signInWithEmailAndPassword(email, password)
                    .then((result) => {
                        onLoginSuccess(result.user);
                    }).catch(error => {
                        console.log("isFromLogin", error);
                        if (error.code === 'auth/email-already-in-use') {
                            onLoginFail(strings('Password.already_exist'));
                        } else if (error.code === 'auth/account-exists-with-different-credential') {
                            onLoginFail(strings('Password.auth_invalid'));
                        } else {
                            onLoginFail(strings('Password.something_wrong'));
                        }
                    });
            }

        } catch (error) {
            console.log("onLoginFail", error);

            onLoginFail(strings('Password.something_wrong'));
        }
    }

    const onLoginSuccess = (user) => {
        console.log("onLoginSuccess", user);

        // setIsLoading(false);
        fetchUserData(user);
    }

    const onLoginFail = (error) => {
        setIsLoading(false);
        setErrorMessage(error);
    }

    // const authUser = () => {
    //     setIsLoading(true);
    //     try {
    //         auth().signInWithEmailAndPassword(email, password)
    //             .then((result) => {
    //                 onLoginSuccess(result.user);
    //             })
    //             .catch(e => {
    //                 auth().createUserWithEmailAndPassword(email, password)
    //                     .then((result) => onLoginSuccess(result.user))
    //                     .catch((e) => onLoginFail(e));
    //             });
    //     } catch (error) {
    //         console.log("onLoginFail", error);

    //         onLoginFail(error);
    //     }
    // }

    // const onLoginSuccess = (user) => {
    //     console.log("onLoginSuccess", user);

    //     // setIsLoading(false);
    //     fetchUserData(user);
    // }

    // const onLoginFail = (e) => {
    //     console.log("onLoginFail", e);

    //     setIsLoading(false);
    //     setErrorMessage(strings('Password.auth_invalid'));
    // }

    const gotoProfile = async (user) => {
        try {
            if (nonProfile) {
                return
            }
            nonProfile = true
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

                        console.log("go profile page : ");
                        props.login(myuser)
                        props.setFriends(friendData)
                        props.navigation.navigate('Start')
                        setTimeout(() => {
                            props.navigation.navigate('Profile')
                        }, 200)
                    })
                })
            })
        } catch (error) {
            console.log("go profile error : ", error);

            setLoggedIn(false);
            setIsLoading(false);
        }
    }

    const fetchUserData = (user) => {
        try {
            if (user) {
                setLoggedIn(true);
                firestore().collection('user').doc(user.uid).get().then(async doc => {
                    console.log("doc : ", doc);
                    if (doc.exists) {
                        const appUser = doc.data()
                        appUser.playerId = Global.getInstance().playerId
                        appUser.notify = appUser.notify == 0 ? 0 : 1
                        firestore().collection('user').doc(user.uid).update(appUser)
                        appUser.uid = user.uid
                        props.setLang({
                            languageLearning: appUser.languageLearning,
                            languageNative: appUser.languageNative
                        })
                        props.login(appUser)
                        const Invitations = {}
                        firestore().collection('user').doc(user.uid).collection('Invitations').get().then(collection => {
                            for (const doc of collection.docs) {
                                Invitations[doc.id] = doc.data()
                            }
                            props.setInvitation(Invitations)
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
                        props.setFriends(friends)
                        const blockedBy = {}
                        const blockedByIDs = appUser.blockedBy
                        for (const id of blockedByIDs) {
                            const blocked = await firestore().collection('user').doc(id).get()
                            if (blocked.data()) {
                                blockedBy[id] = blocked.data()
                            }
                        }
                        props.setBlockeds(blockedBy)
                        if (isOpened) {
                            if (openResult !== undefined) {
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
                        // console.log("gotoProfile : ");

                        // gotoProfile(user)
                        createUser(user);
                    }
                }).catch(error => {
                    // console.log(error.message)
                    // setLoggedIn(false)

                    // gotoProfile(user)
                    setLoggedIn(false)

                    createUser(user);
                })
            } else {
                setLoggedIn(false)

                SimpleToast.show(strings('Password.something_wrong'));
                navigate('Auth');
                setIsLoading(false)
            }
        } catch (error) {
            setLoggedIn(false)
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={require('../assets/home_bg.png')} style={{ flex: 1, resizeMode: 'cover' }}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.arrowBack} onPress={() => {
                        props.navigation.goBack();
                    }}>
                        <AntDesignIcon name='arrowleft' size={24} color="black" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.langContainer}>
                    <AntDesignIcon name='down' size={12} color="black" />
                    <Text style={styles.langText}>English</Text>
                    <AntDesignIcon name='flag' size={16} color="black" />
                </TouchableOpacity> */}
                </View>
                <ScrollView contentContainerStyle={styles.ScrollView} keyboardShouldPersistTaps={true}>
                    <View style={{ marginHorizontal: 16 }}>
                        <Text style={styles.title}>
                            YAKVERNAC
                    </Text>
                        {errorMessage.length > 0
                            ? <Text style={{ textAlign: 'center', fontSize: 20, color: errorMessage.length > 0 ? colors.error : colors.text, marginBottom: 12 }}>
                                {strings('Password.oops')}
                            </Text>
                            : null}
                        <Text style={{ textAlign: 'center', fontSize: 20, color: errorMessage.length > 0 ? colors.error : colors.text }}>
                            {errorMessage.length > 0 ? errorMessage : strings('Password.password')}
                        </Text>
                        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <View style={styles.SectionStyle}>
                                <FontAwesome name='lock' size={20} color={colors.blue} />
                                <TextInput
                                    style={{ flex: 1, marginHorizontal: 8 }}
                                    placeholder={strings('Password.placeholder')}
                                    keyboardType='default'
                                    secureTextEntry={togglePassword ? true : false}
                                    onChangeText={(value) => {
                                        onInputChange(value);
                                    }}
                                    value={password}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => {
                                    setTogglePassword(!togglePassword);
                                }}>
                                    <FontAwesome name='eye-slash' size={20} color={colors.blue} />
                                </TouchableOpacity>
                            </View>
                            {isLoading
                                ? <ActivityIndicator size="large" color={colors.blue}
                                    style={{
                                        marginVertical: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} />
                                : <TouchableOpacity style={styles.button} onPress={() => {
                                    onContinue();
                                }}>
                                    <Text style={styles.buttonText}>{strings('Password.continue')}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    ScrollView: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        marginHorizontal: 16,
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrowBack: {
        flex: 1,
        alignSelf: 'flex-start'
    },
    langContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    langText: {
        paddingHorizontal: 8,
        fontSize: 16,
        fontWeight: 'bold'
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 24,
        color: colors.darkOrange
    },
    SectionStyle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: colors.blue,
        borderBottomWidth: 1,
    },
    button: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 8
    },
    buttonText: {
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
});

export default (connector(LoginPasswordScreen));