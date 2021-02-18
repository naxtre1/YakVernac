import React, { Component } from "react";
import UUIDGenerator from 'react-native-uuid-generator'
import Spinner from "react-native-loading-spinner-overlay"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
    ImageBackground,
    Image,
    Button,
    TextInput,
    SafeAreaView, ScrollView
} from "react-native";
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import { StackNavigator } from "react-navigation";
import { GiftedChat, MessageText, MessageImage } from "react-native-gifted-chat";
import Modal from "react-native-modal";
import { PowerTranslator, ProviderTypes, TranslatorConfiguration } from 'react-native-power-translator';
import ContainerStyles, { colors } from '../styles/index.style';
import ElevatedView from 'react-native-elevated-view';
import { Dimensions } from 'react-native';
import { strings } from '../../src/locales/i18n';
import { shuffle } from '../static/constant'
import OneSignal from "react-native-onesignal"
import { setFreeTranslations, changeFriendLastMessage, addFriend, setLang } from '../redux/action'
// import {firebase, firestore} from '@react-native-firebase/firestore'
import firestore, { firebase } from '@react-native-firebase/firestore'
// import Mystyles from '../styles/SliderEntry.style';
// import ContainerStyles, { colors } from '../styles/index.style';
// import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
const deviceWidth = Dimensions.get("window").width

//ZThlM2NkOTItMDIwZS00NTQ4LTk4MWItNDQ0YmNmMTE1NTFk

var sendNotification = function (data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic ZThlM2NkOTItMDIwZS00NTQ4LTk4MWItNDQ0YmNmMTE1NTFk"
    };
    fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then((responseJson) => {
            //console.log(responseJson)
        })
        .catch((error) => {
            console.error(error);
        });
};

var uid;
var playerId;
var Filter = require('bad-words'),
    filter = new Filter();
// filter.addWords(['Anus', 'Baba-ovo', 'Babaca', 'Babaovo', 'Bacura',	'Bagos', 'Baitola', 'Bebum', 'Bicha',	 'Bisca', 'Boazuda', 'Boceta', 'Boco', 'Boiola', 'Boquete', 'Bosseta', 'Bostana', 'Buca', 'Buceta', 'Bunda', 'Bunduda', 'Busseta', 'Caga', 'Cagado', 'Cagao', 'Cagona', 'Caralho',	'Checheca', 'Chereca', 'Chibumba', 'Chibumbo', 'Chifruda', 'Chifrudo', 'Chochota', 'Chota', 'Chupada', 'Chupado', 'Clitoris', 'Cocaina', 'Coco', 'Corna', 'Corno', 'Cornuda', 'Cornudo', 'Cretina', 'Cretino', 'Cu', 'Culhao', 'Curalho', 'Cuzao', 'Cuzuda', 'Cuzudo', 'Debiloide', 'Defunto', 'Demonio', 'Difunto', 'Fedida', 'Feiosa', 'Felação', 'Fenda', 'Foda', 'Fodao', 'Fode', 'Fodida', 'Fodido', 'Fornica', 'Fudecao', 'Fudendo', 'Fudida', 'Fudido', 'Imbecil', 'Manguaa', 'Masturba', 'merda', 'Nadega', 'Olhota', 'Pica', 'Picao', 'Piru', 'Porra', 'Prost-bulo', 'Prostibulo', 'Prostituta', 'Prostituto', 'Puta', 'Puto', 'Puxa-saco', 'Puxasaco', 'Rabao',	'Rabo',	'Racha', 'Rachada', 'Rachadao', 'Rachadinha', 'Rachadinho', 'Rachado', 'Retardada', 'Retardado', 'Rola', 'Rosca', 'Sacana', 'Safada', 'Safado', 'Sapatao', 'Siririca', 'Tarada', 'Tarado', 'Testuda', 'Tezao', 'Tezuda', 'Tezudo', 'Trouxa', 'Troxa', 'Xana', 'Xaninha',	'Xavasca', 'Xerereca',	'Xexeca', 'Xibumba',	'Xochota', 'Xota', 'Xoxota']);


class ChatTitle extends React.Component {

    render() {
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        middleViewWidth = viewportWidth - 56 * 2;
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ width: middleViewWidth, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                        {this.props.title}
                    </Text>
                </View>

            </View>
        );
    }
}

class Chat extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Chat',
            headerTitle: <ChatTitle title={strings('Chat.Chat')} navigation={navigation} />,
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
        this.messageRef = null
        this.sender = null
        this.receiver = null
        this.onSend = this.onSend.bind(this);
        this.longPress = this.longPress.bind(this)
        this.conversationID = null
        this.unsubscribe = null
    }

    state = {
        messages: [],
        visibleModal: null,
        isModalVisible: false,
        message: { text: '' },
        user: {},
        freeTranslations: this.props.user.freeTranslations ? this.props.user.freeTranslations : 0,
        paid: this.props.user.paid ? this.props.user.paid : false,
        loading: true,
        loadEarlier: true,
        referenceToOldestKey: '',
    };

    componentDidMount() {
        console.log("paid status",this.props.user.paid);
        const receiverID = this.props.navigation.state.params.uid
        firestore().collection('user').doc('' + receiverID).get().then(doc => {
            if (doc.exists) {
                const receiver = doc.data()
                this.props.addFriend(this.props.user.uid, receiverID, receiver)
                this.sender = {
                    _id: this.props.user.uid,
                    avatar: this.props.profilePics.profilePics.length > 0 ? this.props.profilePics.profilePics[this.props.profilePics.profilePics.length - 1].illustration : this.props.user.myPic
                }

                this.receiver = {
                    _id: receiverID,
                    avatar: receiver.profilePics && receiver.profilePics.length > 0 ? receiver.profilePics[receiver.profilePics.length - 1].illustration : receiver.myPic
                }
                // this.setState({ loading: true })
                firestore().collection('chat').where('user', 'array-contains', this.props.user.uid).get().then(snapshot => {
                    this.conversationID = null
                    console.log("chat msgs : ", snapshot.docs);
                    for (const doc of snapshot.docs) {
                        const user = doc.data().user
                        console.log("user", user.includes(receiverID), doc.id);
                        if (user.includes(receiverID)) {
                            this.conversationID = doc.id
                            break
                        }
                    }

                    if (this.conversationID == null) {
                        this.conversationID = Date.now().toString()
                        firestore().collection('chat').doc(this.conversationID).set({ user: [receiverID, this.props.user.uid] })
                    }
                    
                    this.messageRef = firestore().collection('chat').doc(this.conversationID).collection('msg')
                    
                    this.messageRef.where(this.sender._id + '_state', '==', 'read').limit(20).orderBy(firebase.firestore.FieldPath.documentId(), 'desc').get().then(snapshot => {
                        
                        const messages = []
                        for (const doc of snapshot.docs) {
                            const msg = doc.data()
                            const message = {
                                _id: msg._id,
                                text: msg.text,
                                createdAt: msg.createdAt.toDate(),
                            }
                            
                            const index = msg.text.indexOf('game:')
                            if (index != -1) {
                                const jsonString = msg.text.substring(index + 5)
                                const game = JSON.parse(jsonString)
                                message.image = game.gameImageUrl
                            }
                            message.key = doc.id
                            
                            if (msg.user._id == this.sender._id) {
                                message.user = this.sender
                            } else {
                                message.user = this.receiver
                            }
                            messages.push(message)
                        }
                        
                        messages.sort((a, b) => {
                            if (a.key < b.key) {
                                return 1
                            }
                            return -1
                        })
                        
                        this.setState(previousState => {
                            return { messages: GiftedChat.append(messages, previousState.messages), loading: false, referenceToOldestKey: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : '', loadEarlier : false }
                        })
                        this.unsubscribe = this.messageRef.where(this.sender._id + '_state', '==', 'unread').onSnapshot(snapshot => {
                            snapshot.docChanges().forEach(change => {
                                if (change.type == 'added') {
                                    this.messageListener(change.doc)
                                }
                            })
                        })
                        const gameID = this.props.navigation.state.params.gameID
                        if (gameID) {
                            const gameName = this.props.navigation.state.params.gameName
                            const gameImageUrl = this.props.navigation.state.params.gameImageUrl
                            const gameLang = this.props.navigation.state.params.gameLang
                            const game = {
                                gameID, gameName, gameImageUrl, gameLang
                            }
                            this.newMessage(`game:${JSON.stringify(game)}`)
                        }
                    })
                })

            }
        })
    }

    messageListener = (doc => {
        console.log("messageListener : ", doc);
        const key = doc.id
        const msg = doc.data()
        const updaes = {}
        updaes[this.sender._id + '_state'] = 'read'
        this.messageRef.doc(key).update(updaes)
        const message = {
            _id: msg._id,
            text: msg.text,
            createdAt: msg.createdAt.toDate(),
        }
        const index = msg.text.indexOf('game:')
        if (index != -1) {
            const jsonString = msg.text.substring(index + 5)
            const game = JSON.parse(jsonString)
            message.image = game.gameImageUrl
        }
        if (msg.user._id == this.sender._id) {
            message.user = this.sender
        } else {
            message.user = this.receiver
        }
        this.props.changeFriendLastMessage(this.receiver._id, message.text)
        this.setState(previousState => {
            return { messages: GiftedChat.append(previousState.messages, [message]) }
        })
    })

    longPress(context, message) {
        const freeTranslations = this.state.freeTranslations + 1
        this.setState({ freeTranslations })
        this.props.setFreeTranslations(freeTranslations)
        console.log("message:",message);
        this.setState({ message });
        this.setState({ visibleModal: 6 });
    }

    _renderModalContent() {
        if (this.state.freeTranslations > 10 && this.props.user.premium == false) {
            return (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '80%', backgroundColor: 'white' }}>
                        <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                            <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                                <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                    {/* Translation */}
                                </Text>
                            </View>
                            <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ visibleModal: false });
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
                        <View style={{ width: '100%', padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <View>
                                <Text>You already used your 10 translations! Subscribe to our Premium package to have unlimited translations!</Text>
                            </View>
                        </View>
                    </ElevatedView>
                </View>
            )
        }

        else {
            return (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '100%', backgroundColor: 'white' }}>
                        <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                            <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                                <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                    {/* Translation */}
                                </Text>
                            </View>
                            <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ visibleModal: false });
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
                        <View style={{ width: '90%', padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginLeft: 30, fontSize: 16, fontWeight: 'bold', color: '#F68D3D' }}>
                                    Original:
                                </Text>
                                <Text style={{ marginLeft: 4, fontSize: 15, color: '#F68D3D' }}>{this.state.message.text}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginLeft: 55, fontSize: 16, fontWeight: 'bold', color: '#81CBEB' }}>
                                    Translation:
                                </Text>
                               {<PowerTranslator style={{ marginLeft: 5, fontSize: 15, color: '#81CBEB' }} text={this.state.message.text} />} 
                                <PowerTranslator style={{ marginLeft: 5, fontSize: 15, color: '#81CBEB' }} text={'Hola'} />
                            </View>
                            {!this.props.user.premium ?
                            <View>
                             <Text>Free translations: {this.state.freeTranslations}/10</Text>
                        </View> : 
                        null
                         }
                        </View>
                    </ElevatedView>
                </View>
            )
        }


    };

    renderFooter(props) {
        // if (this.state.typingText) {
        return (
            <Modal
                backdropColor={'black'}
                backdropOpacity={0.5}
                animationType="slide"
                transparent={true}
                isVisible={this.state.visibleModal === 6}
                onBackdropPress={() => this.setState({ visibleModal: null })}
            >
                {this._renderModalContent()}
            </Modal>
        );
        // }
        // return null;
    }

    generateChatId() {
        if (this.props.user.uid > uid) return `${this.props.user.uid}-${uid}`;
        else return `${uid}-${this.props.user.uid}`;
    }

    renderBubble(props) {
        return (
            <Modal
                isVisible={this.state.visibleModal === 6}
                onBackdropPress={() => this.setState({ visibleModal: null })}
            >
                {this._renderModalContent()}
            </Modal>
        );
    }

    renderSystemMessage(props) {
        return (
            <Modal
                isVisible={this.state.visibleModal === 6}
                onBackdropPress={() => this.setState({ visibleModal: null })}
            >
                {this._renderModalContent()}
            </Modal>
        );
    }

    // listenForItems(chatRef) {
    //     chatRef.on("value", snap => {
    //         // get children as an array
    //         var items = [];
    //         snap.forEach(child => {
    //             items.push({
    //                 _id: child.val().createdAt,
    //                 text: child.val().text,
    //                 createdAt: new Date(child.val().createdAt),
    //                 user: {
    //                     _id: child.val().uid
    //                     //avatar: avatar
    //                 }
    //             });
    //         });

    //         this.setState({
    //             loading: false,
    //             messages: GiftedChat.append(previousState.messages, [items])
    //         });
    //     });
    // }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }

    onSend(messages = []) {
        console.log("onSend : ", messages);
        messages.forEach(message => {
            message.text = filter.clean(message.text)
            message[this.sender._id + '_state'] = 'unread'
            message[this.receiver._id + '_state'] = 'unread'

            this.messageRef.doc(Date.now().toString()).set(message).then(() => {
                firestore().collection('user').doc(this.receiver._id).get().then(doc => {
                    if (doc.exists) {
                        const user = doc.data()
                        const playerId = user.playerId;
                        if (user.notify == "1") {
                            if (playerId) {
                                const message = {
                                    app_id: "59a1ed67-ec8a-4cc1-b38a-ec225843a6b0",
                                    data: { "type": "CHAT", "toUserId": doc.id, "fromUserId": this.props.user.uid },
                                    headings: { "en": "Yak Vernac" },
                                    contents: { "en": " You have received a message from " + this.props.user.username },
                                    // included_segments: ["All"],
                                    include_player_ids: [playerId],
                                    //include_player_ids:["9cfcbe22-950e-4200-8192-8b40a19f8821"]
                                };
                                sendNotification(message);
                            }
                        }

                    }
                });

            })
        })
    }

    newMessage = text => {
        console.log("newMessage : ", text);
        UUIDGenerator.getRandomUUID(uuid => {
            const message = {}
            message.text = text
            message[this.sender._id + '_state'] = 'unread'
            message[this.receiver._id + '_state'] = 'unread'
            message['_id'] = uuid
            message['createdAt'] = new Date()
            message['user'] = { _id: this.sender._id }
            this.messageRef.doc(Date.now().toString()).set(message).then(() => {
                firestore().collection('user').doc(this.receiver._id).get().then(doc => {
                    if (doc.exists) {
                        const user = doc.data()
                        const playerId = user.playerId;
                        if (user.notify == "1") {
                            if (playerId) {
                                const message = {
                                    app_id: "59a1ed67-ec8a-4cc1-b38a-ec225843a6b0",
                                    data: { "type": "CHAT", "toUserId": doc.id, "fromUserId": this.props.user.uid },
                                    headings: { "en": "Yak Vernac" },
                                    contents: { "en": " You have received a message from " + this.props.user.username },
                                    // included_segments: ["All"],
                                    include_player_ids: [playerId],
                                    //include_player_ids:["9cfcbe22-950e-4200-8192-8b40a19f8821"]
                                };
                                sendNotification(message);
                            }
                        }

                    }
                });

            })

        })
    }

    // onSend(messages = []) {
    //     // this.setState({
    //     //     messages: GiftedChat.append(this.state.messages, messages),
    //     // });
    //     messages.forEach(message => {
    //         //var message = message[0];
    //         var now = new Date().getTime();
    //         var FilteredMessage = filter.clean(message.text);
    //         let that = this;
    //         database().ref(`/users/${uid}/messages/${this.props.user.uid}`)
    //             .set({ message: FilteredMessage, seen: false, uid: this.props.user.uid })
    //             .then(() => {

    //                 this.chatRef.push({
    //                     _id: now,
    //                     text: FilteredMessage,
    //                     createdAt: now,
    //                     uid: this.props.user.uid,
    //                     fuid: uid,
    //                     order: -1 * now,
    //                     seen: false
    //                 });
    //                 database().ref(`/users/${uid}/friends/${this.state.user.uid}`)
    //                     .set({
    //                         age: this.state.user.age == undefined ? "" : this.state.user.age,
    //                         blockedBy: this.state.user.blockedBy == undefined ? "" : this.state.user.blockedBy,
    //                         checkedFemale: this.state.user.checkedFemale == undefined ? "" : this.state.user.checkedFemale,
    //                         checkedMale: this.state.user.checkedMale == undefined ? "" : this.state.user.checkedMale,
    //                         email: this.state.user.email == undefined ? "" : this.state.user.email,
    //                         interests: this.state.user.interests == undefined ? "" : this.state.user.interests,
    //                         introduction: this.state.user.introduction == undefined ? "" : this.state.user.introduction,
    //                         islandPics: this.state.user.islandPics == undefined ? "" : this.state.user.islandPics,
    //                         language: this.state.user.language == undefined ? "" : this.state.user.language,
    //                         languageLearning: this.state.user.languageLearning == undefined ? "" : this.state.user.languageLearning,
    //                         languageNative: this.state.user.languageNative == undefined ? "" : this.state.user.languageNative,
    //                         messages: this.state.user.messages == undefined ? "" : this.state.user.messages,
    //                         myPic: this.state.user.myPic == undefined ? "" : this.state.user.myPic,
    //                         profilePics: this.state.user.profilePics == undefined ? "" : this.state.user.profilePics,
    //                         uid: this.state.user.uid == undefined ? "" : this.state.user.uid,
    //                         username: this.state.user.username == undefined ? "" : this.state.user.username,
    //                         xp: this.state.user.xp == undefined ? "" : this.state.user.xp,
    //                     })
    //                     .then(() => {
    //                         console.log("Getting information");
    //                         database().ref('/users/' + uid).once('value').then(function (snapshot) {
    //                             playerId = snapshot.val().playerId;
    //                             console.log("Notify", snapshot.val().notify);
    //                             console.log("OneSignal Player ID", playerId);
    //                             if (snapshot.val().notify == "1") {
    //                                 if (playerId !== undefined || playerId !== "") {
    //                                     var message = {
    //                                         app_id: "59a1ed67-ec8a-4cc1-b38a-ec225843a6b0",
    //                                         data: { "type": "CHAT", "toUserId": uid, "fromUserId": that.user.uid },
    //                                         headings: { "en": "Yak Vernac" },
    //                                         contents: { "en": " You have received a message from " + this.props.user.username },
    //                                         // included_segments: ["All"],
    //                                         include_player_ids: [playerId],
    //                                         //include_player_ids:["9cfcbe22-950e-4200-8192-8b40a19f8821"]
    //                                     };
    //                                     sendNotification(message);
    //                                 }
    //                             }
    //                         });
    //                     })
    //                     .catch(() => {
    //                         console.log('NEIRASE I DB !!!')
    //                     })
    //             })
    //             .catch((err) => {
    //                 console.log(err.message);
    //                 console.log('could not update the profile values!')
    //             })

    //         // console.log(now);

    //     });
    // }

    renderCustomView(props) {
        return (
            <Modal
                isVisible={this.state.visibleModal === 6}
                onBackdropPress={() => this.setState({ visibleModal: null })}
            >
                {this._renderModalContent()}
            </Modal>
        );
    }

    renderMessageText = (props) => {
        const text = props.currentMessage.text
        // const index = -1
        const index = text.indexOf('game:')
        if (index != -1) {
            const jsonString = text.substring(index + 5)
            const game = JSON.parse(jsonString)
            return (
                <View style={{ padding: 10 }}>
                    {/* <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, backgroundColor: 'green', opacity: 0.7, borderRadius: 10}}
                    onPress={()=>this.startGame(props.user._id, game.gameID)}>
                    <Text style={{padding: 0, color: 'white', textAlignVertical: 'center', fontSize: 20}}>Play</Text>
                </TouchableOpacity> */}
                    <View>
                        <Text style={{ color: 'white' }}>{game.gameName}</Text>
                        <Text style={{ color: 'white' }}>{game.gameLang}</Text>
                    </View>

                    {/* <TouchableOpacity onPress={()=>this.startGame(props.user._id, gameID)}>
                    <Text style={{color: 'orangered', borderBottomWidth: 1, textAlignVertical: 'center', borderColor: 'black'}}>Click here to start!</Text>
                </TouchableOpacity> */}
                </View>
            )
        }
        return <MessageText {...props} />
    }

    renderMessageImage = (props) => {
        const text = props.currentMessage.text
        // const index = -1
        const index = text.indexOf('game:')
        if (index != -1) {
            const jsonString = text.substring(index + 5)
            const game = JSON.parse(jsonString)
            return (
                <ImageBackground source={{ uri: game.gameImageUrl }} style={{ width: deviceWidth * 0.8, height: deviceWidth * 0.6, marginTop: 20, alignItems: 'center', justifyContent: 'center' }} resizeMode='cover'>
                    <TouchableOpacity
                        style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, backgroundColor: 'green', opacity: 0.7, borderRadius: 10 }}
                        onPress={() => this.startGame(props.user._id, game.gameID)}>
                        <Text style={{ padding: 0, color: 'white', textAlignVertical: 'center', fontSize: 20 }}>Play</Text>
                    </TouchableOpacity>

                </ImageBackground>
            )
        }
        return (
            <MessageImage {...props} />
        )
    }

    startGame = (uid, gameID) => {
        this.setState({ loading: true })
        firestore().collection('user').doc(uid).collection('games').doc(gameID).get().then(doc => {
            if (doc.exists) {
                const gameData = doc.data()
                gameData['prevLang'] = this.props.lang
                gameData['allCorrect'] = 0
                var introductionCard = null
                firestore().collection('user').doc(uid).collection('games').doc(gameID).collection('cards').get().then(snapshot => {
                    const gameCards = []
                    for (const doc of snapshot.docs) {
                        const cardData = doc.data()
                        if (cardData.type == 'introductions') {
                            introductionCard = cardData
                        } else {
                            gameCards.push(cardData)
                        }
                    }
                    shuffle(gameCards)
                    if (introductionCard) {
                        gameCards.push(introductionCard)
                    }
                    const oneCard = gameCards.pop()
                    this.setState({ loading: false })
                    this.props.setLang({
                        languageNative: gameData.lessonLanguage,
                        languageLearning: this.props.lang.languageLearning
                    })
                    gameData.cards = gameCards.length
                    this.props.navigation.push(oneCard.type, { oneCard, gameCards, gameData })
                })
            }
        })
    }

    onLoadEarlier = () => {
        this.setState(() => {
            return {
                isLoadingEarlier: true,
            }
        })

        // this.messageRef.where(this.sender._id + '_state', '==', 'read').limit(20).
        // orderBy(firebase.firestore.FieldPath.documentId(), 'desc')
        // .startAfter(this.state.referenceToOldestKey).get().then(snapshot => {

        this.messageRef.where(this.sender._id + '_state', '==', 'read').limit(20).
            orderBy(firebase.firestore.FieldPath.documentId(), 'desc')
            .startAfter(this.state.referenceToOldestKey).get().then(snapshot => {
                const messages = []
                if (snapshot.docs.length == 0) {
                    this.setState(previousState => {
                        return {
                            loadEarlier: false,
                            isLoadingEarlier: false
                        }
                    })
                    return;
                }
                for (const doc of snapshot.docs) {
                    const msg = doc.data()
                    console.log("id", msg);
                    console.log("id", msg._id);
                    const message = {
                        _id: msg._id,
                        text: msg.text,
                        createdAt: msg.createdAt.toDate(),
                    }
                    const index = msg.text.indexOf('game:')
                    if (index != -1) {
                        const jsonString = msg.text.substring(index + 5)
                        const game = JSON.parse(jsonString)
                        message.image = game.gameImageUrl
                    }
                    message.key = doc.id
                    if (msg.user._id == this.sender._id) {
                        message.user = this.sender
                    } else {
                        message.user = this.receiver
                    }
                    messages.push(message)
                }
                messages.sort((a, b) => {
                    if (a.key < b.key) {
                        return 1
                    }
                    return -1
                })
                this.setState(previousState => {
                    return {
                        messages: GiftedChat.append(messages, previousState.messages),
                        loading: false,
                        loadEarlier: snapshot.docs.length == 20 ? true : false,
                        isLoadingEarlier: false,
                        referenceToOldestKey: snapshot.docs[snapshot.docs.length - 1].id
                    }
                })
                // this.unsubscribe = this.messageRef.where(this.sender._id + '_state', '==', 'unread').onSnapshot(snapshot => {
                //     snapshot.docChanges().forEach(change => {
                //         if (change.type == 'added') {
                //             console.log("refetch : ", change);
                //             this.messageListener(change.doc)
                //         }
                //     })
                // })
                const gameID = this.props.navigation.state.params.gameID
                if (gameID) {
                    const gameName = this.props.navigation.state.params.gameName
                    const gameImageUrl = this.props.navigation.state.params.gameImageUrl
                    const gameLang = this.props.navigation.state.params.gameLang
                    const game = {
                        gameID, gameName, gameImageUrl, gameLang
                    }
                    this.newMessage(`game:${JSON.stringify(game)}`)
                }
            })

        // const receiverID = this.props.navigation.state.params.uid
        // firestore().collection('user').doc('' + receiverID).get().then(doc => {
        //     if (doc.exists) {
        //         const receiver = doc.data()
        //         this.props.addFriend(this.props.user.uid, receiverID, receiver)
        //         this.sender = {
        //             _id: this.props.user.uid,
        //             avatar: this.props.profilePics.profilePics.length > 0 ? this.props.profilePics.profilePics[this.props.profilePics.profilePics.length - 1].illustration : this.props.user.myPic
        //         }

        //         this.receiver = {
        //             _id: receiverID,
        //             avatar: receiver.profilePics && receiver.profilePics.length > 0 ? receiver.profilePics[receiver.profilePics.length - 1].illustration : receiver.myPic
        //         }
        //         // this.setState({ loading: true })
        //         console.log("break");
        //         firestore().collection('chat').where('user', 'array-contains', this.props.user.uid).get().then(snapshot => {
        //             this.conversationID = null
        //             for (const doc of snapshot.docs) {
        //                 const user = doc.data().user
        //                 if (user.includes(receiverID)) {
        //                     this.conversationID = doc.id
        //                     break
        //                 }
        //             }
        //             if (this.conversationID == null) {
        //                 this.conversationID = Date.now().toString()
        //                 firestore().collection('chat').doc(this.conversationID).set({ user: [receiverID, this.props.user.uid] })
        //             }

        //             // this.messageRef = firestore().collection('chat').doc(this.conversationID).collection('msg')
        //             this.messageRef.where(this.sender._id + '_state', '==', 'read').limit(20).orderBy(firebase.firestore.FieldPath.documentId(), 'desc').startAfter(this.state.referenceToOldestKey).get().then(snapshot => {
        //                 const messages = []
        //                 if(snapshot.docs.length == 0){
        //                     this.setState(previousState => {
        //                         return {
        //                             loadEarlier: false,
        //                             isLoadingEarlier: false
        //                         }
        //                     })
        //                     return;
        //                 }
        //                 for (const doc of snapshot.docs) {
        //                     const msg = doc.data()
        //                     console.log("id", msg);
        //                     console.log("id", msg._id);
        //                     const message = {
        //                         _id: msg._id,
        //                         text: msg.text,
        //                         createdAt: msg.createdAt.toDate(),
        //                     }
        //                     const index = msg.text.indexOf('game:')
        //                     if (index != -1) {
        //                         const jsonString = msg.text.substring(index + 5)
        //                         const game = JSON.parse(jsonString)
        //                         message.image = game.gameImageUrl
        //                     }
        //                     message.key = doc.id
        //                     if (msg.user._id == this.sender._id) {
        //                         message.user = this.sender
        //                     } else {
        //                         message.user = this.receiver
        //                     }
        //                     messages.push(message)
        //                 }
        //                 messages.sort((a, b) => {
        //                     if (a.key < b.key) {
        //                         return 1
        //                     }
        //                     return -1
        //                 })
        //                 this.setState(previousState => {
        //                     return {
        //                         messages: GiftedChat.append(previousState.messages, messages),
        //                         // loading: false,
        //                         loadEarlier: snapshot.docs.length == 20 ? true : false,
        //                         isLoadingEarlier: false, 
        //                         referenceToOldestKey: snapshot.docs[snapshot.docs.length - 1].id
        //                     }
        //                 })
        //                 this.unsubscribe = this.messageRef.where(this.sender._id + '_state', '==', 'unread').onSnapshot(snapshot => {
        //                     snapshot.docChanges().forEach(change => {
        //                         if (change.type == 'added') {
        //                             this.messageListener(change.doc)
        //                         }
        //                     })
        //                 })
        //                 const gameID = this.props.navigation.state.params.gameID
        //                 if (gameID) {
        //                     const gameName = this.props.navigation.state.params.gameName
        //                     const gameImageUrl = this.props.navigation.state.params.gameImageUrl
        //                     const gameLang = this.props.navigation.state.params.gameLang
        //                     const game = {
        //                         gameID, gameName, gameImageUrl, gameLang
        //                     }
        //                     this.newMessage(`game:${JSON.stringify(game)}`)
        //                 }
        //             })
        //         })

        //     }
        // })

        // if (this._isMounted === true) {
        //     this.setState((previousState) => {
        //         return {
        //             messages: GiftedChat.prepend(
        //                 previousState.messages,
        //                 earlierMessages(),
        //                 Platform.OS !== 'web',
        //             ),
        //             loadEarlier: true,
        //             isLoadingEarlier: false,
        //         }
        //     })
        // }
    }

    render() {
        TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyBcV8QCqM7YFYu6c9_6mjOt9bHDxo_F6sY', 'pt');
        return (
            <View style={{ flex: 1, backgroundColor: '#D0ECF6' }}>
                <Spinner visible={this.state.loading} />
                <Modal
                    isVisible={this.state.visibleModal === 6}
                    onBackdropPress={() => this.setState({ visibleModal: null })}
                >
                    {this._renderModalContent()}
                </Modal>
                <GiftedChat
                    infiniteScroll
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={this.onLoadEarlier}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    messages={this.state.messages}
                    onSend={this.onSend}
                    user={{
                        _id: this.props.user.uid
                    }}
                    // renderFooter={this.renderFooter}
                    onLongPress={this.longPress}
                    onPress={this.longPress}
                    placeholder={strings('Chat.type_a')}
                    renderMessageText={this.renderMessageText}
                    renderMessageImage={this.renderMessageImage}
                // renderBubble={this.renderBubble}
                // renderSystemMessage={this.renderSystemMessage}
                // renderCustomView={this.renderCustomView}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        marginRight: 10,
        marginLeft: 10
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
});

function mapStateToProps(state) {
    return {
        user: state.user,
        lang: state.lang,
        profilePics: state.profilePics,
    }
}

export default connect(mapStateToProps, { setFreeTranslations, changeFriendLastMessage, addFriend, setLang })(Chat);
