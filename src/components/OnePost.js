import React, { useEffect, useState } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    ImageBackground,
    Image,
    Dimensions
} from 'react-native'
import ViewMoreText from 'react-native-view-more-text'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { p } from './common/normalize'
import firestore, { firebase } from '@react-native-firebase/firestore'
import { strings } from '../locales/i18n';
import { shuffle } from '../static/constant'
import { setLang } from '../redux/action'
import { connect } from 'react-redux'
import { Thumbnail } from 'react-native-thumbnail-video';
import RNUrlPreview from 'react-native-url-preview';
import * as VideoThumbnails from 'expo-video-thumbnails';


const deviceWidth = Dimensions.get("window").width

// export default function OnePost({ rowData, navigation, query, user, onSoundPlay, isblockList, startGame, refreshPage, setLoading }) 
const OnePost = ({ rowData, navigation, query, user, onSoundPlay, isblockList, refreshPage, setLoading, setLang, lang }) => {
    console.log("rowData");
    console.log(rowData);
    useEffect(() => {
        firestore().collection('user').doc(rowData.uid).get().then(userProfileDoc => {
            if (userProfileDoc.exists) {
                const userProfile = userProfileDoc.data()
                setUsername(userProfile.username)
                setMyPic(userProfile.profilePics && userProfile.profilePics.length > 0 ? userProfile.profilePics[userProfile.profilePics.length - 1].illustration : userProfile.myPic)
                setNotify(userProfile.nitify)
            }

        })
        firestore().collection('Post').doc(rowData.id).collection('comment').orderBy('time').get().then(commentSnapshot => {
            for (const doc of commentSnapshot.docs) {
                const commentMessage = doc.data().commentMessage
                const userID = doc.data().userID
                firestore().collection('user').doc(userID).get().then(userDoc => {
                    if (userDoc.exists) {
                        const userData = userDoc.data()
                        const playerId = userData.notify ? userData.playerId : ''
                        const logoPic = userData.profilePics && userData.profilePics.length > 0 ? userData.profilePics[userData.profilePics.length - 1].illustration : userData.myPic
                        const username = userData.username
                        commentList.push({ userID, playerId, commentMessage, logoPic, username, commentid: doc.id })
                        setCommentList([...commentList])
                    }
                })
            }
        })
    }, [])

    const { uid, id, videoURL, audioURL, audioDuration, imageURL, isEn, isHide, postDate, postlang, postmessage, gameID, gameName, gameLang } = rowData
    const [username, setUsername] = useState(rowData.username)
    const [image, setImage] = useState(null);
    const [myPic, setMyPic] = useState(rowData.myPic)
    const [notify, setNotify] = useState(false)
    const [commentList, setCommentList] = useState([])
    const [loveList, setLoveList] = useState(rowData.loveList)
    const [deleted, setDelected] = useState(false)
    const [hiddenList, setHiddenList] = useState(rowData.hiddenList)
    const renderViewMore = (onPress) => {
        return (
            <Text style={{ textAlign: 'right', fontSize: p(14), color: '#70adca', }} onPress={onPress}>{strings('FriendsList.read_more')}</Text>
        )
    }
    const renderViewLess = (onPress) => {
        return (
            <Text style={{ textAlign: 'right', fontSize: p(14), color: '#70adca', }} onPress={onPress}>{strings('FriendsList.read_less')}</Text>
        )
    }
    const onUpdateComment = (commentList) => {
        setCommentList([...commentList])
    }

    const onCommentDetail = () => {
        const { navigate } = navigation;
        const playerId = notify ? playerId : ''
        navigate('Comments', { commentList, postID: rowData.id, playerId, onUpdateComment })
    }
    const onLove = () => {
        console.log("lovelist : ", loveList);

        let tmpList = [...loveList];
        if (tmpList.includes(user.uid)) {
            let getIndex = tmpList.findIndex((p) => p == user.uid);
            if (getIndex != -1) {
                tmpList.splice(getIndex, 1);
                firestore().collection('Post').doc(id).update({ loveList: tmpList }).then((_) => {
                    setLoveList(tmpList);
                });
            }
        } else {
            tmpList.push(user.uid);

            firestore().collection('Post').doc(id).update({ loveList: tmpList }).then((_) => {
                setLoveList(tmpList);
            });
        }

        // if (Array.isArray(loveList)) {
        //     if (loveList && loveList.length !== 0 && loveList.indexOf(user.uid) == -1) {
        //         const list = loveList
        //         list.push(user.uid)
        //         setLoveList([...list])
        //         console.log('lovelist:', list)
        //         firestore().collection('Post').doc(id).update({ loveList: list })
        //     }
        // } else {
        //     setLoveList([user.uid])
        //     firestore().collection('Post').doc(id).update({ loveList: [user.uid] })
        // }
    }
    const onBlock = () => {
        if (user.uid === uid) {
            setDelected(true)
            firestore().collection('Post').doc(id).delete()
        } else {
            if (Array.isArray(hiddenList)) {
                if (hiddenList && hiddenList.indexOf(user.uid) == -1) {
                    hiddenList.push(user.uid)
                    setHiddenList([...hiddenList])
                    firestore().collection('Post').doc(id).update({ hiddenList })
                }
            } else {
                setHiddenList([user.uid])
                firestore().collection('Post').doc(id).update({ hiddenList: [user.uid] })
            }
        }
    }

    // const startGame = (uid, gameID) => {
    //     // this.setState({ loadingScene: true })
    //     setLoading(true)
    //     firestore().collection('user').doc(uid).collection('games').doc(gameID).get().then(doc => {
    //         if (doc.exists) {
    //             const gameData = doc.data()
    //             gameData['prevLang'] = lang
    //             gameData['allCorrect'] = 0
    //             var introductionCard = null
    //             firestore().collection('user').doc(uid).collection('games').doc(gameID).collection('cards').get().then(snapshot => {
    //                 const gameCards = []
    //                 console.log("snapshot.docs : ", snapshot.docs);
    //                 for (const doc of snapshot.docs) {
    //                     const cardData = doc.data()
    //                     if (cardData.type == 'introductions') {
    //                         introductionCard = cardData
    //                     } else {
    //                         gameCards.push(cardData)
    //                     }
    //                 }
    //                 shuffle(gameCards)
    //                 if (introductionCard) {
    //                     gameCards.push(introductionCard)
    //                 }
    //                 const oneCard = gameCards.pop()
    //                 // this.setState({ loadingScene: false })
    //                 setLoading(false)
    //                 setLang({
    //                     languageNative: gameData.lessonLanguage,
    //                     languageLearning: lang.languageLearning
    //                 })
    //                 gameData.cards = gameCards.length
    //                 console.log("gameCards : ", gameCards);
    //                 navigation.push(oneCard.type, { oneCard, gameCards, gameData })
    //             })
    //         }
    //     })
    // }

    const startGame = (uid, gameID) => {
        // this.setState({ loadingScene: true })
        setLoading(true)
        firestore().collection('user').doc(uid).collection('games').doc(gameID).get().then(doc => {
            if (doc.exists) {
                const gameData = doc.data()
                gameData['prevLang'] = lang
                gameData['allCorrect'] = 0
                var introductionCard = null
                firestore().collection('user').doc(uid).collection('games').doc(gameID).collection('cards').get().then(snapshot => {
                    const gameCards = []
                    console.log("snapshot.docs : ", snapshot.docs.length);
                    for (const doc of snapshot.docs) {
                        const cardData = doc.data()
                        // if (cardData.type == 'introductions' && introductionCard==null) {
                        //     introductionCard = cardData
                        // } else {
                        //     gameCards.push(cardData)
                        // }
                        gameCards.push(cardData)
                    }
                    // shuffle(gameCards)
                    // if (introductionCard) {
                    //     gameCards.push(introductionCard)
                    // }
                    let getIndex = gameCards.findIndex((item) => item.type == 'introductions');
                    let oneCard = gameCards[0];
                    if (getIndex != -1) {
                        oneCard = gameCards[getIndex];
                        gameCards.splice(getIndex, 1);
                    } else {
                        gameCards.splice(0, 1)
                    }

                    // const oneCard = gameCards.pop()
                    // this.setState({ loadingScene: false })
                    setLoading(false)
                    setLang({
                        languageNative: gameData.lessonLanguage,
                        languageLearning: lang.languageLearning
                    })
                    gameData.cards = gameCards.length
                    navigation.push(oneCard.type, { oneCard, gameCards, gameData })
                })
            }
        })
    }

    const deletePost = () => {
        setLoading(true);
        if (user.uid === uid) {
            setDelected(true)
            firestore().collection('Post').doc(id).delete().then((_) => {
                firestore().collection('user').doc(user.uid).collection('media').where('id', '==', id).get().then((snapshot) => {
                    if (snapshot.docs.length > 0) {
                        firestore().collection('user').doc(user.uid).collection('media').doc(snapshot.docs[0].id).delete().then((_) => {
                            setLoading(false);
                         
                            refreshPage();
                        }).catch((error) => {
                            setLoading(false);
                            console.log("e : ", e);
                        });
                    } else {
                        setLoading(false);
                        refreshPage();
                        // setLoading(false);
                    }
                }).catch((e) => {
                    setLoading(false);
                    console.log("e : ", e);
                   
                });
            }).catch((e) => {
                setLoading(false);
                console.log("e : ", e);
               
            });
        } else {
            if (Array.isArray(hiddenList)) {
                if (hiddenList && hiddenList.indexOf(user.uid) == -1) {
                    hiddenList.push(user.uid)
                    setHiddenList([...hiddenList])
                    firestore().collection('Post').doc(id).update({ hiddenList }).then((_) => {
                       setLoading(false);
                        refreshPage();
                    }).catch((e) => {
                        setLoading(false);
                        console.log("e : ", e);
                        alert(e);
                    });
                }
            } else {
                setHiddenList([user.uid])
                firestore().collection('Post').doc(id).update({ hiddenList: [user.uid] }).then((_) => {
                    setLoading(false);
                    refreshPage();
                }).catch((e) => {
                    setLoading(false);
                    console.log("e : ", e);
                });
            }
        }
    }

    const generateThumbnail = async () => {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            {
              time: 15000,
            }
          );
          setImage(uri);
        } catch (e) {
          console.warn(e);
        }
      };

    // const deletePost = () => {
    //     setLoading(true);
    //     firestore().collection('Post').doc(user.uid).delete().then((_) => {
            // firestore().collection('user').doc(user.uid).collection('media').where('id', '==', id).get().then((snapshot) => {
            //     if (snapshot.docs.length > 0) {
            //         firestore().collection('user').doc(user.uid).collection('media').doc(snapshot.docs[0].id).delete().then((_) => {
            //             setLoading(false);
            //             refreshPage();
            //             navigation.goBack();
            //         }).catch((e) => {
            //             setLoading(false);
            //             console.log("e : ", e);
            //         });
            //     } else {
            //         setLoading(false);
            //     }
            // }).catch((e) => {
            //     setLoading(false);
            //     console.log("e : ", e);
            // });
    //     }).catch((e) => {
    //         setLoading(false);
    //         console.log("e : ", e);
    //     });
    // }

    // if (query !== '' && username.toLowerCase().indexOf(query.toLowerCase()) === -1) {
    //     return <View />
    // }
    if (query !== '' && username.toLowerCase() == query.toLowerCase()) {
        return <View />
    }
    if (hiddenList && hiddenList.indexOf(user.uid) != -1 || deleted) {
        return <View />
    }
    console.log('ritesh');
    console.log(videoURL);
    return <View key={rowData.id} style={{
        width: '100%', backgroundColor: 'white', borderRadius: 7, padding: p(10), marginBottom: p(10), flex: 1,
        elevation: 2,
        shadowOffset: { width: p(2), height: p(2) },
        shadowColor: "grey",
        shadowOpacity: 0.1,
        shadowRadius: 6,
    }}>
        {/* fontFamily: 'bold', */}
        <View style={{ height: p(60), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('OtherProfile', { 'uid': uid })}>
                <Image source={{ uri: myPic }} style={{ width: p(40), height: p(40), borderRadius: p(20) }} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'flex-end', marginLeft: p(10) }}>
                <Text style={{  fontSize: p(16), color: 'orange' }}>{username}</Text>
                <Text style={{ fontSize: p(12), color: '#70adca' }}>{postlang === 0 ? 'EN > PT' : 'PT > EN'}</Text>
            </View>
            <View></View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ flex: 1 }}></View>
                <Text style={{ flex: 1, fontSize: p(14), textAlign: 'right', marginRight: p(20) }}>{postDate}</Text>
            </View>
        </View>
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                // if (!gameID) {
                //     navigation.push('ViewPost', {
                //         rowData, index, navigation, query, user, onSoundPlay, blockList, startGame
                //     })
                // }
            }}>
            {
                <ViewMoreText
                    numberOfLines={4}
                    renderViewMore={renderViewMore}
                    renderViewLess={renderViewLess}
                    textStyle={{ textAlign: 'left' }}>
                    <Text style={{ paddingLeft: p(10), marginBottom: p(10), fontSize: p(16) }}>{postmessage}</Text>
                </ViewMoreText>
            }
            {
                 gameID ?

                    <ImageBackground source={{ uri: imageURL }} style={{ marginHorizontal: p(10), height: (deviceWidth - p(80)) * 3 / 4, alignItems: 'center', justifyContent: 'center' }} >
                        {/* <TouchableOpacity
                            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, backgroundColor: 'green', opacity: 0.7, borderRadius: 10 }}
                            onPress={() => startGame(uid, gameID)}>
                            <Text style={{ padding: 0, color: 'white', textAlignVertical: 'center', fontSize: 20 }}>Play</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={() => startGame(uid, gameID)}>
                            <Image source={require('../assets/play_icon.png')} style={{ width: 150, height: 100 }} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={{ position: 'absolute', left: 0, bottom: 0, right: 0, height: 50, padding: 10, backgroundColor: '#fff', opacity: 0.7 }}>
                            <Text style={{ color: 'black' }}>{gameName}</Text>
                            <Text style={{ color: 'black' }}>{gameLang}</Text>
                        </View>
                    </ImageBackground>
                    :
                   
               imageURL !== '' && <Image source={{ uri: imageURL }} style={{ marginHorizontal: p(10), height: (deviceWidth - p(80)) * 3 / 4 }} />
            }
            {
                audioURL != undefined && audioURL !== '' && <View style={{ flexDirection: 'row', width: p(120), alignItems: 'center', marginRight: p(10), marginTop: p(10), backgroundColor: '#4bacf1', borderRadius: p(6), padding: p(5) }}>
                    <TouchableOpacity onPress={() => {
                        onSoundPlay(rowData.audioURL, rowData.id, rowData.isAudioPlaying);
                    }}>
                        {rowData.isAudioPlaying
                            ? <AntDesign
                                name='pause'                 
                                size={p(24)}
                                color='#2b53da'
                            />
                            : <AntDesign
                                name='play'
                                size={p(24)}
                                color='#2b53da'
                            />}
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: 'right', color: 'white' }}>{audioDuration}</Text>
                </View>
            }
            {
                // videoURL !== undefined && 
               <View style={styles.container}>
                    <TouchableOpacity onPress={generateThumbnail} title="Generate thumbnail" />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text>{image}</Text>
                   {/* <Thumbnail  url={"https://www.youtube.com/watch?v=w7ejDZ8SWv8"} />  */}
                          
                  {/* <RNUrlPreview text={videoURL}/> */}
                </View> 
            }
            <View style={{ marginLeft: p(10), marginTop: p(10), flexDirection: 'row', alignItems: 'center' }}>
                {
                    <TouchableOpacity onPress={onLove}>
                        <AntDesign
                            name={loveList && loveList.length !== 0 && loveList.indexOf(user.uid) !== -1 ? 'heart' : 'hearto'}
                            size={p(22)}
                            color={loveList && loveList.length !== 0 && loveList.indexOf(user.uid) !== -1 ? '#de2d3f' : 'black'}
                        />
                    </TouchableOpacity>
                }
                {loveList && loveList.length !== 0
                    ? <Text style={styles.commentTextContainer}>{loveList.length}</Text>
                    : <Text style={styles.commentTextContainer}>0</Text>
                }
                {
                    <TouchableOpacity onPress={onCommentDetail}>
                        <MaterialCommunityIcons
                            name={commentList && commentList.length !== 0 && commentList.indexOf(user.uid) !== -1 ? 'comment' : 'comment-outline'}
                            size={p(22)}
                            color={commentList && commentList.length !== 0 && commentList.indexOf(user.uid) !== -1 ? '#88b7c3' : 'black'}
                        />
                    </TouchableOpacity>
                }
                {commentList && commentList.length !== 0
                    ? <Text style={styles.commentTextContainer}>{commentList.length}</Text>
                    : <Text style={styles.commentTextContainer}>0</Text>
                }
                <View style={{ flex: 1 }} />
                {/* <TouchableOpacity onPress={onBlock}>
                    <MaterialCommunityIcons
                        name='block-helper'
                        size={p(20)}
                        color={isblockList ? 'red' : '#88b7c3'}
                        style={{ marginRight: p(10) }}
                    />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={deletePost}>
                    <MaterialIcons
                        name='delete'
                        size={p(25)}
                        color='red'
                        style={{ marginRight: p(10) }}
                    />
                </TouchableOpacity>
            </View>
            {
                commentList.length > 0 ? <View style={{ width: '100%', height: .5, backgroundColor: 'lightgrey' }} /> : <View />
            }
            {
                commentList.length > 0 ? <View style={{ alignItems: 'center', width: '100%' }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginTop: p(10) }}>
                        <Image source={{ uri: commentList[commentList.length - 1].logoPic }} style={{ width: p(30), height: p(30) }} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontSize: p(16) }}>{commentList[commentList.length - 1].username}</Text>
                            <Text style={{ flex: 1, color: 'grey', fontSize: p(12) }}>{commentList[commentList.length - 1].commentMessage}</Text>
                        </View>
                    </View>
                </View> : <View />
            }
        </TouchableOpacity>
    </View>
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textArea: {
        backgroundColor: '#fff',
        width: deviceWidth * 0.8,
        height: p(100),
        marginTop: p(10),
        fontSize: p(11),
        lineHeight: p(17),
        borderRadius: p(10),
        padding: p(8),
        textAlignVertical: 'top'
    },
    modalWrapper: {
        marginHorizontal: p(20),
        marginTop: p(5),
        marginBottom: p(5),
        borderRadius: p(5),
        borderColor: 'white',
        borderWidth: p(2),
        marginRight: p(30)
    },
    modalBtnText: {
        color: 'white',
        fontFamily: 'bold',
        fontSize: p(16),
    },
    createPostContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c3e3e5',

        borderRadius: p(10),
        flex: 1,
        height: p(40),
        marginHorizontal: p(20),
        paddingHorizontal: p(20),
        elevation: 2,
        shadowOffset: { width: p(2), height: p(2) },
        shadowColor: "grey",
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    commentTextContainer: {
        fontSize: p(10),
        marginRight: p(30),
        marginLeft: p(5),
        textAlignVertical: 'bottom'
    },
    imagecontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      image: {
        width: 200,
        height: 200,
      },
};

function mapStateToProps(state) {
    return {
        lang: state.lang
    }
}

export default connect(mapStateToProps, { setLang })(OnePost);