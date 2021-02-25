import React, { Component } from 'react';
import { Text, View, TextInput, Image, TouchableOpacity, ScrollView, Dimensions, PermissionsAndroid } from 'react-native';
import ModernHeader from './common/ModernHeader';
import { CustomHeader } from './common/CustomHeader';
import { p } from './common/normalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { images } from './common/images';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { connect } from 'react-redux'
// import RNFetchBlob from 'rn-fetch-blob'
import Spinner from "react-native-loading-spinner-overlay";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import SoundPlayer from 'react-native-sound-player'
import axios from 'react-native-axios'
import { colors, viewportWidth } from '../static/constant'
import { strings } from '../locales/i18n'
import Video from 'react-native-video';
import { Dialog } from 'react-native-simple-dialogs'

const audioRecorderPlayer = new AudioRecorderPlayer();
// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob
var isMediaUploaded = false
var monthNames = [
	"Jan", "Feb", "Mar",
	"Apr", "May", "June",
	"July", "Aug", "Sep",
	"Oct", "Nov", "Dec"
];
const deviceWidth = Dimensions.get("window").width;
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
		})
		.catch((error) => {
			console.error(error);
		});
};
var audioURL = ''
var imageURL = ''
var videoURL = ''
// Create instance variable(s) to store your subscriptions in your class
_onFinishedPlayingSubscription = null
_onFinishedLoadingSubscription = null
_onFinishedLoadingFileSubscription = null
_onFinishedLoadingURLSubscription = null

class NewPost extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: < CustomHeader navigation={navigation} />,
			headerStyle: {
				backgroundColor: '#2496BE',
			},
			headerTintColor: '#fff',
		
		};
	}

	constructor(props) {
		super(props);
		this.state = {
			text: '',
			record: false,
			loadingScene: false,
			recordSecs: 0,
			recordTime: '00:00:00',
			imageFile: null,
			videoFile: null,
			imageURL: '',
			gameID: null,
			gameName: null,
			editDialog: { type: null, visible: false }
		}

	}

	componentDidMount() {
		_onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
			console.log('finished playing', success)
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
		const image = this.props.navigation.getParam('image')
		if (image) {
			this.setState({ imageURL: image })
		}
		const gameID = this.props.navigation.getParam('gameID')
		if (gameID) {
			const gameName = this.props.navigation.getParam('gameName')
			const gameLang = this.props.navigation.getParam('gameLang')
			this.setState({ gameID, gameName, gameLang })
			const text = this.props.navigation.getParam('text')
			if (text) {
				this.setState({ text })
			} else {
				this.setState({ text: 'This is one game created by me...' })
			}
		}
	}

	// Remove all the subscriptions when component will unmount
	componentWillUnmount() {
		if (_onFinishedPlayingSubscription) _onFinishedPlayingSubscription.remove()
		if (_onFinishedLoadingSubscription) _onFinishedLoadingSubscription.remove()
		if (_onFinishedLoadingURLSubscription) _onFinishedLoadingURLSubscription.remove()
		if (_onFinishedLoadingFileSubscription) _onFinishedLoadingFileSubscription.remove()

		SoundPlayer?.stop();
		audioURL = '';
		this.setState({ videoURL:'' });
		this.setState({ imageURL:'' });
	}

	uploadFile = (ref, uri, type) => {
		return new Promise((resolve, reject) => {
			const uploadUri = uri;
			const sessionId = Date.now().toString()
			// let uploadBlob = null
			const fileRef = storage().ref(ref).child(this.props.user.uid).child(`${sessionId}` + '.' + type);
			fileRef.putFile(uploadUri).then(() => {
				fileRef.getDownloadURL().then(url => {
					resolve(url)
				})
			}).catch(() => {
				reject(error)
			})
			// fs.readFile(uploadUri, 'base64')
			// 	.then((data) => {
			// 		return Blob.build(data, { type: `${mime};BASE64` })
			// 	})
			// 	.then((blob) => {
			// 		uploadBlob = blob
			// 		return imageRef.put(blob, { contentType: mime })
			// 	})
			// 	.then(() => {
			// 		uploadBlob.close()
			// 		return imageRef.getDownloadURL()
			// 	})
			// 	.then((url) => {
			// 		resolve(url)
			// 	})
			// 	.catch((error) => {
			// 		reject(error)
			// 		this.setState({ loadingScene: false })
		

			// 	})
		})
	}

	takePhoto() {
		ImagePicker.openCamera({
			width: 400,
			height: 300,
			cropping: true,
		}).then(imageFile => {
			this.setState({ imageFile })
			this.setState({ editDialog: { type : null, visible: false } })
			// this.onSaveMedia(image.path);
		});
	}

	takeVideo() {
		ImagePicker.openCamera({
			width: 400,
			height: 300,
			mediaType: 'video',
		}).then(imageFile => {
			this.setState({ imageFile })
			this.setState({ editDialog: { type : "camera", visible: false } })
			// this.onSaveMedia(image.path);
		});
	}

	openGallery() {
		ImagePicker.openPicker({
			width: 400,
			height: 300,
			cropping: true
		}).then(imageFile => {
			this.setState({ imageFile })
			this.setState({ editDialog: { type : "gallery", visible: false } })
			// this.onSaveMedia(image.path);
		});

	}


	selectVideoFromGallery() {
		ImagePicker.openPicker({
			mediaType: "video",
		}).then(videoFile => {
			this.setState({
				videoFile: {
				uri: videoFile.path,
				width: videoFile.width,
				height: videoFile.height,
				mime: videoFile.mime,
			  },
			  images: null,
			});
			this.setState({ editDialog: { type : "gallery", visible: false } })
			
			// this.onSaveMedia(image.path);
		});
	}

	onStartRecord = async () => {
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					{
						title: 'Permissions for write access',
						message: 'Give permission to your storage to write a file',
					},
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					console.log('You can use the storage');
				} else {
					console.log('permission denied');
					return;
				}
			} catch (err) {
				console.warn(err);
				return;
			}
		}
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
					{
						title: 'Permissions for write access',
						message: 'Give permission to your storage to write a file',
					},
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					console.log('You can use audio device');
				} else {
					console.log('permission denied');
					return;
				}
			} catch (err) {
				console.warn(err);
				return;
			}
		}
		this.setState({ record: true })
		const uri = await audioRecorderPlayer.startRecorder();
		audioRecorderPlayer.addRecordBackListener((e) => {
			this.setState({
				recordSecs: e.current_position,
				recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
			});
			return;
		});
	}

	onStopRecord = async () => {
		const result = await audioRecorderPlayer.stopRecorder();
		audioRecorderPlayer.removeRecordBackListener();
		this.setState({
			recordSecs: 0,
			record: false
		});
		const path = Platform.select({
			ios: 'sound.m4a',
			android: 'sdcard/sound.mp4',
		});
		this.onSaveAudio(result)
	}

	onSaveAudio(audioPath) {
		this.setState({ loadingScene: true })
		const ext = Platform.select({
			ios: 'm4a',
			android: 'mp4',
		});
		this.uploadFile('audios', audioPath, ext)
			.then(url => {
				audioURL = url;
				this.setState({ loadingScene: false, });
			})
			.catch(error => console.log(error))
	}

	formatTime(time) {
		if (time.length < 2) time = "0" + time;
		return time;
	}

	onCreatePostData(imageURL) {
		
		let currentDate = new Date();
		let dateTime = this.formatTime(currentDate.getHours()) + ":" + this.formatTime(currentDate.getMinutes()) + " "
			+ this.formatTime(currentDate.getDate()) + "/" + this.formatTime(currentDate.getMonth() + 1) + "/" + this.formatTime(currentDate.getFullYear().toString().substr(-2));
		this.setState({ loadingScene: true })
		let curDateTime = Date.now().toString()
		firestore().collection('Post').doc(curDateTime).set({
			id: curDateTime,
			uid: this.props.user.uid,
			username: this.props.user.username,
			myPic: this.props.profilePics.profilePics.length > 0 ? this.props.profilePics.profilePics[this.props.profilePics.profilePics.length - 1].illustration : this.props.user.myPic,
			postlang: 0, //0 : EN, 1: PT
			postmessage: this.state.text,
			gameID: this.state.gameID,
			gameName: this.state.gameName,
			gameLang: this.state.gameLang,
			loveList: [],
			commentList: [],
			hiddenList: [],
			postDate: dateTime,
			isHide: 1, //0: hide, 1: not hide
			isEn: 1, //1:EN, 0:PT
			imageURL,
			videoURL,
			audioURL,
			audioDuration: this.state.recordTime,
			isFromCreateGame: false
		}).then(async () => {
			if (imageURL) {
				await firestore().collection('user').doc(this.props.user.uid).collection('media').add({
					url: imageURL,
					type: 'post',
					id: curDateTime,
					content: imageURL != null && imageURL.length > 0 ? 'image'
						: audioURL != null && audioURL.length > 0 ? 'audio' : '',
					bookmark: false,
					isFromCreateGame: false,
					time: Date.now()
				});
				this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh()
				this.props.navigation.goBack();
				// this.props.navigation.push('PostScreen');
			} else if(videoURL){
	
				await firestore().collection('user').doc(this.props.user.uid).collection('video').add({	
					url: videoURL,
					type: 'post',
					id: curDateTime,
					content: videoURL,
					bookmark: false,
					isFromCreateGame: false,
					time: Date.now()
				});
				this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh()
				this.props.navigation.goBack();
			} 
			else {
				this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh()
				this.props.navigation.goBack();
			}
		}).catch((error) => {
			//error callback
			console.log('error ', error)
	
			this.setState({ loadingScene: false })
		})
	}


	onCreateVideoPostData(videoURL) {
		let currentDate = new Date();
		let dateTime = this.formatTime(currentDate.getHours()) + ":" + this.formatTime(currentDate.getMinutes()) + " "
			+ this.formatTime(currentDate.getDate()) + "/" + this.formatTime(currentDate.getMonth() + 1) + "/" + this.formatTime(currentDate.getFullYear().toString().substr(-2));
		this.setState({ loadingScene: true })
		let curDateTime = Date.now().toString()
		firestore().collection('Post').doc(curDateTime).set({
			id: curDateTime,
			uid: this.props.user.uid,
			username: this.props.user.username,
			myPic: this.props.profilePics.profilePics.length > 0 ? this.props.profilePics.profilePics[this.props.profilePics.profilePics.length - 1].illustration : this.props.user.myPic,
			postlang: 0, //0 : EN, 1: PT
			postmessage: this.state.text,
			gameID: this.state.gameID,
			gameName: this.state.gameName,
			gameLang: this.state.gameLang,
			loveList: [],
			commentList: [],
			hiddenList: [],
			postDate: dateTime,
			isHide: 1, //0: hide, 1: not hide
			isEn: 1, //1:EN, 0:PT
			imageURL,
			videoURL,
			audioURL,
			audioDuration: this.state.recordTime,
			isFromCreateGame: false
		}).then(async () => {
				 if(videoURL){
	
				await firestore().collection('user').doc(this.props.user.uid).collection('video').add({	
					url: videoURL,
					type: 'post',
					id: curDateTime,
					content: videoURL,
					bookmark: false,
					isFromCreateGame: false,
					time: Date.now()
				});
				this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh()
				this.props.navigation.goBack();
			} 
			else {
				this.props.navigation.state.params.onRefresh && this.props.navigation.state.params.onRefresh()
				this.props.navigation.goBack();
			}
		}).catch((error) => {
			//error callback
			console.log('error ', error)
		
			this.setState({ loadingScene: false })
		})
	}

	onCreatePost() {
		if (this.state.text === '') {
			alert("Please input message!")
			return;
		}
		if (this.state.imageFile) {
			
			this.setState({ loadingScene: true })
			this.uploadFile('media', this.state.imageFile.path, "jpg")
				.then(url => {
					this.setState({ loadingScene: false });
					ImagePicker.clean().then(() => {
					}).catch(e => {
						console.log(e);
					});
					this.onCreatePostData(url)
				})
				.catch(error => {
					console.log(error);
				});
		}else if(this.state.videoFile){
			
			this.setState({ loadingScene: true })
			this.uploadFile('video', this.state.videoFile.uri, "mp4")
				.then(url => {
					this.setState({ loadingScene: false });
					ImagePicker.clean().then(() => {
					}).catch(e => {
						console.log(e);
					});
					this.onCreateVideoPostData(url)
				})
				.catch(error => {
					console.log(error);
				});
		} 
		else {
			this.onCreatePostData(this.state.imageURL)
		}
	}

	onSoundPlay(audioURL) {
		try {
			// or play from url
			SoundPlayer.playUrl(audioURL)
		} catch (e) {
			console.log(`cannot play the sound file`, e)
		}
	}

	pickSingleWithCamera(cropping, mediaType = 'video') {
		ImagePicker.openCamera({
		  cropping: cropping,
		  width: 500,
		  height: 500,
		
		  mediaType,
		})
		  .then((videoFile) => {
			console.log('received video', videoFile);
			this.setState({
				videoFile: {
				uri: videoFile.path,
				width: videoFile.width,
				height: videoFile.height,
				mime: videoFile.mime,
			  },
			  images: null,
			});
			this.setState({ editDialog: { type : "camera", visible: false } })
		  })
		  .catch((e) => console.log(e));
	  }

	  renderVideo(video) {
	
		return (
			// this.state.imageFile ?
		  <View style={{ height: 100, width: 100 }}>
			<Video
			  source={{ uri: 'file://' + video.uri, type: video.mime }}
			  style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
			  rate={1}
			  paused={false}
			  volume={1}
			  muted={false}
			  resizeMode={'cover'}
			  onError={(e) =>console.log(e)}
			  onLoad={(load) => console.log(load)}
			  repeat={true}
			/>
		  </View> 
		//   : this.state.videoURL ?<Video source={{ uri: this.state.videoURL }}  paused={false}
		// 	  volume={1}
		// 	  muted={false}
		// 	  resizeMode={'cover'}  repeat={true}
		// 	   style={{ marginBottom: p(10), width: deviceWidth - 40, height: (deviceWidth - 40) * 3 / 4 }} />
		// : null
		);
	  }
	
	  renderImage(imageFile) {
		return (
		this.state.imageFile ?
		<Image source={{ uri: 'file://' + this.state.imageFile.path }} style={{ marginBottom: p(10), width: deviceWidth - 40, height: (deviceWidth - 40) * 3 / 4 }} />
		: this.state.imageURL ? 
		<Image source={{ uri: this.state.imageURL }} style={{ marginBottom: p(10), width: deviceWidth - 40, height: (deviceWidth - 40) * 3 / 4 }} />
		: null
		);
	  }
	
	  renderAsset(videoFile) {
		if (videoFile.mime && videoFile.mime.toLowerCase().indexOf('video/') !== -1) {
		  return this.renderVideo(videoFile);
		}
	  }

	render() {
		const { record } = this.state
		return (
			<View style={{ flex: 1, backgroundColor: '#E9E9EF' }}>
				<View style={styles.container}>
						{
						!this.state.loadingScene ?
							<ScrollView keyboardShouldPersistTaps={'handled'}>
								<TextInput
									style={[styles.textArea, this.state.gameID && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },]}
									multiline
									placeholder={strings('NewPost.what_think')}
									onChangeText={(text) => this.setState({ text })}
									value={this.state.text}
								/>
								{
									this.state.gameID &&
									<View style={{
										backgroundColor: '#fff',
										borderBottomLeftRadius: p(10),
										borderBottomRightRadius: p(10),
										padding: p(8)
									}}>
										<TouchableOpacity style={{}}>
											<Text style={{ color: colors.blue }}>{this.state.gameName}</Text>
											<Text style={{ color: colors.blue }}>{this.state.gameLang}</Text>
										</TouchableOpacity>
									</View>
								}
								<TouchableOpacity onPress={() => this.onCreatePost()} style={styles.iconSend}>
									<Ionicons
										name='md-send'
										size={p(18)}
										color='white'
									/>
								</TouchableOpacity>
								{
									!record &&
									<View>
										<View style={{ marginTop: p(10), flexDirection: 'row', alignItems: 'center' }}>
											<TouchableOpacity onPress={() => this.setState({ editDialog: { type: 'camera', visible: true } })}>
												<Image source={images.ico_photo} style={styles.icon} />
											</TouchableOpacity>
											<TouchableOpacity onPress={() => { this.onStartRecord() }}>
												<Image source={images.ico_record} style={[styles.icon, { width: p(15) }]} />
											</TouchableOpacity>
											<TouchableOpacity onPress={() => this.setState({ editDialog: { type: 'gallery', visible: true } })}>
												<Image source={images.ico_album} style={[styles.icon, { width: p(26) }]} />
											</TouchableOpacity>
										</View>
										<View style={{ marginTop: p(20) }}>
											{
												audioURL !== '' &&
												<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: p(10), marginBottom: p(10), backgroundColor: '#4bacf1', borderRadius: p(6), padding: p(5) }}>
													<TouchableOpacity onPress={() => { this.onSoundPlay(audioURL) }}>
														<AntDesign
															name='play'
															size={p(20)}
															color='#2b53da'
														/>
													</TouchableOpacity>

													<Text style={{ flex: 1, marginLeft: p(10), color: 'white' }}>{this.state.recordTime}</Text>
												</View>
											}
											{
												  // this.state.imageFile ? this.renderAsset(this.state.imageFile) : null
												this.state.imageFile ?
													<Image source={{ uri: 'file://' + this.state.imageFile.path }} style={{ marginBottom: p(10), width: deviceWidth - 40, height: (deviceWidth - 40) * 3 / 4 }} />
													:
													this.state.imageURL ?
														<Image source={{ uri: this.state.imageURL }} style={{ marginBottom: p(10), width: deviceWidth - 40, height: (deviceWidth - 40) * 3 / 4 }} />
														:
														null
											}
											{
												this.state.videoFile ? this.renderAsset(this.state.videoFile) : null
											}
										</View>
									</View>
								}

								{
									record &&
									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

										<TouchableOpacity onPress={() => { this.onStopRecord() }}>
											<Image source={images.ico_recording} style={[styles.icon, { width: p(15) }]} />
										</TouchableOpacity>

										<View style={styles.time}>
											<Text style={{ color: '#fff', fontSize: p(16) }}>{this.state.recordTime + ""}</Text>
										</View>

										<Image source={images.ico_wave} style={[styles.icon, { width: p(60) }]} />
									</View>
								}
						  <Dialog  visible={this.state.editDialog.visible}
						   
						    >
						{
                	  	this.state.editDialog.type=="gallery" ?
              			  <View style={{ flexDirection: 'column', justifyContent: 'space-around', margin: 10 }}>
						
                		  <TouchableOpacity
						style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue,  margin: 10 }} 
						onPress={() => this.openGallery() } >
                        <Text style={{ color: 'white' }}>{'Select Photos'}</Text>
                    	</TouchableOpacity>
                    	<TouchableOpacity
						style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue,  margin: 10 }}
						onPress={() => this.selectVideoFromGallery()}>
                        <Text style={{ color: 'white' }}>{'Select Videos'}</Text>
                    </TouchableOpacity> 
					<TouchableOpacity
						style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue,   margin: 10 }}
						onPress={() => this.setState({ editDialog: { type : "gallery", visible: false } })}>
                        <Text style={{ color: 'white' }}>{'Cancel'}</Text>
                    </TouchableOpacity>
					</View>: 
 <View style={{ flexDirection: 'column', justifyContent: 'space-around', margin: 10 }}>
					<TouchableOpacity
						style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue,  margin: 10 }} 
						onPress={() => this.takePhoto()} >
                        <Text style={{ color: 'white' }}>{'Take Photos'}</Text>
                    	</TouchableOpacity>
                    	<TouchableOpacity
						style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue,   margin: 10 }}
						onPress={() => this.pickSingleWithCamera(false, (mediaType = 'video'))}>
                        <Text style={{ color: 'white' }}>{'Take Videos'}</Text>
                    </TouchableOpacity>
		
					<TouchableOpacity
						style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue,   margin: 10 }}
						onPress={() => this.setState({ editDialog: { type : "camera", visible: false } })}>
                        <Text style={{ color: 'white' }}>{'Cancel'}</Text>
                    </TouchableOpacity>
				

                </View>
	}
            </Dialog>
							</ScrollView> : <Spinner visible={this.state.loadingScene} />
					}
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		marginTop: p(12),
		marginHorizontal: p(20),
	},
	textArea: {
		backgroundColor: '#fff',
		height: p(300),
		marginTop: p(7),
		fontSize: p(16),
		lineHeight: p(17),
		borderRadius: p(10),
		padding: p(8),
		textAlignVertical: 'top'
	},
	iconSend: {
		width: p(30),
		height: p(30),
		borderRadius: p(15),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2596bf',
		alignSelf: 'flex-end',
		marginTop: p(-45),
		marginRight: p(10)
	},
	icon: {
		marginTop: p(20),
		width: p(25),
		height: p(22),
		marginRight: p(30)
	},
	time: {
		backgroundColor: '#ff8000',
		borderRadius: p(20),
		marginTop: p(20),
		marginHorizontal: p(5),
		paddingHorizontal: p(12)
	}
};

function mapStateToProps(state) {
	return {
		user: state.user,
		friends: state.friends,
		profilePics: state.profilePics
	}
}

export default connect(mapStateToProps, {})(NewPost);
