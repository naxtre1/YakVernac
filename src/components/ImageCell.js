import React, { useState, useEffect, useContext, useRef } from 'react'
import {
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationContext } from 'react-navigation'
import firestore from '@react-native-firebase/firestore'

const deviceWidth = Dimensions.get('window').width

export default ImageCell = ({ media, callbackBookmark, refreshPage, setLoading }) => {
    const navigation = useContext(NavigationContext)
    const handleBookmark = () => {
        callbackBookmark(media)
    }

    // const startGame = (uid, gameID) => {
    // 	// this.setState({ loadingScene: true })
    // 	firestore().collection('user').doc(uid).collection('games').doc(gameID).get().then(doc => {
    // 		if (doc.exists) {
    // 			const gameData = doc.data()
    // 			gameData['prevLang'] = this.props.lang
    // 			gameData['allCorrect'] = 0
    // 			var introductionCard = null
    // 			firestore().collection('user').doc(uid).collection('games').doc(gameID).collection('cards').get().then(snapshot => {
    // 				const gameCards = []
    // 				console.log("snapshot.docs : ", snapshot.docs);
    // 				for (const doc of snapshot.docs) {
    // 					const cardData = doc.data()
    // 					if (cardData.type == 'introductions') {
    // 						introductionCard = cardData
    // 					} else {
    // 						gameCards.push(cardData)
    // 					}
    // 				}
    // 				shuffle(gameCards)
    // 				if (introductionCard) {
    // 					gameCards.push(introductionCard)
    // 				}
    // 				const oneCard = gameCards.pop()
    // 				this.setState({ loadingScene: false })
    // 				this.props.setLang({
    // 					languageNative: gameData.lessonLanguage,
    // 					languageLearning: this.props.lang.languageLearning
    // 				})
    // 				gameData.cards = gameCards.length
    // 				console.log("gameCards : ", gameCards);
    // 				navigation.push(oneCard.type, { oneCard, gameCards, gameData })
    // 			})
    // 		}
    // 	})
    // }

    const handleGoPost = () => {
        // if (media.type == 'post') {
        //     navigation.push('PostScreen', { id: media.id })
        // }

        console.log("---media--- : ", media);
        if (media.type == 'post') {
            firestore().collection('Post').where('id', '==', media.id).limit(1).get().then((snap) => {
                console.log("length : ", snap.docs.length);
                if (snap.docs.length > 0) {
                    navigation.push('ViewPost', {
                        rowData: snap.docs[0].data(),
                        index: 0,
                        query: '',
                        onSoundPlay: null,
                        blockList: [],
                        startGame: null,
                        refreshPage: refreshPage,
                        setLoading: setLoading
                    })
                } else {
                    firestore().collection('user').doc('DwcooNweRCbM6E57m1VMwl4uMAW2').collection('media').doc(media.key).delete().then((_) => {
                        console.log("done : ");
                    });
                }
            }).catch((e) => {
                console.log("catch e : ", e);
            });
        }
    }

    return (
        <TouchableOpacity onPress={handleGoPost}>
            <ImageBackground source={{ uri: media.url }} style={{ width: deviceWidth / 3, height: deviceWidth / 3, borderColor: 'white', borderWidth: 2 }} resizeMode='cover' >
                {
                    // <FontAwesome name='bookmark' size={20} color={media.bookmark?'red' : 'black'} onPress={handleBookmark} />
                    <FontAwesome name='bookmark' size={20} color={media.bookmark ? 'black' : 'transparent'} onPress={handleBookmark} />
                }
                {/* {media.type == 'lesson'
                    ? <Image
                        source={require('../assets/type_lesson.png')}
                        style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8 }} />
                    : media.type == 'audio'
                        ? <Image
                            source={require('../assets/type_audio.png')}
                            style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8 }} />
                        : media.type == 'video'
                            ? <Image
                                source={require('../assets/type_video.png')}
                                style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8 }} />
                            : media.type == 'post' && media.isFromCreateGame != undefined && media.isFromCreateGame
                                ? <Image
                                    source={require('../assets/game.png')}
                                    style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8, tintColor:'white' }} />
                                : <Image
                                    source={require('../assets/article.png')}
                                    style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8, tintColor:'white' }} />} */}
                {media.content == 'audio'
                    ? <Image
                        source={require('../assets/type_audio.png')}
                        style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8 }} />
                    : media.content == 'video'
                        ? <Image
                            source={require('../assets/type_video.png')}
                            style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8 }} />
                        : media.type == 'post' && media.isFromCreateGame != undefined && media.isFromCreateGame && media.content == 'image'
                            ? <Image
                                source={require('../assets/type_lesson.png')}
                                style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8, tintColor: 'white' }} />
                            : media.type == 'post' && media.isFromCreateGame != undefined && media.isFromCreateGame && media.content == 'image'
                                ? <Image
                                    source={require('../assets/game.png')}
                                    style={{ height: 24, width: 24, resizeMode: 'cover', position: 'absolute', top: 8, right: 8, tintColor: 'white' }} />
                                : null}

            </ImageBackground>
        </TouchableOpacity>
    )
}