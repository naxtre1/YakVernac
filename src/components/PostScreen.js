import React, { Component, useEffect, createRef } from 'react';
import {Text, View, Button, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, Dimensions, FlatList, ActivityIndicator, Platform } from 'react-native';
import ListView from 'deprecated-react-native-listview';
import { CustomHeader } from './common/CustomHeader';
import { p } from './common/normalize'
import { Icon, colors } from 'react-native-elements'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { images } from './common/images';
import { strings } from '../../src/locales/i18n';
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'
// import RNFetchBlob from 'rn-fetch-blob'
import Spinner from "react-native-loading-spinner-overlay";
import ViewMoreText from 'react-native-view-more-text';
import SoundPlayer from 'react-native-sound-player'
import Modal from "react-native-modal"
import { shuffle } from '../static/constant'
import { setLang } from '../redux/action'
import OnePost from './OnePost'
import { NavigationEvents } from 'react-navigation'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';

// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob
const deviceWidth = Dimensions.get("window").width
// Create instance variable(s) to store your subscriptions in your class
_onFinishedPlayingSubscription = null
_onFinishedLoadingSubscription = null
_onFinishedLoadingFileSubscription = null
_onFinishedLoadingURLSubscription = null

class PostScreen extends Component {

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
		this.state = {
			loadingScene: false,
			query: '',
			items: [],
			recentitem: [],
			isModalVisible: false,
			text: '',
			blockList: [],
			referenceToOldestKey: '',
			loadingFromServer: false,
			SearchInputValueHolder: '',
			searchTag: '',
			searchData: [],
			// asyncVal: []
		}
	
	}

	// onRefresh = () => {
	// 	this.setState({ loadingScene: true })
	// 	firestore().collection('Post').get().then(async snap => {
	// 		console.log("post : ", snap);

	// 		// get children as an array
	// 		const items = []
	// 		for (const doc of snap.docs) {
	// 			try {
	// 				const data = doc.data()
	// 				const item = {
	// 					id: doc.id,
	// 					uid: data.uid,
	// 					gameID: data.gameID,
	// 					gameName: data.gameName,
	// 					gameLang: data.gameLang,
	// 					username: data.username,
	// 					myPic: data.profilePics && data.profilePics.length > 0 ? data.profilePics[data.profilePics.length - 1].illustration : data.myPic,
	// 					postlang: data.postlang,
	// 					postmessage: data.postmessage,
	// 					loveList: data.loveList ? data.loveList : [],
	// 					// commentList: data.commentList === undefined ? [] : data.commentList,
	// 					hiddenList: data.hiddenList === undefined ? [] : data.hiddenList,
	// 					postDate: data.postDate,
	// 					isHide: data.isHide,
	// 					isEn: data.isEn,
	// 					imageURL: data.imageURL,
	// 					audioURL: data.audioURL,
	// 					audioDuration: data.audioDuration,
	// 					isMore: false,
	// 					isAudioPlaying: false
	// 				}
	// 				// const commentList = []
	// 				// const userProfileDoc = await firestore().collection('user').doc(data.uid).get()
	// 				// if (userProfileDoc.exists) {
	// 				//     const userProfile = userProfileDoc.data()
	// 				//     item.username = userProfile.username
	// 				//     item.myPic = userProfile.profilePics&&userProfile.profilePics.length>0?userProfile.profilePics[userProfile.profilePics.length-1].illustration:userProfile.myPic
	// 				//     item.notify = userProfile.nitify
	// 				// }
	// 				// const commentSnapshot = await firestore().collection('Post').doc(doc.id).collection('comment').orderBy('time').get()
	// 				// for (const doc of commentSnapshot.docs) {
	// 				//     const commentMessage = doc.data().commentMessage
	// 				//     const userID = doc.data().userID
	// 				//     const userDoc = await firestore().collection('user').doc(userID).get()
	// 				//     const user = userDoc.data()
	// 				//     const playerId = user.notify?user.playerId:''
	// 				//     const logoPic = user.profilePics&&user.profilePics.length>0?user.profilePics[user.profilePics.length-1].illustration:user.myPic
	// 				//     const username = user.username
	// 				//     commentList.push({userID, playerId, commentMessage, logoPic, username, commentid: doc.id})
	// 				// }
	// 				// item.commentList = commentList
	// 				items.push(item)
	// 			} catch (error) {
	// 				continue
	// 			}
	// 		}
	// 		const reverseItems = items.reverse()
	// 		this.setState({
	// 			items: reverseItems,
	// 			loadingScene: false
	// 		});
	// 		const postID = this.props.navigation.getParam('id')
	// 		if (postID) {
	// 			var index = 0
	// 			var postIndex = 0
	// 			for (; index < reverseItems.length; index++) {
	// 				if (postID == reverseItems[index].id) {
	// 					postIndex = index
	// 					break
	// 				}
	// 			}
	// 			// rowData={item}
	// 			// index={index}
	// 			// navigation={this.props.navigation}
	// 			// query={this.state.query}
	// 			// user={this.props.user}
	// 			// onSoundPlay={this.onSoundPlay}
	// 			// blockList={this.state.blockList}
	// 			// startGame={this.startGame}
	// 			setTimeout(() => {
	// 				this.props.navigation.push('ViewPost', {
	// 					rowData: reverseItems[index],
	// 					index: postIndex,
	// 					navigation: this.props.navigation,
	// 					query: this.state.query,
	// 					user: this.props.user,
	// 					onSoundPlay: this.onSoundPlay,
	// 					blockList: this.state.blockList,
	// 					startGame: null
	// 				})
	// 			}, 1000)

	// 		}
	// 	});
	// }

	// onRefresh = () => {
	// 	this.setState({ loadingScene: true })
	// 	firestore().collection('Post').get().then(async snap => {
	// 		console.log("post : ", snap);

	// 		// get children as an array
	// 		const items = []
	// 		for (const doc of snap.docs) {
	// 			try {
	// 				const data = doc.data()
	// 				const item = {
	// 					id: doc.id,
	// 					uid: data.uid,
	// 					gameID: data.gameID,
	// 					gameName: data.gameName,
	// 					gameLang: data.gameLang,
	// 					username: data.username,
	// 					myPic: data.profilePics && data.profilePics.length > 0 ? data.profilePics[data.profilePics.length - 1].illustration : data.myPic,
	// 					postlang: data.postlang,
	// 					postmessage: data.postmessage,
	// 					loveList: data.loveList ? data.loveList : [],
	// 					// commentList: data.commentList === undefined ? [] : data.commentList,
	// 					hiddenList: data.hiddenList === undefined ? [] : data.hiddenList,
	// 					postDate: data.postDate,
	// 					isHide: data.isHide,
	// 					isEn: data.isEn,
	// 					imageURL: data.imageURL,
	// 					audioURL: data.audioURL,
	// 					audioDuration: data.audioDuration,
	// 					isMore: false,
	// 					isAudioPlaying: false
	// 				}
	// 				// const commentList = []
	// 				// const userProfileDoc = await firestore().collection('user').doc(data.uid).get()
	// 				// if (userProfileDoc.exists) {
	// 				//     const userProfile = userProfileDoc.data()
	// 				//     item.username = userProfile.username
	// 				//     item.myPic = userProfile.profilePics&&userProfile.profilePics.length>0?userProfile.profilePics[userProfile.profilePics.length-1].illustration:userProfile.myPic
	// 				//     item.notify = userProfile.nitify
	// 				// }
	// 				// const commentSnapshot = await firestore().collection('Post').doc(doc.id).collection('comment').orderBy('time').get()
	// 				// for (const doc of commentSnapshot.docs) {
	// 				//     const commentMessage = doc.data().commentMessage
	// 				//     const userID = doc.data().userID
	// 				//     const userDoc = await firestore().collection('user').doc(userID).get()
	// 				//     const user = userDoc.data()
	// 				//     const playerId = user.notify?user.playerId:''
	// 				//     const logoPic = user.profilePics&&user.profilePics.length>0?user.profilePics[user.profilePics.length-1].illustration:user.myPic
	// 				//     const username = user.username
	// 				//     commentList.push({userID, playerId, commentMessage, logoPic, username, commentid: doc.id})
	// 				// }
	// 				// item.commentList = commentList
	// 				items.push(item)
	// 			} catch (error) {
	// 				continue
	// 			}
	// 		}
	// 		const reverseItems = items.reverse()
	// 		this.setState({
	// 			items: reverseItems,
	// 			loadingScene: false
	// 		});
	// 		const postID = this.props.navigation.getParam('id')
	// 		if (postID) {
	// 			var index = 0
	// 			var postIndex = 0
	// 			for (; index < reverseItems.length; index++) {
	// 				if (postID == reverseItems[index].id) {
	// 					postIndex = index
	// 					break
	// 				}
	// 			}
	// 			// rowData={item}
	// 			// index={index}
	// 			// navigation={this.props.navigation}
	// 			// query={this.state.query}
	// 			// user={this.props.user}
	// 			// onSoundPlay={this.onSoundPlay}
	// 			// blockList={this.state.blockList}
	// 			// startGame={this.startGame}
	// 			setTimeout(() => {
	// 				this.props.navigation.push('ViewPost', {
	// 					rowData: reverseItems[index],
	// 					index: postIndex,
	// 					navigation: this.props.navigation,
	// 					query: this.state.query,
	// 					user: this.props.user,
	// 					onSoundPlay: this.onSoundPlay,
	// 					blockList: this.state.blockList,
	// 					startGame: null
	// 				})
	// 			}, 1000)

	// 		}
	// 	});
	// }

	componentDidMount() {
		console.log("height5",getStatusBarHeight());
		// this.loadMoreData(true);
		_onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
			console.log('finished playing', success)
			this.stopSoundPlayerByUpdatingItems();
		})
		_onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
			console.log('finished loading', success)
		})
		_onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
			console.log('finished loading file', success, name, type)
		})
		_onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
			console.log('finished loading url', success, url)
			SoundPlayer.play()
		})
	}

	refreshPage = () => {
		this.setState({
			loadingScene: false,
			query: '',
			items: [],
			isModalVisible: false,
			text: '',
			blockList: [],
			referenceToOldestKey: '',
			loadingFromServer: false,
			searchTag: ''
		});
	
		_onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
			console.log('finished playing', success)
			this.stopSoundPlayerByUpdatingItems();
		})
		_onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
			console.log('finished loading', success)
		})
		_onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
			console.log('finished loading file', success, name, type)
		})
		_onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
			console.log('finished loading url', success, url)
			SoundPlayer.play()
		})
	
		this.loadMoreData(true);
	}

	setLoading = (isLoading) => {
		this.setState({ loadingScene: isLoading });
	}

	stopSoundPlayerByUpdatingItems = () => {
		try {
			let tempMap = [...this.state.items].map((item) => {
				let finalItem = {
					...item,
					isAudioPlaying: false
				}
				return finalItem;
			});

			this.setState({
				items: tempMap
			});
		} catch (e) {
			console.log(`cannot play the sound file`, e)
		}
	}

	onSoundPlay = (audioURL, id, isAudioPlaying) => {
		let tempMap = [...this.state.items].map((item) => {
			if (item.id == id) {
				let finalItem = {
					...item,
					isAudioPlaying: !isAudioPlaying
				}
				return finalItem;
			} else {
				let finalItem = {
					...item,
					isAudioPlaying: false
				}
				return finalItem;
			}
		});

		try {
			// or play from url
			if (isAudioPlaying) {
				SoundPlayer.stop();
			} else {
				SoundPlayer.playUrl(audioURL);
			}

			this.setState({
				items: tempMap
			});
		} catch (e) {
			console.log(`cannot play the sound file`, e)
		}
	}
	listRef = createRef()
	onUpdate(index, isBlock) {
		const { uid, id, username, myPic, postlang, postmessage, loveList, commentList, hiddenList, postDate, isHide, isEn, imageURL, audioURL, videoURL,audioDuration } = this.state.items[index];
		firestore().collection('Post').doc(`${id}`).update({
			id: id,
			uid: uid,
			username: username,
			myPic: myPic,
			postlang: postlang,
			postmessage: postmessage,
			loveList,
			// commentList: commentList,
			hiddenList: hiddenList,
			postDate: postDate,
			isHide: isHide,
			isEn: isEn,
			imageURL: imageURL,
			audioURL: audioURL,
			videoURL: videoURL,
			audioDuration: audioDuration
		}).then(() => {
			//success callback
			if (isBlock) {
				const blockList = this.state.blockList
				if (blockList.indexOf(index) != -1) blockList.splice(blockList.indexOf(index), 1);
				this.setState({ blockList })
			}
			this.setState({ loadingScene: false })
		}).catch((error) => {
			//error callback
			console.log('error ', error)
			alert("Please try again.")
			this.setState({ loadingScene: false })
		})
	}

	onComment(index) {
		const { uid, id, username, myPic, postlang, postmessage, loveList, commentList, hiddenList, postDate, isHide, isEn, imageURL, audioURL, audioDuration } = this.state.items[index];
		// if (this.state.user.uid === uid){
		//     alert("You can message about your comment.")
		//     return
		// }
		this.setState({ isModalVisible: false });
		const logoPic = this.props.user.profilePics && this.props.user.profilePics.length > 0 ? this.props.user.profilePics[this.props.user.profilePics.length - 1].illustration : this.props.user.myPic
		firestore().collection('Post').doc(this.state.items[index].id).collection('comment').add({
			userID: this.props.user.uid,
			commentMessage,
			time: Date.now()
		}, doc => {
			const playerId = this.props.user.notify ? this.props.user.playerId : ''
			commentList.push({
				commentid: doc.id,
				userID: this.props.user.uid,
				playerId,
				username: this.props.user.username,
				logoPic,
				commentMessage: this.state.text,
			})

		})
		// this.onUpdate(index, false);
	}

	onTranslate(index) {
		const { uid, id, username, myPic, postlang, postmessage, loveList, commentList, hiddenList, postDate, isHide, isEn, imageURL, audioURL, audioDuration } = this.state.items[index];

		this.onUpdate(index, false);
	}

	startGame = (uid, gameID) => {
		this.setState({ loadingScene: true })
		firestore().collection('user').doc(uid).collection('games').doc(gameID).get().then(doc => {
			if (doc.exists) {
				const gameData = doc.data()
				gameData['prevLang'] = this.props.lang
				gameData['allCorrect'] = 0
				var introductionCard = null
				firestore().collection('user').doc(uid).collection('games').doc(gameID).collection('cards').get().then(snapshot => {
					const gameCards = []
					console.log("snapshot.docs : ", snapshot.docs);
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
					this.setState({ loadingScene: false })
					this.props.setLang({
						languageNative: gameData.lessonLanguage,
						languageLearning: this.props.lang.languageLearning
					})
					gameData.cards = gameCards.length
					console.log("gameCards : ", gameCards);
					this.props.navigation.push(oneCard.type, { oneCard, gameCards, gameData })
				})
			}
		})
	}

	// Remove all the subscriptions when component will unmount
	componentWillUnmount() {
		if (_onFinishedPlayingSubscription) _onFinishedPlayingSubscription.remove()
		if (_onFinishedLoadingSubscription) _onFinishedLoadingSubscription.remove()
		if (_onFinishedLoadingURLSubscription) _onFinishedLoadingURLSubscription.remove()
		if (_onFinishedLoadingFileSubscription) _onFinishedLoadingFileSubscription.remove()

		SoundPlayer?.stop();
		  
	}

	onContinue(item) {
		//  alert(item.id)
		// this.setState({ query: 	this.state.query})
	
    }


	getListViewItem = (item) => {  
		this.setState({ query: item })
		if(item.startsWith('#')){
			let txtval = item.replace('#','')
		
					 this.allSearchData('postmessage', txtval)
				}else{
					this.allSearchData('postmessage', item)
				}
		
    }  

	loadMoreData = async (isRefresh) => {
		
		this.setState({ loadingFromServer: true });
		if (!this.state.referenceToOldestKey || isRefresh) {
			firestore().collection('Post')
				.limit(10)
				.orderBy('id', 'desc')
				// .orderBy(firestore.FieldPath.documentId())
				.get()
				.then((snapshot) => {
					console.log("snapshot : ", snapshot);

					let items = [];
					for (const doc of snapshot.docs) {
						try {
							const data = doc.data()
							const item = {
								id: doc.id,
								uid: data.uid,
								gameID: data.gameID,
								gameName: data.gameName,
								gameLang: data.gameLang,
								username: data.username,
								myPic: data.profilePics && data.profilePics.length > 0 ? data.profilePics[data.profilePics.length - 1].illustration : data.myPic,
								postlang: data.postlang,
								postmessage: data.postmessage,
								loveList: data.loveList ? data.loveList : [],
								// commentList: data.commentList === undefined ? [] : data.commentList,
								hiddenList: data.hiddenList === undefined ? [] : data.hiddenList,
								postDate: data.postDate,
								isHide: data.isHide,
								isEn: data.isEn,
								imageURL: data.imageURL,
								audioURL: data.audioURL,
								videoURL: data.videoURL,
								audioDuration: data.audioDuration,
								isMore: false,
								isAudioPlaying: false
							}
							items.push(item)
						} catch (error) {
							continue
						}
					}
					// const reverseItems = items.reverse()

					this.setState({
						items: this.state.items.concat(items),
						// loadingScene: false
					});
					const postID = this.props.navigation.getParam('id')
					if (postID) {
						var index = 0
						var postIndex = 0
						for (; index < reverseItems.length; index++) {
							if (postID == reverseItems[index].id) {
								postIndex = index
								break
							}
						}
						// rowData={item}
						// index={index}
						// navigation={this.props.navigation}
						// query={this.state.query}
						// user={this.props.user}
						// onSoundPlay={this.onSoundPlay}
						// blockList={this.state.blockList}
						// startGame={this.startGame}
						setTimeout(() => {
							this.props.navigation.push('ViewPost', {
								rowData: reverseItems[index],
								index: postIndex,
								navigation: this.props.navigation,
								query: this.state.query,
								user: this.props.user,
								onSoundPlay: this.onSoundPlay,
								blockList: this.state.blockList,
								startGame: null,
								refreshPage: this.refreshPage,
								setLoading: this.setLoading
							})
						}, 1000)
					}
					this.setState({ referenceToOldestKey: snapshot.docs[snapshot.docs.length - 1].id, loadingFromServer: false });
				});
		} else {
			firestore().collection('Post')
				.limit(10)
				// .orderBy(firestore.FieldPath.documentId(), 'desc')
				.orderBy('id', 'desc')
				.startAfter(this.state.referenceToOldestKey)
				.get()
				.then((snapshot) => {
					console.log("snapshot2 : ", snapshot);
					console.log("snapshot2 : ", snapshot.docs[snapshot.docs.length - 1].id);

					let items = [];
					for (const doc of snapshot.docs) {
						try {
							const data = doc.data()
							const item = {
								id: doc.id,
								uid: data.uid,
								gameID: data.gameID,
								gameName: data.gameName,
								gameLang: data.gameLang,
								username: data.username,
								myPic: data.profilePics && data.profilePics.length > 0 ? data.profilePics[data.profilePics.length - 1].illustration : data.myPic,
								postlang: data.postlang,
								postmessage: data.postmessage,
								loveList: data.loveList ? data.loveList : [],
								// commentList: data.commentList === undefined ? [] : data.commentList,
								hiddenList: data.hiddenList === undefined ? [] : data.hiddenList,
								postDate: data.postDate,
								isHide: data.isHide,
								isEn: data.isEn,
								imageURL: data.imageURL,
								audioURL: data.audioURL,
								videoURL: data.videoURL,
								audioDuration: data.audioDuration,
								isMore: false,
								isAudioPlaying: false
							}
							items.push(item)
						} catch (error) {
							continue
						}
					}
					// const reverseItems = items.reverse()
					this.setState({
						items: this.state.items.concat(items),
						// loadingScene: false
					});
					const postID = this.props.navigation.getParam('id')
					if (postID) {
						alert(postID)
						var index = 0
						var postIndex = 0
						for (; index < reverseItems.length; index++) {
							if (postID == reverseItems[index].id) {
								postIndex = index
								break
							}
						}
						// rowData={item}
						// index={index}
						// navigation={this.props.navigation}
						// query={this.state.query}
						// user={this.props.user}
						// onSoundPlay={this.onSoundPlay}
						// blockList={this.state.blockList}
						// startGame={this.startGame}
						setTimeout(() => {
							this.props.navigation.push('ViewPost', {
								rowData: reverseItems[index],
								index: postIndex,
								navigation: this.props.navigation,
								query: this.state.query,
								user: this.props.user,
								onSoundPlay: this.onSoundPlay,
								blockList: this.state.blockList,
								// startGame: this.startGame,
								refreshPage: 	this.refreshPage(),
								setLoading: this.setLoading
							})
						}, 1000)
					}
					console.log("snapshot : ", snapshot.docs[snapshot.docs.length - 1].id);
					this.setState({ referenceToOldestKey: snapshot.docs[snapshot.docs.length - 1].id, loadingFromServer: false });
				});
		}
	}




	usernameSearchData = async () => {
		this.setState({ loadingFromServer: true });
		let searchString = this.state.query;
		firestore().collection('Post')
				.limit(10).where("username", "==", searchString)
				// .orderBy('id', 'desc')
				// .orderBy(firestore.FieldPath.documentId())
				.get()
				.then((snapshot) => {
					
					let items = [];
					for (const doc of snapshot.docs) {
						try {
							const data = doc.data()
							const item = {
								id: doc.id,
								uid: data.uid,
								gameID: data.gameID,
								gameName: data.gameName,
								gameLang: data.gameLang,
								username: data.username,
								myPic: data.profilePics && data.profilePics.length > 0 ? data.profilePics[data.profilePics.length - 1].illustration : data.myPic,
								postlang: data.postlang,
								postmessage: data.postmessage,
								loveList: data.loveList ? data.loveList : [],
								// commentList: data.commentList === undefined ? [] : data.commentList,
								hiddenList: data.hiddenList === undefined ? [] : data.hiddenList,
								postDate: data.postDate,
								isHide: data.isHide,
								isEn: data.isEn,
								imageURL: data.imageURL,
								audioURL: data.audioURL,
								videoURL: data.videoURL,
								audioDuration: data.audioDuration,
								isMore: false,
								isAudioPlaying: false
							}
							items.push(item)


							// items.map((item => {item.username}))
							// this.storeData(this.state.SearchInputValueHolder)
							
						} catch (error) {
							continue
						}
					}
					this.setState({
						items: items,
						// loadingScene: false
					});
					// const reverseItems = items.reverse()
					// const allData = this.postSearchData('All');
					
					// if (allData && allData.length > 0) {
					// 	items.push(...allData);
					// }
					
				});
		} 



	allSearchData = async (key, val) => {
		// alert(val)
		this.setState({items: []})
		let searchString = val ? val : this.state.query;
		this.setState({ searchTag: key });
		if (key == 'postmessage') {
				searchString = '#' + searchString;	
				
		}else if (key === 'All') {
			this.usernameSearchData();
		}
				this.setState({ loadingFromServer: true });
					firestore().collection('Post')
						.limit(10).where(key, '==', searchString)
						.get()
						.then((snapshot) => {			
							let items = [];
							// alert( snapshot.docs);
							for (const doc of snapshot.docs) {
								try {
									const data = doc.data()
								
									const item = {
										id: doc.id,
										uid: data.uid,
										gameID: data.gameID,
										gameName: data.gameName,
										gameLang: data.gameLang,
										username: data.username,
										myPic: data.profilePics && data.profilePics.length > 0 ? data.profilePics[data.profilePics.length - 1].illustration : data.myPic,
										postlang: data.postlang,
										postmessage: data.postmessage,
										loveList: data.loveList ? data.loveList : [],
										// commentList: data.commentList === undefined ? [] : data.commentList,
										hiddenList: data.hiddenList === undefined ? [] : data.hiddenList,
										postDate: data.postDate,
										isHide: data.isHide,
										isEn: data.isEn,
										imageURL: data.imageURL,
										audioURL: data.audioURL,
										videoURL: data.videoURL,
										audioDuration: data.audioDuration,
										isMore: false,
										isAudioPlaying: false
									}		
										items.push(item)						
								} catch (error) {
									continue
								}
							}
							this.storeData(searchString)
							this.setState({
								items: items,
								// loadingScene: false
							});
							const postID = this.props.navigation.getParam('id')
							if (postID) {
								var index = 0
								var postIndex = 0
								for (; index < reverseItems.length; index++) {
									if (postID == reverseItems[index].id) {
										postIndex = index
										break
									}
								}
								setTimeout(() => {
									this.props.navigation.push('ViewPost', {
										rowData: reverseItems[index],
										index: postIndex,
										navigation: this.props.navigation,
										query: this.state.query,
										user: this.props.user,
										onSoundPlay: this.onSoundPlay,
										blockList: this.state.blockList,
										startGame: null,
										refreshPage: this.refreshPage,
										setLoading: this.setLoading
									})
								}, 1000)
							}
							// this.setState({ referenceToOldestKey: snapshot.docs[snapshot.docs.length - 1].id, loadingFromServer: false });
						});
				} 
	

	renderFooter = () => {
		return (
			<View style={styles.footer}>
				{this.state.loadingFromServer ? (
					<ActivityIndicator size='large' color='blue' />
				) : null}
			</View>
		);
	}

	 storeData = async (value) => {
		//  alert( value)
		try {
			if(this.state.searchData.indexOf(value) !== -1){
			  }else{
			
				 this.state.searchData.push(value);
				 let reverseData = ( this.state.searchData).reverse()
				await AsyncStorage.setItem('@storage_Key', JSON.stringify(reverseData))
				// alert(this.state.searchData)
			  }
		
		} catch (e) {
		  // saving error
		}
	  }
	
	   readData = async () => {
		try {	
			const data = await AsyncStorage.getItem('@storage_Key');
			this.setState({ searchTag: 'recentSearch' });
		
		  if (data !== null) {
			 
			
			this.setState({ searchData: JSON.parse(data) });
			
			// alert(this.state.searchData)
			// setAge(data)
		  }
		} catch (e) {
		  alert('Failed to fetch the data from storage')
		}
	  }

	  emptyComponent= () => {
		return(
		<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
		  <Text style={{ paddingLeft: p(10), marginTop: p(15), fontSize: p(16), justifyContent:'center', alignItems: 'center' }}>No Data found</Text>
		</View>);
	  }

	render() {
		var height = getStatusBarHeight();
		return (
			<View style={styles.container}>
				<NavigationEvents
					onDidFocus={payload => {
					
						this.refreshPage()
					}}
				/>
				{
					!this.state.loadingScene ?
						<View style={{ flex: 1 }}>
							<View style={{ height: height+p(40), backgroundColor: '#4faaca', flexDirection: 'row', alignItems: 'center' }}>
								{/* <View style={{ height: p(40), flex: 1, marginLeft: p(12) }}>
									<View style={{ backgroundColor: '#def3f8', borderRadius: p(20), paddingHorizontal: p(20) }}>
										<TextInput
											placeholder={strings('FriendsList.search_for')}
											placeholderTextColor='#a8cbd4'
											underlineColorAndroid="transparent"
											onChangeText={text => {
												this.setState({ query: text })
											}}
											style={{ fontSize: 15, color: '#84BCD5' }}>
										</TextInput>

									</View>

									<View style={{ position: 'absolute', right: p(0), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
										<Icon
											name='search'
											type='font-awesome'
											color='#88b7c3'
										/>
									</View>
								</View> */}
								<View style={ Platform.OS === 'ios'?
									{ height: p(40), flex: 1, flexDirection:'row', marginLeft: p(12) ,  marginTop: p(30),alignSelf: 'center', justifyContent: 'center' }: { height: p(40), flex: 1, marginLeft: p(12) ,  marginTop: p(10),alignSelf: 'center', justifyContent: 'center' }}>
									
									<TouchableOpacity styles={{ alignSelf: 'center', justifyContent: 'center',padding: 30 }}
											onPress={() => {
												if(this.state.query!==''){
													this.textInput.clear()
													this.refreshPage()
												}
													
															}}>
<View style={{ margin:p(10)}}>
										<AntDesign
											name={'left'}
												size={p(22)}
											color={'white'}
											backgroundColor='black'
												/>
												</View>
										</TouchableOpacity>
									
									<TextInput style={{
										paddingLeft: p(18),
										width: '90%',
										height: 40,
										borderRadius: 20,
										fontSize: 15,
										color: '#84BCD5',
										backgroundColor: '#def3f8',
										justifyContent: 'center',
										alignSelf: 'center',
										paddingTop: 0,
										paddingBottom: 0,
									
									}}
									  ref={input => { this.textInput = input }}
										placeholder={strings('FriendsList.search_for')}
										placeholderTextColor='#a8cbd4'
										underlineColorAndroid="transparent"
										autoCapitalize="none"
										onChangeText={text => {
											this.setState({ query: text})
											if(text.length > 2){
												// this.refreshPage()
											
											if(text.startsWith('#')){
										let txtval = text.replace('#','')
					
												 this.allSearchData('postmessage', txtval)
											}else{
												this.allSearchData('postmessage', text)
											}
												
											}else if(text.length == 0){
												this.refreshPage()
											}
										}}
										value={this.state.query}
										onFocus={() => this.readData()}
									/>
									<View style={{ position: 'absolute', right: p(-10), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
										<Icon
											name='search'
											type='font-awesome'
											color='#88b7c3'
											onPress={()=>{
											// this.storeData(this.state.SearchInputValueHolder)
											if(this.state.query !== ''){
												this.allSearchData('username')
											}else{
												alert("Please enter value for search")
											}
											
											}}
		
										/>
									</View>
								</View>

								<TouchableOpacity
									onPress={() => {
										this.props.navigation.navigate("FriendsList");
									}}
									style={Platform.OS === 'ios'?{ marginLeft: p(15), marginRight: 10, marginTop: p(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }
								: { marginLeft: p(15), marginRight: 10, marginTop: p(10), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
									<MaterialCommunityIcons
										name={'comment-processing'}
										size={p(22)}
										color={'#88b7c3'}
									/>
								</TouchableOpacity>
								{/* <TouchableOpacity style={{ marginHorizontal: p(10), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
									<MaterialIcons
										name={'group'}
										size={p(22)}
										color={'#88b7c3'}
									/>
								</TouchableOpacity> */}

							</View>

							<View style={{ width: '100%', height: p(40), marginTop: p(10), marginHorizontal: 15, flexDirection: 'row', backgroundColor: colors.mainBackground}}>
								{/* <TouchableOpacity 	onPress={() => { 
									
									this.allSearchData('All')
									
									}} >
                                <Text style={{ width: p(64), height: p(20), backgroundColor: 'white',  color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>{'ALL'}</Text>
								</TouchableOpacity   > */}

								<TouchableOpacity onPress={() => { 
								if(this.state.query !== ''){
									this.allSearchData('username')
								}else{
									alert("Please enter value for search")
								}
									}} >
                                <Text style={{ width: p(64), height: p(20), backgroundColor: 'white',  color: 'grey', textAlign: 'center', fontSize: 15, textAlignVertical: 'center' }}>{'PEOPLE'}</Text>
								</TouchableOpacity>

								<TouchableOpacity  onPress={() => {
										if(this.state.query !== ''){
											this.allSearchData('postmessage')
										}else{
											alert("Please enter value for search")
										}								
									}} >
                                <Text style={{ width: p(64), height: p(20), backgroundColor: 'white',  color: 'grey', textAlign: 'center', fontSize: 15, textAlignVertical: 'center' }}>{'TAGS'}</Text>
								</TouchableOpacity>
							</View>


							{
								this.state.query =='' && this.state.searchTag == ''? <View style={{ width: '100%', height: p(40), marginTop: p(10) }}>
								<TouchableOpacity onPress={() => {
									const { navigate } = this.props.navigation;
									navigate('NewPost', { onRefresh: this.refreshPage });
								}} style={styles.createPostContainer}>
									<Text style={{ flex: 1, fontSize: p(20), textAlign: 'left', color: '#70adca' }}>{strings('FriendsList.new_post')}</Text>
									<MaterialCommunityIcons name='plus' size={p(18)} color='#70adca' />
								</TouchableOpacity>
							</View> : null
							}
						
						
				
							{/* <View style={styles.MainContainer}> */}
							{ this.state.query =='' && this.state.searchTag == ''  ? 
							<FlatList
								contentContainerStyle={{ paddingBottom: 16 }}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								data={this.state.items}
								keyExtractor={(item, index) => `${index}`}
								renderItem={({ item, index }) => {
									
									return (
										<OnePost
											rowData={item}
											index={index}
											navigation={this.props.navigation}
											query={this.state.query}
											user={this.props.user}
											onSoundPlay={this.onSoundPlay}
											isblockList={false}
											isblockList={this.state.blockList.indexOf(index) !== -1}
											refreshPage={this.refreshPage}
											setLoading={this.setLoading}
											// startGame={this.startGame}
										
											
										/>
									);
								}}
								onEndReached={({ distanceFromEnd }) => {
									if (distanceFromEnd >= 0) {
										this.loadMoreData(false);
									}
								}}
								onEndReachedThreshold={0.2}
								ListFooterComponent={this.renderFooter}
							// scrollEventThrottle={1000}
							/>
							
	: this.state.searchTag=='postmessage' ?
 		<FlatList  
		 contentContainerStyle={{ padding: 16 }}
		 showsVerticalScrollIndicator={false}
		 showsHorizontalScrollIndicator={false}
		 data={this.state.items}
		 ListEmptyComponent={this.emptyComponent}
		 keyExtractor={(item, index) => `${index}`}
				 renderItem={({ item, index }) => {					 
					 return (	  
						<OnePost
						rowData={item}
						index={index}
						navigation={this.props.navigation}
						query={this.state.query}
						user={this.props.user}
						onSoundPlay={this.onSoundPlay}
						isblockList={false}
						isblockList={this.state.blockList.indexOf(index) !== -1}
						refreshPage={this.refreshPage}
						setLoading={this.setLoading}
					/>
						// <View style={{ flexDirection: 'row'}}>
						// 	<Image source={require('../assets/roundimg.png')}  style={{ width: p(40), height: p(40), borderRadius: p(20), margin: p(10)}} />
						// 	<Text  style={{ paddingLeft: p(10), marginTop: p(15), fontSize: p(16) }}>{item.postmessage}</Text>
						// </View> 
					 );
				 }}
				 /> : this.state.searchTag == 'recentSearch' ? <FlatList  
			 contentContainerStyle={{ padding: 16 }}
			 showsVerticalScrollIndicator={false}
			 showsHorizontalScrollIndicator={false}
			 data={this.state.searchData}
			 keyExtractor={(item, id) => `${id}`}
		   	 renderItem={({ item , id}) => {					 
			return (	
				<View style={{ flexDirection: 'column'}}>	
					<TouchableOpacity onPress={() => {
                                                  this.getListViewItem.bind(this, item)
												//    this.textInput.setState(item)
                                                }}>
					<Text  style={{ paddingLeft: p(10), marginTop: p(15), fontSize: p(16) }} onPress={this.getListViewItem.bind(this, item)} >{item}</Text>
				
					</TouchableOpacity>  	
				</View>
				
			);
		}
	} /> 	 :  this.state.searchTag == 'username' &&  <FlatList  
				contentContainerStyle={{ padding: 16 }}
		 showsVerticalScrollIndicator={false}
		 showsHorizontalScrollIndicator={false}
		 data={this.state.items}
		 ListEmptyComponent={this.emptyComponent}
		 keyExtractor={(item, index) => `${index}`}
				 renderItem={({ item, index }) => {					 
					 return (	  
					// 	<OnePost
					// 	rowData={item}
					// 	index={index}
					// 	navigation={this.props.navigation}
					// 	query={this.state.query}
					// 	user={this.props.user}
					// 	onSoundPlay={this.onSoundPlay}
					// 	isblockList={false}
					// 	isblockList={this.state.blockList.indexOf(index) !== -1}
					// 	refreshPage={this.refreshPage}
					// 	setLoading={this.setLoading}
					// />
								<View style={{ flexDirection: 'row'}}>
				 		 <Image source = {{ uri: item.myPic }} style={{ width: p(40), height: p(40), borderRadius: p(20), margin: p(10)}} />
						<Text  style={{ paddingLeft: p(10), marginTop: p(15), fontSize: p(16) }}>{item.username}</Text>
					
			 </View> 
					 );
				 }}
				 />
	}		  
</View> : <Spinner visible={this.state.loadingScene} />
				}
			

			</View>
		);
	}
}

	// 	<View style={{ flexDirection: 'row'}}>
			// 	 		 <Image source = {{ uri: item.myPic }} style={{ width: p(40), height: p(40), borderRadius: p(20), margin: p(10)}} />
			// 			<Text  style={{ paddingLeft: p(10), marginTop: p(15), fontSize: p(16) }}>{item.username}</Text>
					
			//  </View> 

const styles = {
	container: {
		flex: 1
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
	imageView: {
 
		width: '50%',
		height: 50 ,
		margin: 7,
		borderRadius : 7
	 
	},
	MainContainer :{
 
		justifyContent: 'center',
		flex:1,
		margin: 5,
		marginTop: (Platform.OS === 'ios') ? 20 : 0,
	 
	}
};

function mapStateToProps(state) {
	return {
		user: state.user,
		lang: state.lang
	}
}

export default connect(mapStateToProps, { setLang })(PostScreen);
