import React, { Component, useEffect, createRef } from 'react';
import { Text, View, Button, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import ListView from 'deprecated-react-native-listview';
import { CustomHeader } from './common/CustomHeader';
import { p } from './common/normalize'
import { Icon } from 'react-native-elements'
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
			isModalVisible: false,
			text: '',
			blockList: [],
		}
	}

	onRefresh = () => {
		this.setState({ loadingScene: true })
		firestore().collection('Post').get().then(async snap => {
			console.log("post : ", snap);

			// get children as an array
			const items = []
			for (const doc of snap.docs) {
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
						audioDuration: data.audioDuration,
						isMore: false,
						isAudioPlaying: false
					}
					// const commentList = []
					// const userProfileDoc = await firestore().collection('user').doc(data.uid).get()
					// if (userProfileDoc.exists) {
					//     const userProfile = userProfileDoc.data()
					//     item.username = userProfile.username
					//     item.myPic = userProfile.profilePics&&userProfile.profilePics.length>0?userProfile.profilePics[userProfile.profilePics.length-1].illustration:userProfile.myPic
					//     item.notify = userProfile.nitify
					// }
					// const commentSnapshot = await firestore().collection('Post').doc(doc.id).collection('comment').orderBy('time').get()
					// for (const doc of commentSnapshot.docs) {
					//     const commentMessage = doc.data().commentMessage
					//     const userID = doc.data().userID
					//     const userDoc = await firestore().collection('user').doc(userID).get()
					//     const user = userDoc.data()
					//     const playerId = user.notify?user.playerId:''
					//     const logoPic = user.profilePics&&user.profilePics.length>0?user.profilePics[user.profilePics.length-1].illustration:user.myPic
					//     const username = user.username
					//     commentList.push({userID, playerId, commentMessage, logoPic, username, commentid: doc.id})
					// }
					// item.commentList = commentList
					items.push(item)
				} catch (error) {
					continue
				}
			}
			const reverseItems = items.reverse()
			this.setState({
				items: reverseItems,
				loadingScene: false
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
						startGame: null
					})
				}, 1000)

			}
		});
	}

	componentDidMount() {
		this.onRefresh();
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
		const { uid, id, username, myPic, postlang, postmessage, loveList, commentList, hiddenList, postDate, isHide, isEn, imageURL, audioURL, audioDuration } = this.state.items[index];
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

	render() {
		return (
			<View style={styles.container}>

				{
					!this.state.loadingScene ?
						<View style={{ flex: 1 }}>
							<View style={{ height: p(60), backgroundColor: '#4faaca', flexDirection: 'row', alignItems: 'center' }}>
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
								<View style={{ height: p(40), flex:1, marginLeft: p(12), alignSelf:'center', justifyContent: 'center' }}>
									<TextInput style={{
										paddingLeft: p(12),
										width:'100%',
										height: 40,
										borderRadius: 20,
										fontSize: 15,
										color: '#84BCD5',
										backgroundColor: '#def3f8',
										justifyContent: 'center',
										alignSelf:'center',
										paddingTop:0,
										paddingBottom:0
									}}
										placeholder={strings('FriendsList.search_for')}
										placeholderTextColor='#a8cbd4'
										underlineColorAndroid="transparent"
										autoCapitalize="none"
										onChangeText={text => {
											this.setState({ query: text })
										}}
									/>
									<View style={{ position: 'absolute', right: p(0), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
										<Icon
											name='search'
											type='font-awesome'
											color='#88b7c3'
										/>
									</View>
								</View>

								<TouchableOpacity
									onPress={() => {
										this.props.navigation.navigate("FriendsList");
									}}
									style={{ marginLeft: p(15), marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
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
							<View style={{ width: '100%', height: p(40), marginTop: p(10) }}>
								<TouchableOpacity onPress={() => {
									const { navigate } = this.props.navigation;
									navigate('NewPost', { onRefresh: this.onRefresh });
								}} style={styles.createPostContainer}>
									<Text style={{ flex: 1, fontSize: p(20), textAlign: 'left', color: '#70adca' }}>{strings('FriendsList.new_post')}</Text>
									<MaterialCommunityIcons name='plus' size={p(18)} color='#70adca' />
								</TouchableOpacity>
							</View>
							{/* <FlatList
							ref={ref=>this.listRef=ref}
							data={this.state.items}
							style={{flex: 1}}
							renderItem={({item, index})=>
							<OnePost
								rowData={item}
								index={index}
								navigation={this.props.navigation}
								query={this.state.query}
								user={this.props.user}
								onSoundPlay={this.onSoundPlay}
								blockList={this.state.blockList}
								startGame={this.startGame}
							/>
							}
						/> */}
							<ScrollView scrollEnabled={true} style={{ marginTop: 10, flex: 1, marginHorizontal: p(20) }}>
								{
									this.state.items.map((rowData, index) =>
										<OnePost
											rowData={rowData}
											index={index}
											navigation={this.props.navigation}
											query={this.state.query}
											user={this.props.user}
											onSoundPlay={this.onSoundPlay}
											isblockList={this.state.blockList.indexOf(index) !== -1}
											startGame={this.startGame}
										/>
									)
								}
							</ScrollView>

							{/* <Modal isVisible={this.state.isModalVisible}
							onBackdropPress={() => this.setState({ isModalVisible: false })}
							onSwipeComplete={() => this.setState({ isModalVisible: false })}
							swipeDirection="left">
							<View style={{ flex: 1, alignSelf: 'center' }}>
								<Text style={{ color: 'white', fontSize: p(16) }}>Description</Text>
								<TextInput
									style={styles.textArea}
									multiline
									placeholder={'What are you thinking...'}
									onChangeText={(text) => this.setState({ text })}
									value={this.state.text}
								/>
								<View style={{ flexDirection: 'row', marginTop: p(10) }}>
									<View style={{ flex: 1 }} />
									<TouchableOpacity style={styles.modalWrapper} onPress={() => this.onComment(currentIndex)}>
										<Text style={styles.modalBtnText}>Send</Text>
									</TouchableOpacity>

									<TouchableOpacity style={styles.modalWrapper} onPress={() => this.setState({ isModalVisible: false })}>
										<Text style={styles.modalBtnText}>Cancel</Text>
									</TouchableOpacity>
								</View>

							</View>
						</Modal> */}
						</View> : <Spinner visible={this.state.loadingScene} />
				}
			</View>
		);
	}
}

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
	}
};

function mapStateToProps(state) {
	return {
		user: state.user,
		lang: state.lang
	}
}

export default connect(mapStateToProps, { setLang })(PostScreen);
