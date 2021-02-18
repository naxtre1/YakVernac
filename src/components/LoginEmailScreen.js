import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, ImageBackground, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../static/constant';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import LangModal from './ChooseLangModal';
import { strings } from '../locales/i18n';
import { connect } from 'react-redux'
import { getLangResourceByType } from '../utils/helpers';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Spinner from "react-native-loading-spinner-overlay"
import firestore, { firebase } from '@react-native-firebase/firestore'
import {
    login,
    setInvitation,
    setFriends,
    setLang,
    setBlockeds,
} from '../redux/action'
import Global from '../utils/global';
import SimpleToast from 'react-native-simple-toast';

GoogleSignin.configure({
    webClientId: '284275940374-7frr94qo2aoej2a0ekgl1mguvsgjvo9c',
});

const connector = connect((state) => {
    return {
        lang: state.lang,
        user: state.user
    }
}, { login, setInvitation, setFriends, setLang, setBlockeds });

const LoginEmailScreen = (props) => {
    const { isFromSignUp } = props.navigation.state.params
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const lang = props.lang;
    const [isLoading, setIsLoading] = useState(false);

    const [loggedIn, setLoggedIn] = useState(false);
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
            props.login(myuser);

            props.navigation.navigate('Start');
        }).catch((error) => {
            SimpleToast.show(strings('Email.login_failed'));

            props.navigation.navigate('Auth');
        });
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
                                    props.navigation.navigate("PostScreen")
                                }
                            }
                        } else {
                            props.navigation.navigate('Start');
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
                    createUser(user);
                })
            } else {
                setLoggedIn(false)

                SimpleToast.show(strings('Email.something_wrong'));
                props.navigation.navigate('Auth');
            }
        } catch (error) {
            setLoggedIn(false)

            SimpleToast.show(strings('Email.something_wrong'));
        }
    }

    // 1- if account login via email firebase and login with same fb account it says already exists
    // 2- if account login via email firebase and login with same google account it overrides email account
    const facebookLogin = async () => {
        try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                // console.log('User cancelled the login process');
                return;
            }

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                SimpleToast.show(strings('Email.access_token_failed'));
                return;
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            let user = await auth().signInWithCredential(facebookCredential);

            if (user) {
                fetchUserData(user.user);
            } else {
                SimpleToast.show(strings('Email.something_wrong'));
                // Alert.alert('Play services are not available :  fb user details errror');
            }
        } catch (error) {
            if (error.code == "auth/email-already-in-use" || error.code == 'auth/account-exists-with-different-credential') {
                SimpleToast.show(strings('Email.exist'));
            } else {
                SimpleToast.show(strings('Email.something_wrong'));
            }
            // if (error.code == "auth/email-already-in-use" || error.code == 'auth/account-exists-with-different-credential') {
            //     Alert.alert('FB Error : ', error.toString());
            // } else {
            //     Alert.alert('FB Error ', error.toString());
            // }
        }
    }

    const googleLogin = async () => {
        try {
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            let user = await auth().signInWithCredential(googleCredential);

            if (user) {
                fetchUserData(user.user);
            } else {
                SimpleToast.show(strings('Email.something_wrong'));
                // Alert.alert('Play services are not available :  fb user details errror');
            }
        } catch (error) {
            console.log("Google Error : ", error);
            if (error.code == "auth/email-already-in-use" || error.code == 'auth/account-exists-with-different-credential') {
                SimpleToast.show(strings('Email.exist'));
            } else {
                SimpleToast.show(strings('Email.something_wrong'));
            }
            // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            //     // when user cancels sign in process,
            //     Alert.alert('Process Cancelled')
            // } else if (error.code === statusCodes.IN_PROGRESS) {
            //     // when in progress already
            //     Alert.alert('Process in progress')
            // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            //     // when play services not available
            //     Alert.alert('Play services are not available')
            // } else {
            //     // some other error
            //     if (error.code == "auth/email-already-in-use" || error.code == 'auth/account-exists-with-different-credential') {
            //         Alert.alert('Google Error : ', error.toString());
            //     } else {
            //         Alert.alert('Google Error : ', error.toString());
            //     }
            // }
        }
    }

    const toggleLangModal = () => {
        setIsModalVisible(!isModalVisible);
    }

    const onInputChange = (input) => {
        if (input.length > 0 && input.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setIsValid(true);
            setErrorMessage('');
        } else {
            setIsValid(false);
            setErrorMessage('');
        }
        setEmail(input);
    }

    const onContinue = () => {
        if (isValid) {
            checkIfUserExists();
        } else {
            if (email.length == 0) {
                setErrorMessage(strings('Email.required'));
            } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                setErrorMessage(strings('Email.invalid'))
            }
        }
    }

    const checkIfUserExists = () => {
        setIsLoading(true);
        firestore().collection('user').where('email', '==', email.trim()).get().then(snapshot => {
            if (snapshot.docs.length > 0) {
                if (!isFromSignUp) {
                    props.navigation.navigate("LoginPassword", { email: email, isFromSignUp: isFromSignUp });
                } else {
                    setErrorMessage(strings('Email.user_exist'))
                }
                setIsLoading(false);
            } else {
                if (isFromSignUp) {
                    props.navigation.navigate("LoginPassword", { email: email, isFromSignUp: isFromSignUp });
                } else {
                    setErrorMessage(strings('Email.user_incorrect'))
                }
                setIsLoading(false);
            }
        }).catch(error => {
            console.log("error", error);
            setErrorMessage(strings('Email.something_wrong'))
            setIsLoading(false);
        });
    }

    // if(isLoading){
    //     return <Spinner visible={isLoading} />
    // }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={require('../assets/home_bg.png')} style={{ flex: 1, resizeMode: 'cover' }}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.arrowBack} onPress={() => {
                        props.navigation.goBack();
                    }}>
                        <AntDesignIcon name='arrowleft' size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.langContainer} onPress={() => {
                        toggleLangModal();
                    }}>
                        <AntDesignIcon name='down' size={12} color="black" />
                        <Text style={styles.langText}>{getLangResourceByType(lang.languageNative).lang}</Text>
                        <Image source={getLangResourceByType(lang.languageNative).source} resizeMode='cover' style={{ height: 32, width: 28 }} />
                        {/* <AntDesignIcon name='flag' size={16} color="black" /> */}
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.ScrollView} keyboardShouldPersistTaps={true}>
                    <View style={{ marginHorizontal: 16 }}>
                        <Text style={styles.title}>
                            YAKVERNAC
                    </Text>
                        {errorMessage.length > 0
                            ? <Text style={{ textAlign: 'center', fontSize: 20, color: errorMessage.length > 0 ? colors.error : colors.text, marginBottom: 12 }}>
                                {strings('Email.oops')}
                            </Text>
                            : null}
                        <Text style={{ textAlign: 'center', fontSize: 20, color: errorMessage.length > 0 ? colors.error : colors.text }}>
                            {errorMessage.length > 0 ? errorMessage : props.navigation.state.params.title}
                        </Text>
                        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 32 }}>
                            <View style={styles.SectionStyle}>
                                <MaterialIcons name='email' size={20} color={colors.blue} />
                                <TextInput
                                    style={{ flex: 1, marginHorizontal: 8 }}
                                    placeholder={strings('Email.email')}
                                    keyboardType='email-address'
                                    // secureTextEntry={true}
                                    onChangeText={(value) => {
                                        onInputChange(value);
                                    }}
                                    value={email}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {isValid ?
                                    <TouchableOpacity>
                                        <MaterialIcons name={'check'} size={20} color={colors.blue} />
                                    </TouchableOpacity>
                                    : errorMessage.length > 0
                                        ? <TouchableOpacity>
                                            <MaterialIcons name={'close'} size={20} color={colors.error} />
                                        </TouchableOpacity>
                                        : null}

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
                                    <Text style={styles.buttonText}>{strings('Email.continue')}</Text>
                                </TouchableOpacity>
                            }
                            {/* <TouchableOpacity style={styles.button} onPress={() => {
                                onContinue();
                            }}>
                                <Text style={styles.buttonText}>{strings('Email.continue')}</Text>
                            </TouchableOpacity> */}
                            <View style={{ flexDirection: 'row', marginVertical: 32, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                         facebookLogin();
                                    }}
                                    style={{ height: 56, width: 56, borderRadius: 56, backgroundColor: colors.grey, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>f</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        googleLogin();
                                    }}
                                    style={{ height: 56, width: 56, borderRadius: 56, backgroundColor: colors.grey, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>G+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
            <LangModal isModalVisible={isModalVisible}
                toggleLangModal={toggleLangModal} />
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

export default (connector(LoginEmailScreen));