import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux'
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
import { colors } from '../static/constant';
import SimpleToast from 'react-native-simple-toast';

const connector = connect((state) => {
    return {
        lang: state.lang,
        user: state.user
    }
}, { login, setInvitation, setFriends, setLang, setBlockeds });

const AuthLoadingScreen = (props) => {
    const { navigate } = props.navigation;

    const [loggedIn, setLoggedIn] = useState(false);
    let nonProfile = false;
    var isOpened = false;
    var openResult;

    useEffect(() => {
        fetchUserData();
    }, []);

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
            SimpleToast.show("Login Failed. Please try again");

            props.navigation.navigate('Auth');
        });
    }

    const gotoProfile = async (user) => {
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
                    props.login(myuser)
                    props.setFriends(friendData)
                    props.navigation.navigate('Start')
                    setTimeout(() => {
                        props.navigation.navigate('Profile')
                    }, 200)
                })
            })
        })
    }

    const fetchUserData = () => {
        let user = auth().currentUser;

        if (user) {
            setLoggedIn(true);
            firestore().collection('user').doc(user.uid).get().then(async doc => {
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
                    // gotoProfile(user)

                    createUser(user);
                }
            }).catch(error => {
                //alert(error);
                // console.log(error.message)
                // gotoProfile(user)

                createUser(user);
            })
        } else {
            setLoggedIn(false)

            // SimpleToast.show('Something went wrong. please try again');
            navigate('Auth');
        }
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.blue}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default (connector(AuthLoadingScreen));