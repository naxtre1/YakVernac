import React, { Component } from 'react';
import { Text, View, TextInput, Image, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModernHeader from './common/ModernHeader';
import { showMessage } from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay";
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'
import { CustomHeader } from './common/CustomHeader';
import { p } from './common/normalize';

var sendNotification = function (data) {
    // console.log('data:', data)
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
            // console.log(responseJson)
        })
        .catch((error) => {
            console.error(error);
        });
};

const deviceWidth = Dimensions.get("window").width;
let postUid = "";

class Comments extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
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

    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;

        this.state = {
            text: '',
            loadingScene: false,
            commentList: params.commentList,
        }
        this.postID = params.postID
        this.playerId = params.playerId
        this.onUpdateComment = params.onUpdateComment
    }

    onUpdate() {
        firestore().collection('Post').doc(this.postID).collection('comment').add({
            userID: this.props.user.uid,
            time: Date.now(),
            commentMessage: this.state.text
        }).then((doc) => {
            const commentList = this.state.commentList
            commentList.push({
                commentid: doc.id,
                userID: this.props.user.uid,
                username: this.props.user.username,
                logoPic: this.props.profilePics.profilePics.length>0?this.props.profilePics.profilePics[this.props.profilePics.profilePics.length-1].illustration:this.props.user.myPic,
                commentMessage: this.state.text,
            })
            this.onUpdateComment(commentList)
            this.setState({ loadingScene: false, commentList })
            if (this.state.text != '') {
                var commentText = this.state.text;
                this.setState({ text: '' })
                showMessage({
                    message: 'Sending notification...',
                    description: '',
                    type: "success",
                });
                const items = []
                if (this.playerId) {
                    items.push(this.playerId)
                }
                for (const comment of commentList) {
                    if (comment.playerId) {
                        if (items.indexOf(comment.playerId) == -1) {
                            items.push(comment.playerId)
                        }
                    }
                }
                var myselfIndex = items.indexOf(this.props.user.playerId)
                while (myselfIndex != -1) {
                    items.splice(myselfIndex, 1);
                    myselfIndex = items.indexOf(this.props.user.playerId)
                }

                console.log("Items:", items, this.props.user.playerId);
                // console.log('*********************** TENGO SEEEN *********************')
                var message = {
                    app_id: "59a1ed67-ec8a-4cc1-b38a-ec225843a6b0",
                    data: { "type": "WALLPOST" },
                    headings: { "en": "Yak Vernac" },
                    contents: { "en": "New Comment : " + commentText.split("\n")[0] + " By " + this.props.user.username },
                    // included_segments: ["All"],
                    include_player_ids: items,
                    //include_player_ids:["9cfcbe22-950e-4200-8192-8b40a19f8821"]
                };
                sendNotification(message);
                showMessage({
                    message: 'Sent notification successfully...',
                    description: '',
                    type: "success",
                });
                // var query = database().ref().child('users').orderByChild('notify').equalTo(1).once('value', function (snapshot) {
                //         if (snapshot.val()) {
                //             var items = [];

                //             snapshot.forEach(child => {
                //                 for (var i = 0; i < commentList.length; i++) {
                //                     var comment = commentList[i];
                //                     if (comment.userID == child.val().uid) {
                //                         if (child.val().playerId != '' && items.indexOf(child.val().playerId) == -1) items.push(child.val().playerId);
                //                     }
                //                 }
                //                 if (uid == child.val().uid) {
                //                     if (child.val().playerId != '' && items.indexOf(child.val().playerId) == -1) items.push(child.val().playerId);
                //                 }
                //             });
                //             if (items.indexOf(this.state.user.playerId) != -1) items.splice(items.indexOf(this.state.user.playerId), 1);

                //             // console.log("Items", items);
                //             console.log('*********************** TENGO SEEEN *********************')
                //             var message = {
                //                 app_id: "59a1ed67-ec8a-4cc1-b38a-ec225843a6b0",
                //                 data: { "type": "WALLPOST" },
                //                 headings: { "en": "Yak Vernac" },
                //                 contents: { "en": "New Comment : " + commentText.split("\n")[0] + " By " + this.state.user.username },
                //                 // included_segments: ["All"],
                //                 include_player_ids: items,
                //                 //include_player_ids:["9cfcbe22-950e-4200-8192-8b40a19f8821"]
                //             };
                //             sendNotification(message);
                //             showMessage({
                //                 message: 'Sent notification successfully...',
                //                 description: '',
                //                 type: "success",
                //             });
                //         }
                //     });
            }
        }).catch((error) => {
            //error callback
            console.log('error ', error)
            alert("Please try again.")
            this.setState({ loadingScene: false })
        })
    }

    onComment(item, isDelete) {
        this.setState({ loadingScene: true });
        if (isDelete) {
            const commentList = this.state.commentList
            for (var i = 0; i < commentList.length; i++) {
                if (commentList[i].commentid === item.commentid) {
                    commentList.splice(i, 1);
                    firestore().collection('Post').doc(this.postID).collection('comment').doc(item.commentid).delete().then(()=>{
                        this.onUpdateComment(commentList)
                        this.setState({commentList, loadingScene: false})
                    })
                    return;
                }
            }
        } else {
            if (this.state.text === '') {
                alert("Please add a comment.")
                return;
            }
        }

        this.onUpdate();
    }

    _renderItem = ({ item, key }) => (
        <View
            key={key}
            style={{ marginBottom: p(8), borderBottomWidth: p(0.8), borderBottomColor: 'black', alignItems: 'center', flexDirection: 'row', borderBottomColor: '#d5d5d5', borderBottomWidth: p(2), paddingVertical: p(6) }}
        >
            <Image source={{ uri: item.logoPic }} style={{ width: p(28), height: p(28), borderRadius: p(14), marginHorizontal: p(11), marginLeft: p(20) }} />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: p(16), fontWeight: '300', marginLeft: p(12), paddingRight: p(45) }}>
                    <Text style={{ fontWeight: '500', color: '#222' }}>{item.username + '  '}</Text>
                    <Text style={{ fontWeight: '300', color: '#7e7e7e' }}>{item.commentMessage}</Text>
                </Text>
            </View>
            {
                this.props.user.uid === item.userID || this.props.user.uid === postUid ?
                    <TouchableOpacity
                        onPress={() => this.onComment(item, true)}
                        style={{ width: p(20), height: p(20), justifyContent: 'center', alignItems: 'center', marginRight: p(20), borderRadius: p(10), backgroundColor: '#fd1c15' }}>
                        <AntDesign
                            name='minus'
                            size={p(16)}
                            color='white'
                        />
                    </TouchableOpacity> : <View />
            }
        </View>
    )

    render() {
        return (
            !this.state.loadingScene ?
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ref={(ref) => { this.flatListRef = ref; }}
                            style={{ marginTop: 12, flex: 1 }}
                            data={this.state.commentList}
                            keyExtractor={(item, i) => String(i)}
                            renderItem={this._renderItem} />
                    </View>

                    <View style={styles.commentSendContainer}>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder={'Add a Comment...'}
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                        />
                        <TouchableOpacity onPress={() => this.onComment(null, false)} style={styles.iconSend}>
                            <Ionicons
                                name='md-send'
                                size={p(18)}
                                color='white'
                            />
                        </TouchableOpacity>
                    </View>
                </View> : <Spinner visible={this.state.loadingScene} />
        );
    }
}

const styles = {
    container: {
        flex: 1,
        // padding: Platform.OS === 'ios'? p(5): p(0),
    },
    // textArea: {
    //     backgroundColor: '#fff',
    //     height: p(200),
    //     marginTop: p(7),
    //     fontSize: p(11),
    //     lineHeight: p(17),
    //     borderRadius: p(10),
    //     padding: p(8),
    //     textAlignVertical: 'top'
    // },
    iconSend: {
        width: p(30),
        height: p(30),
        borderRadius: p(15),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2596bf',
        alignSelf: 'flex-end',
        marginLeft: p(10),
        marginBottom: Platform.OS === 'ios'? p(15): 0
    },
    icon: {
        marginTop: p(20),
        width: p(25),
        height: p(22),
        marginRight: p(8)
    },
    time: {
        backgroundColor: '#ff8000',
        borderRadius: p(20),
        marginTop: p(20),
        marginHorizontal: p(5),
        paddingHorizontal: p(12)
    },
    commentSendContainer: {
        backgroundColor: '#cccccc',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: p(10),
        flexDirection: 'row'
    },
    textArea: {
        backgroundColor: '#fff',
        flex: 1,
        fontSize: p(14),
        minHeight: Platform.OS === 'ios' ? 45 : 30,
        marginBottom: Platform.OS === 'ios'? 15: 0,
        borderRadius: p(15),
        paddingHorizontal: p(20),
        paddingVertical: 10
       
    },
};

function mapStateToProps(state) {
    return {
        user: state.user,
        lang: state.lang,
        profilePics: state.profilePics
    }
}

export default connect(mapStateToProps, {})(Comments);
