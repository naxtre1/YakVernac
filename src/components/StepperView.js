import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, SectionList, FlatList, ActivityIndicator, Image, Dimensions, TextInput } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { colors } from '../static/constant';
import { connect } from 'react-redux'
import { removeInvitation, logout } from '../redux/action'
import * as TopicNames from '../static/TopicNames.json';
import firestore from '@react-native-firebase/firestore'
import { Games } from '../static/entries';
import Toast from 'react-native-simple-toast'
import { showMessage } from "react-native-flash-message";
import auth from '@react-native-firebase/auth'
import { getLangInitial } from '../static/constant'
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { strings } from '../locales/i18n';
import Autocomplete from 'react-native-autocomplete-input';
import { NavigationEvents } from 'react-navigation'

const { height, width } = Dimensions.get('window');
const connector = connect((state) => {
    return {
        user: state.user,
        Invitations: state.Invitations,
        lang: state.lang,
        profilePics: state.profilePics,
        xp: state.xp,
        friends: state.friends,
    }
}, { removeInvitation, logout });

// const StepperTwo = (props) => {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 32 }}>
//                 <View style={{ width: width * 0.8, height: width * 0.8, borderRadius: width * 0.8, borderWidth: 5, borderColor: colors.blue }} />
//                 <TouchableOpacity
//                     onPress={() => {
//                         props.SetAGame([Games[2]]);
//                     }}
//                     style={{ height: 68, width: 68, position: 'absolute', left: width * 0.2 - 50, top: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 34, justifyContent: 'center', alignItems: 'center' }}>
//                     <Image source={require('../assets/lips.png')} style={{ height: 48, width: 48 }} resizeMode='contain' />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => {
//                         props.SetAGame([Games[2], Games[4]]);
//                     }}
//                     style={{ height: 68, width: 68, position: 'absolute', right: width * 0.2 - 50, top: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 34, justifyContent: 'center', alignItems: 'center' }}>
//                     <Image source={require('../assets/hear.png')} style={{ height: 48, width: 48 }} resizeMode='contain' />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => {
//                         props.SetAGame([Games[1], Games[3], Games[4]]);
//                     }}
//                     style={{ height: 68, width: 68, position: 'absolute', left: width * 0.2 - 50, bottom: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 34, justifyContent: 'center', alignItems: 'center' }}>
//                     <Image source={require('../assets/pen.png')} style={{ height: 48, width: 48 }} resizeMode='contain' />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => {
//                         props.SetAGame([Games[0], Games[1], Games[2], Games[3]]);
//                     }}
//                     style={{ height: 68, width: 68, position: 'absolute', right: width * 0.2 - 50, bottom: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 34, justifyContent: 'center', alignItems: 'center' }}>
//                     <Image source={require('../assets/eye.png')} style={{ height: 48, width: 48 }} resizeMode='contain' />
//                 </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//                 onPress={() => {
//                     props.SetAGame([Games[5]]);
//                 }}
//                 style={{ marginBottom: 32, height: 80, width: 80, borderRadius: 50, backgroundColor: colors.blue, justifyContent: 'center', alignItems: 'center', }}>
//                 <Image source={require('../assets/compose.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
//             </TouchableOpacity>
//         </View>
//     );
// }

const StepperTwo = (props) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.SetAGame([Games[2]]);
                        }}
                        style={{ height: 120, width: 120, backgroundColor: 'white', borderRadius: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/speak.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.SetAGame([Games[2], Games[4]]);
                        }}
                        style={{ height: 120, width: 120, backgroundColor: 'white', borderRadius: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/headset.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.SetAGame([Games[1], Games[3], Games[4]]);
                        }}
                        style={{ height: 120, width: 120, backgroundColor: 'white', borderRadius: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/create.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.SetAGame([Games[0], Games[1], Games[2], Games[3]]);
                        }}
                        style={{ height: 120, width: 120, backgroundColor: 'white', borderRadius: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/see.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                    }}
                    style={{ height: 80, width: 80, position: 'absolute', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211, 241, 250,0.8)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.opacityBlue }}>
                    <Image source={require('../assets/star.png')} style={{ height: 40, width: 40 }} resizeMode='contain' />
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[2]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', right: width * 0.2 - 60, top: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/speak.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[2], Games[4]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', left: width * 0.2 - 60, top: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/headset.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[1], Games[3], Games[4]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', right: width * 0.2 - 60, bottom: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/create.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[0], Games[1], Games[2], Games[3]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', left: width * 0.2 - 60, bottom: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/see.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                    }}
                    style={{ height: 75, width: 75, position: 'absolute', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211, 241, 250,0.8)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.opacityBlue }}>
                    <Image source={require('../assets/see.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity> */}
            </View>
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[2]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', right: width * 0.2 - 60, top: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/speak.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[2], Games[4]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', left: width * 0.2 - 60, top: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/headset.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[1], Games[3], Games[4]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', right: width * 0.2 - 60, bottom: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/create.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.SetAGame([Games[0], Games[1], Games[2], Games[3]]);
                    }}
                    style={{ height: 100, width: 100, position: 'absolute', left: width * 0.2 - 60, bottom: width * 0.2 - 28, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/see.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                    }}
                    style={{ height: 75, width: 75, position: 'absolute', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211, 241, 250,0.8)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.opacityBlue }}>
                    <Image source={require('../assets/see.png')} style={{ height: 50, width: 50 }} resizeMode='contain' />
                </TouchableOpacity>
            </View> */}
            <TouchableOpacity
                onPress={() => {
                    props.SetAGame([Games[5]]);
                }}
                style={{ marginBottom: 32, height: 100, width: 100, borderRadius: 10, backgroundColor: colors.button, justifyContent: 'center', alignItems: 'center', }}>
                <Image source={require('../assets/compose.png')} style={{ height: 50, width: 50, tintColor: colors.black }} resizeMode='contain' />
            </TouchableOpacity>
        </View>
    );
}

const StepperThree = (props) => {
    const [isShare, setIsShare] = useState(props.isShare);
    const [friendsNick, setFriendsNick] = useState(props.friendsNick);
    const [query, setQuery] = useState('');
    const [hideResults, setHideResults] = useState(false);
    const [userSelected, setUserSelected] = useState(false);

    const findFilm = (query) => {
        if (query === '') {
            return [];
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        let tempFilms = []
        for (const id in props.friends) {
            if (props.friends[id].username.search(regex) >= 0) {
                tempFilms.push(props.friends[id])
            }
        }
        return tempFilms
    }
    let films = findFilm(query);

    // const onInputChange = (value) => {
    //     setFriendsNick(value);
    // }

    const sendToFriend = () => {
        if (friendsNick.length === 0) {
            Toast.show(strings('StepperThree.required'));

            return;
        } else if (friendsNick.length < 4) {
            Toast.show(strings('StepperThree.invalid'));

            return;
        }

        var invitation = {
            game: props.selectedGame.screenTitle,
            words: props.selectedWordList.words,
            TextToTextTitle: props.TopicNameForTextToText,
            WordsFromTopic: props.selectedWordList.words
        }
        firestore().collection('user').where('username', '==', `${friendsNick}`).get().then(snapshot => {
            for (const doc of snapshot.docs) {
                const friend = doc.data()
                if (friend) {
                    const friendID = doc.id;
                    firestore().collection('user').doc(friendID).collection('Invitations').doc(props.uid).set(invitation)
                }
            }
            setFriendsNick('')
            setIsShare(false)
        })
    }

    return (
        <>
            {isShare
                ? <View style={styles.stepperThreeContainer}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>{strings('StepperThree.Share')}</Text>
                    {/* <TextInput
                        style={{
                            width: '100%',
                            marginTop: 16,
                            marginBottom: 8,
                            backgroundColor: colors.button,
                            borderRadius: 4,
                            textAlign: 'center',
                            fontSize: 20
                        }}
                        onChangeText={(value) => {
                            onInputChange(value);
                        }}
                        placeholder="JohnSmith007"
                        placeholderTextColor={colors.lightGrey}
                        autoCapitalize="none" /> */}
                    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
                        <Autocomplete
                            autoCapitalize="none"
                            autoCorrect={false}
                            hideResults={hideResults}
                            listStyle={{ margin: 0 }}
                            containerStyle={styles.autocompleteContainer}   
                            data={films}
                            defaultValue={query}
                            onChangeText={text => {
                                setQuery(text);
                                setHideResults(false);
                            }}
                            placeholder={strings('DrawThis.enter_friends')}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => {
                                    setFriendsNick(item.username);
                                    setQuery(item.username);
                                    setHideResults(true);
                                    setUserSelected(true)
                                }}>
                                    <Text style={{ fontSize: 15, margin: 2 }}>
                                        {item.username}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <TouchableOpacity style={userSelected ? styles.sendEnableButtonContainer : styles.sendButtonContainer}
                        onPress={() => {
                            sendToFriend();
                        }}>
                        <Text style={styles.sendText}>{strings('StepperThree.Send')}</Text>
                    </TouchableOpacity>
                </View>
                : <View style={styles.stepperThreeContainer}>
                    <TouchableOpacity
                        onPress={props.PlayGame}
                        style={styles.playButtonContainer}>
                        <Text style={styles.playText}>{strings('StepperThree.Play')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButtonContainer} onPress={() => { setIsShare(true) }}>
                        <Text style={styles.shareText}>{strings('StepperThree.Share')}</Text>
                    </TouchableOpacity>
                </View>}
        </>
    );
}

const StepperView = (props) => {
    const [activeStep, setActiveStep] = useState(1);
    const [ThirdmodalVisible, setThirdModalVisibleTrue] = useState(false);
    const [FourthmodalVisible, setFourthModalVisibleTrue] = useState(false);
    const [selectedGame, setSelectedGame] = useState();
    const [selectedWordList, setSelectedWordList] = useState([]);
    const [TopicNameForTextToText, setTopicNameForTextToText] = useState('');
    const [ImagesToGuess, setImagesToGuess] = useState(['']);
    const [TopicPictures, setTopicPictures] = useState({});
    const [Topics, setTopics] = useState([]);
    const [newestMsg, setnewestMsg] = useState('');
    const [loading, setLoading] = useState(true);

    console.log("User : ", props.user);

    const BuyPremium = () => {
        showMessage({
            message: 'Premium required!',
            description: 'Please buy Premium in order to access this topic.',
            type: "danger",
        });
    }

    const changeActiveStep = (index) => {
        setActiveStep(index);
    }

    useEffect(() => {
        fetchGameData();
    }, []);

    const PlayGame = async () => {
        firestore().collection('user').doc(props.user.uid).collection('lesson').add({
            lang: props.lang.languageLearning,
            start: Date.now(),
            end: Date.now()
        }).then(doc => {
            console.log("words : ", selectedWordList.words);
            console.log("topicwords : ", selectedWordList.words);
            console.log("TopicNameForTextToText : ", TopicNameForTextToText);
            console.log("selectedGame.screenTitle : ", selectedGame.screenTitle);
            props.navigation.navigate(selectedGame.screenTitle, { lessonID: doc.id, words: selectedWordList.words, topicwords: selectedWordList.words, TextToTextTitle: TopicNameForTextToText });
            setActiveStep(1);
        })
    }

    const SetAGame = (topics) => {
        var item = topics[Math.floor(Math.random() * topics.length)];
        setSelectedGame(item);
        setActiveStep(3);
    }

    const SetATopic = (item) => {
        // var topics = this.state.Topics;
        // var a = item.replace(new RegExp("[0-9]", "g"), i);

        // var myItem = topics.find(topic => topic.title === a);
        // var TextRealTitle = myItem.realTitle;
        // this.setState({ selectedWordList: myItem });
        // this.setState({ SelectTab: 2 })
        // this.setState({ TopicNameForTextToText: TextRealTitle });

        setSelectedWordList(item);
        setActiveStep(2);
        setTopicNameForTextToText(item.realTitle);
    }

    const capitalizeFirstLetter = (val) => {
        var title = val.replace(/[0-9]/g, " $&");
        var title2 = title.charAt(0).toUpperCase() + title.slice(1);
        return title2;
    }

    const fetchGameData = async () => {
        setLoading(true);

        let pictures = await firestore().collection('topics').doc('topicsPictures').get();
        setTopicPictures(pictures.data());

        props.navigation.setParams({
            handleThis: setThirdModalVisibleTrue,
            openMessages: setFourthModalVisibleTrue
        });

        var selectedWordList = { words: ['airport', 'apartment', 'building', 'bakery', 'bank', 'barber', 'store', 'cafe', 'cathedral', 'church'] }
        var selectedGame = { screenTitle: 'SayTheImage' }
        setSelectedGame(selectedGame);
        setSelectedWordList(selectedWordList);
        setTopicNameForTextToText('Places1');

        var lukas = props.user.pendDrawings;
        var data = [];
        for (var drawId in lukas) {
            lukas[drawId].drawingId = drawId
            data.push(lukas[drawId]);
        }
        setImagesToGuess(data);

        let topics = await firestore().collection('topics').doc(`${props.lang.languageNative}`).get();
        const mytopics = topics.data();
        var newData = [];
        let titleList = new Set();
        for (var property in mytopics) {
            var numNameTemp = property.replace(/[0-9]/g, '');
            var numName = "num".concat(numNameTemp)

            var myObj = { notEmpty: 'notEmpty' };
            myObj.title = capitalizeFirstLetter(property);
            myObj.realTitle = property;
            myObj.PTtitle = TopicNames[property];
            myObj.numbers = TopicNames[numName];

            const sectionTitle = capitalizeFirstLetter(numNameTemp)
            myObj.sectionTitle = sectionTitle;
            titleList.add(sectionTitle)
            var mineProp = TopicPictures;

            myObj.illustration = mineProp[property];
            myObj.words = mytopics[property];
            newData.push(myObj)
        }
        // setTopics(newData);
        let sectionTopics = [];
        titleList.forEach((item) => {
            let itemList = [];
            newData.forEach((data) => {
                if (data.sectionTitle == item) {
                    itemList.push(data);
                }
            });
            itemList.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });

            sectionTopics.push({ title: item, data: [{ key: item, list: itemList }] });
        });
        setTopics(sectionTopics);
        console.log("sectionTopics : ", sectionTopics);

        let snapshot = await firestore().collection('chat').where('user', 'array-contains', 'FmIfeWNRGIh2s9iStQberUXIrgA3').get();
        var conversionID = null
        for (const doc of snapshot.docs) {
            const user = doc.data().user
            if (user.includes(props.user.uid)) {
                conversionID = doc.id
                break
            }
        }

        if (conversionID) {
            let result = await firestore().collection('chat').doc(conversionID).collection('msg').where(props.user.uid + '_state', '==', 'unread').limit(1).get();
            if (result.docs.length > 0) {
                const time = result.docs[0].id
                const d = new Date(time)
                const niceDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                setnewestMsg(niceDate);
            }
        }

        setLoading(false);
    }

    const refreshPage = () => {
        setActiveStep(1)
    }

    if (loading) {
        return (
            <ActivityIndicator size="large" color={colors.blue}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }} />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <NavigationEvents
                onDidFocus={payload => {
                    refreshPage()
                }}
            />
            <ImageBackground source={require('../assets/home_bg.png')} style={{ flex: 1, resizeMode: 'cover' }}>
                <View style={styles.pointContainer}>
                    <Text style={{ color: colors.darkOrange, fontSize: 20, fontWeight: 'bold' }}>YAK VERNAC</Text>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('Buy'); }}
                        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 16 }}>
                        <Image source={require('../assets/coin.png')} style={{ height: 24, width: 20, marginLeft: 16 }} resizeMode='contain' />
                        <Text style={{ fontSize: 20, color: colors.darkOrange, paddingLeft: 4 }}>{props.xp}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('Buy'); }}>
                        <Text style={{ color: colors.text, fontSize: 20, paddingLeft: 16 }}>
                            {`${getLangInitial(props.lang.languageNative)} > ${getLangInitial(props.lang.languageLearning)}`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('PaymentScreen'); }}>
                        <Image source={props.user.premium ? require('../assets/crown.png') : require('../assets/crown-free.png')} style={{ height: 18, width: 24, marginLeft: 16 }} resizeMode='cover' />
                    </TouchableOpacity>
                </View>
                <View style={styles.stepperContainer}>
                    <View style={styles.stepperSubcontainer}>
                        <TouchableOpacity style={styles.stepperOuterContainer}
                            onPress={() => {
                                setActiveStep(1);
                            }}>
                            <View style={{
                                width: 25, height: 25, justifyContent: 'center',
                                alignItems: 'center', borderRadius: 15, backgroundColor: colors.stepColor
                            }}>
                                <Text style={{ color: colors.button }}>1</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.stepperLine} />
                        <TouchableOpacity style={styles.stepperOuterContainer}
                            onPress={() => {
                                setActiveStep(2);
                            }}>
                            <View style={{
                                width: 25, height: 25, justifyContent: 'center',
                                alignItems: 'center', borderRadius: 15, backgroundColor: activeStep >= 2 ? colors.stepColor : colors.button
                            }}>
                                <Text style={{ color: activeStep >= 2 ? colors.button : colors.stepColor }}>2</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.stepperLine} />
                        <TouchableOpacity style={styles.stepperOuterContainer}
                            onPress={() => {
                                setActiveStep(3);
                            }}>
                            <View style={{
                                width: 25, height: 25, justifyContent: 'center',
                                alignItems: 'center', borderRadius: 15, backgroundColor: activeStep >= 3 ? colors.stepColor : colors.button
                            }}>
                                <Text style={{ color: activeStep >= 3 ? colors.button : colors.stepColor }}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {activeStep === 1
                    ? <View style={{ flex: 1 }}>
                        <SectionList
                            stickySectionHeadersEnabled={false}
                            sections={Topics}
                            renderSectionHeader={({ section }) => {
                                console.log("isPortuguese : ", strings(`Words.${section.title.toLowerCase()}`), section.title.toLowerCase());
                                return (
                                    <Text style={{ fontSize: 28, color: colors.text, marginVertical: 8, marginHorizontal: 16 }}>
                                        {strings(`Words.${section.title.toLowerCase()}`)}
                                    </Text>
                                );
                            }}
                            renderItem={(item) => (
                                <FlatList
                                    contentContainerStyle={{ paddingHorizontal: 16 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    overScrollMode='never'
                                    keyExtractor={(item, index) => `key${index} `}
                                    data={item.item.list}
                                    horizontal={true}
                                    renderItem={({ item, index }) => {
                                        let isPortuguese = getLangInitial(props.lang.languageNative) == "PT";
                                        // console.log("isPortuguese : ", props.lang.languageNative);
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    // setActiveStep(2);
                                                    if (props.user.premium || index < 2) {
                                                        SetATopic(item);
                                                    } else {
                                                        BuyPremium();
                                                    }
                                                }}
                                                style={styles.itemContainer}>
                                                <Text style={styles.titleText} numberOfLines={1}>{isPortuguese ? item.PTtitle : item.title}</Text>
                                                <View style={styles.imageContainer} />
                                                <View style={styles.bottomContainer}>
                                                    <View style={styles.lineContainer} />
                                                    <Text style={styles.wordText}>{item.words.length}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            )} />
                    </View>
                    : activeStep === 2
                        ? <StepperTwo SetAGame={SetAGame} />
                        : <StepperThree PlayGame={PlayGame}
                            isShare={false}
                            friendsNick=''
                            selectedGame={selectedGame}
                            selectedWordList={selectedWordList}
                            TopicNameForTextToText={TopicNameForTextToText}
                            uid={props.user.uid}
                            friends={props.friends} />}
            </ImageBackground>

            <View style={{ position: 'absolute', bottom: 16, right: 16 }}>
                <TouchableOpacity
                    title='Logout'
                    onPress={async () => {
                        let providerType = auth().currentUser.providerId;

                        try {
                            if (providerType == 'facebook.com') {
                                await LoginManager.logOut();
                            } else if (providerType == 'google.com') {
                                await GoogleSignin.signOut();
                            }

                            await auth().signOut();
                            props.navigation.navigate('Auth');
                        } catch (e) {
                            console.log(e);
                        }
                        props.logout();
                    }}>
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
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    autocompleteContainer: {
        width: '100%',
        marginLeft: 10,
        marginRight: 10,
        marginBottom:10,
        borderWidth: 0,
    
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pointContainer: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: colors.button,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    stepperContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: colors.midBlue
    },
    stepperSubcontainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    stepperLine: {
        height: 5,
        width: 75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    stepperOuterContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: colors.button
    },
    itemContainer: {
        height: 130,
        width: 120,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        marginRight: 16,
        backgroundColor: colors.button,
        borderRadius: 8,
    },
    titleText: {
        marginHorizontal: 8,
        fontSize: 18,
        color: colors.text
    },
    imageContainer: {
        height: 65,
        width: 88,
        backgroundColor: colors.lightGrey,
        marginVertical: 4
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16
    },
    lineContainer: {
        flex: 1,
        height: 8,
        marginRight: 8,
        backgroundColor: colors.grey
    },
    wordText: {
        fontSize: 18,
        color: colors.text
    },
    stepperThreeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16
    },
    playButtonContainer: {
        width: '100%',
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: colors.selectionGreen,
        borderRadius: 4
    },
    playText: {
        paddingVertical: 10,
        textAlign: 'center',
        color: colors.button,
        fontWeight: 'bold',
        fontSize: 28
    },
    shareButtonContainer: {
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: colors.button,
        borderRadius: 4
    },
    shareText: {
        paddingVertical: 10,
        textAlign: 'center',
        color: colors.black,
        fontWeight: 'bold',
        fontSize: 28
    },
    sendButtonContainer: {
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: '#95989A',
        borderRadius: 4,
        opacity: 0.8
    },
    sendEnableButtonContainer: {
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: colors.selectionGreen,
        borderRadius: 4,
        opacity: 0.8
    },
    sendText: {
        paddingVertical: 10,
        textAlign: 'center',
        color: colors.button,
        fontWeight: 'bold',
        fontSize: 28
    },
});

export default (connector(StepperView));