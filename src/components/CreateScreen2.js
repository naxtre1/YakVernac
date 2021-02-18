import React, {useState, useEffect, useContext, useRef} from 'react'
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    PermissionsAndroid,
    StyleSheet,
} from 'react-native'
import { Slider } from 'react-native-elements'
import Autocomplete from 'react-native-autocomplete-input'
import { Button } from 'react-native-material-ui'
import { strings } from '../locales/i18n'
import * as Progress from 'react-native-progress'
import firestore from '@react-native-firebase/firestore'
import { NavigationContext } from 'react-navigation'
import {useSelector} from 'react-redux'
import Modal from 'react-native-modal'
import ElevatedView from 'react-native-elevated-view'
import LangModal from './LangModal'
import FileUpload from './FileUpload'
import Toast from 'react-native-simple-toast'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/Feather'
import Spinner from "react-native-loading-spinner-overlay"
import ViewShot from "react-native-view-shot"
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import SoundPlayer from 'react-native-sound-player'
import AwesomeAlert from 'react-native-awesome-alerts'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import storage from '@react-native-firebase/storage'
import { Fumi } from 'react-native-textinput-effects'

import { styles, colors, viewportWidth, maxCards } from '../static/constant'
import useInterval from './useInterval'

const audioRecorderPlayer = new AudioRecorderPlayer()
const sliderWidth = viewportWidth-20
const itemWidth = sliderWidth*0.5
const modalWidth = sliderWidth*0.8

export default function CreateScreen() {
    const navigation = useContext(NavigationContext)
    const [openModalForLearnLanguage, setOpenModalForLearnLanguage] = useState(false)
    const [openModalForLessonLanguage, setOpenModalForLessonLanguage] = useState(false)
    const user = useSelector(state=>state.user)
    const lang = useSelector(state=>state.lang)
    const friends = useSelector(state=>state.friends)
    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(false)
    const [friendModalVisible, setFriendModalVisible] = useState(false)
    const [friendNick, setFriendNick] = useState('')
    const [invited, setInvited] = useState(null)
    const [hideResults, setHideResults] = useState(false)
    const [activeCard, setActiveCard] = useState(0)
    const [gameEditable, setGameEditable] = useState(false)

    const [lessonLanguage, setLessonLanguage] = useState(lang.languageNative)
    const [teachingLanguage, setTeachingLanguage] = useState(lang.languageLearning)
    const [uploadImage, setUploadImage] = useState(null)
    const [uploadImage1, setUploadImage1] = useState(null)
    const [uploadImage2, setUploadImage2] = useState(null)
    const [uploadImage3, setUploadImage3] = useState(null)
    const [gameName, setGameName] = useState(null)
    const [gameImageUrl, setGameImageUrl] = useState(null)
    const [yourmessage, setYourmessage] = useState('')
    const [youranswer, setYouranswer] = useState('')
    const [lessonTypes, setLessonTypes] = useState([])
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(0)
    const [cardItems, setCardItems] = useState({data:[null]})
    const [gameID, setGameID] = useState(null)

    const [gameLang, setGameLang] = useState(`${lessonLanguage} > ${teachingLanguage}`)
    const cardSlider = useRef()
    const [gamePreviewModalVisible, setGamePreviewModalVisible] = useState(false)
    const [cardVisible, setCardVisible] = useState({visible: false, item: null})
    const [removeModalVisible, setRemoveModalVisible] = useState({visible: false, item: null})
    const viewShotIntroductions = useRef()
    const viewShotSaytheimage = useRef()
    const viewShotTexttotext = useRef()
    const viewShotChoosetheimage = useRef()
    const viewShotListenthenwrite = useRef()
    const viewShotWritethisimage = useRef()
    const [recording, setRecording] = useState(false)
    const [textRecording, setTextRecording] = useState(true)
    const [playing, setPlaying] = useState(false)
    const [audioFile, setAudioFile] = useState(null)
   
    useEffect(()=>{
        setGameLang(`${lessonLanguage} > ${teachingLanguage}`)
    }, [lessonLanguage, teachingLanguage])

    useEffect(()=>{
        setLoading(true)
        firestore().collection('creategames').orderBy('order').get().then(snapshot=>{
            const lessonTypes = []
            for (const doc of snapshot.docs) {
                const game = doc.data()
                lessonTypes.push({
                    label: strings(game.title),
                    value: game.title,
                    type: game.name
                })
            }
            setLessonTypes(lessonTypes)
            firestore().collection('user').doc(user.uid).collection('games').where('status', '==', 'edit').get().then(snapshot=>{
                if (snapshot.docs.length > 0) {
                    const game = snapshot.docs[0].data()
                    const gameID = snapshot.docs[0].id
                    setGameID(gameID)
                    setLessonLanguage(game.lessonLanguage)
                    setTeachingLanguage(game.teachingLanguage)
                    setGameImageUrl(game.image)
                    setYourmessage(game.yourmessage)
                    setGameName(game.gameName)
                    firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').orderBy('order').get().then(snapshot=>{
                        const cards = []
                        for (const doc of snapshot.docs) {
                            const card = doc.data()
                            card.id = doc.id
                            cards.push(card)
                        }
                        cards.push(null)
                        setCardItems({data: cards})
                    })
                }
                setLoading(false)

            })
        })
		const _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            setPlaying(false)
		})
		const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
		})
		const _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
		})
		const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
			SoundPlayer.play()
        })
        const intervalID = setInterval(()=>{
            setTextRecording(textRecording=>!textRecording)
        }, 2000)
        return () => {
            _onFinishedPlayingSubscription.remove()
            _onFinishedLoadingSubscription.remove()
            _onFinishedLoadingFileSubscription.remove()
            _onFinishedLoadingURLSubscription.remove()
            clearInterval(intervalID)
        }
    }, [])

    const changeLessonLang = lang => {
        setLessonLanguage(lang)
        setOpenModalForLessonLanguage(false)
    }

    const changeTeachingLang = lang => {
        setTeachingLanguage(lang)
        setOpenModalForLearnLanguage(false)
    }
    const storageUpload = (ref, path) => {
        if (path) {
            const re = /(?:\.([^.]+))?$/
            const extension = re.exec(path)[1]
            const childPath = user.uid+`/${Date.now().toString()}.`+extension
            const storageRef = storage().ref(ref).child(childPath)
            return new Promise((resolve, reject) => {
                storageRef.putFile(path).then(() => {
                    storageRef.getDownloadURL().then(url=>{
                        firestore().collection('user').doc(user.uid).collection('media').add({
                            url,
                            type: 'lesson',
                            content: 'image',
                            lang: teachingLanguage,
                            bookmark: false,
                            time: Date.now()
                        }).then(()=>{
                            resolve(url)
                        })
                    })
                }).catch(error=>{
                    reject(error)
                })
            
            })
        
        }
        return new Promise((resolve, reject)=>{
            resolve('')
        })
    
    }
    
    const handleGo = () => {
        if (!gameName) {
            Toast.show('Please write your game name!')
            return
        }
        if (uploadImage == null && gameImageUrl == null) {
            Toast.show('Please upload a topic image!')
            return
        }
        if (gameID && gameImageUrl) {
            // firestore().collection('user').doc(user.uid).collection('games').where('gameName', '==', gameName).get().then(snapshot=>{
            //     if (snapshot.docs.length > 1) {
            //         Toast.show('The same name exist!')
            //         return
            //     }
                setLoading(true)
                firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({
                    image: gameImageUrl,
                    gameName,
                    lessonLanguage,
                    teachingLanguage,
                }).then(()=>{
                    setLoading(false)
                    setStart(true)
                    setGameEditable(true)
                })
            // })
            return

        }

        // firestore().collection('user').doc(user.uid).collection('games').where('gameName', '==', gameName).get().then(snapshot=>{
        //     if (snapshot.docs.length > 0) {
        //         Toast.show('The same name exist!')
        //         return
        //     }
            setLoading(true)
            storageUpload('media', uploadImage).then(url=>{
                setGameImageUrl(url)
                if (gameID) {
                    firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({
                        image: url,
                        gameName,
                        lessonLanguage,
                        teachingLanguage,
                        status: 'edit'
                    }).then(()=>{
                        setLoading(false)
                        setStart(true)
                    })
                    return
        
                }
                firestore().collection('user').doc(user.uid).collection('games').add({
                    image: url,
                    gameName,
                    lessonLanguage,
                    teachingLanguage,
                    status: 'edit'
                }).then(doc=>{
                    setLoading(false)
                    setGameID(doc.id)
                    setStart(true)
                })
    
            })
    
        // })
        return
    }

    const handleCreateCard = (item) => {
        if (item) {
            for (var i=0;i<lessonTypes.length;i++) {
                if (lessonTypes[i].type == item.type) {
                    setSelectedTypeIndex(i)
                    setUploadImage(item.image)
                    setYourmessage(item.yourmessage)
                    setYouranswer(item.youranswer)
                    if (item.type == 'choosetheimage') {
                        setUploadImage1(item.image1)
                        setUploadImage2(item.image2)
                        setUploadImage3(item.image3)
                    }
                    if (item.type == 'saytheimage' || item.type == 'listenthenwrite') {
                        setAudioFile(item.audio)
                    }
                    break
                }
            }
        } else {
            setUploadImage(null)
            setUploadImage1(null)
            setUploadImage2(null)
            setUploadImage3(null)
            setYourmessage('')
            setYouranswer('')
            setAudioFile(null)
        }
        setCardVisible({visible:true, item})
        // setRemoveModalVisible(true)
    }

	const startRecord = async () => {
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
				} else {
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
				} else {
					return;
				}
			} catch (err) {
				console.warn(err);
				return;
			}
		}
        setRecording(true)
        const uri = await audioRecorderPlayer.startRecorder();
        setAudioFile(uri)
		audioRecorderPlayer.addRecordBackListener((e) => {
			// this.setState({
			// 	recordSecs: e.current_position,
			// 	recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
			// });
			return;
		});
	}

	const stopRecord = async () => {
		const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecording(false)
		// this.setState({
		// 	recordSecs: 0,
		// 	record: false
		// });
    }
    
    const renderCard = ({ item, index }) => {
        if (item == null) {
            // if (cardItems.data.length > maxCards) {
            //     return null
            // } 
            if (gameEditable) {
                return (
                    <Icon
                        name='plus'
                        color='white'
                        style={{backgroundColor: colors.green, alignSelf: 'center'}}
                        size={itemWidth-20}
                        onPress={()=>handleCreateCard(item)}
                    />
                )
            }
            return null
        }
        const innerCard = item => {
            switch(item.type)  {
                case 'introductions':
                    return (
                        <View style={{margin: 20, flex: 1}}>
                            {/* <Image source={{uri: gameImageUrl}} style={{...StyleSheet.absoluteFillObject, margin: 10, resizeMode: 'cover'}} /> */}
                            {/* <Text style={{position: 'absolute', alignSelf: 'center', top: '40%', fontWeight: 'bold'}}>{gameName}</Text> */}
                            <Text style={{ alignSelf: 'center', textAlignVertical: 'top', backgroundColor: colors.grey, padding: 10, flex: 1}}>{item.yourmessage.length<50?item.yourmessage:item.yourmessage.substring(0, 50)+'...'}</Text>
                        </View>
                    )
                case 'saytheimage':
                    return (
                    <>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={{uri: item.image}} style={{width: '100%', height: (itemWidth/3)*2, padding: 30, resizeMode: 'contain'}} />
                        </View>
                        <View style={{marginLeft: 20, marginRight: 30, marginBottom: 10}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                <Icon
                                    name='mic'
                                    size={25}
                                    color={'grey'}
                                />
                                <Text style={{marginLeft: 10}}>{strings('Create.presstorecord')}</Text>
                            </View>
                            <View style={{height: 10}}/>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                <Icon
                                    name='play'
                                    size={25}
                                    color={'grey'}
                                />
                                <Text style={{marginLeft: 10}}>{strings('Create.listentorecord')}</Text>

                            </View>
                        </View>
                    </>
                    )
                case 'texttotext':
                    return (
                        <View style={{margin: 30}}>
                            <TextInput
                                editable={false}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                placeholder={strings('Create.writeyourmessagehere')}
                                multiline={true}
                                numberOfLines={6}
                                placeholderTextColor={colors.blue}
                                style={{textAlignVertical: 'top', backgroundColor: colors.grey, color: 'black'}}
                                value={item.yourmessage.length<50?item.yourmessage:item.yourmessage.substring(0, 50)+'...'}
                            />
                            <TextInput
                                editable={false}
                                placeholder={strings('Create.writeyouranswerhere')}
                                placeholderTextColor={colors.blue}
                                style={{textAlignVertical: 'bottom', borderBottomWidth: 1}}
                                value={item.youranswer.length<10?item.youranswer:item.youranswer.substring(0, 10)+'...'}
                            />
                        </View>

                    )
            case 'choosetheimage':
                return (
                    <View style={{margin: 10, flex: 1}}>
                        <TextInput
                            editable={false}
                            placeholder={strings('Create.choosewriteyourwordhere')}
                            placeholderTextColor={colors.blue}
                            style={{borderBottomWidth: 1, textAlignVertical: 'bottom'}}
                            value={item.yourmessage.length<10?item.yourmessage:item.yourmessage.substring(0, 10)+'...'}
                        />
                        <View style={{flex: 1, justifyContent: 'space-around'}}>
                            <View style={{flexDirection: 'row', margin: 5, justifyContent: 'space-around'}}>
                                <Image source={{uri: item.image}} style={{width: itemWidth/3, height: itemWidth/3, resizeMode: 'cover', borderWidth: 2, borderColor: colors.green}}/>
                                <Image source={{uri: item.image1}} style={{width: itemWidth/3, height: itemWidth/3, resizeMode: 'cover'}}/>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                <Image source={{uri: item.image2}} style={{width: itemWidth/3, height: itemWidth/3, resizeMode: 'cover'}}/>
                                <Image source={{uri: item.image3}} style={{width: itemWidth/3, height: itemWidth/3, resizeMode: 'cover'}}/>
                            </View>
                        </View>
                    </View>
                )
            case 'listenthenwrite':
                return (
                    <View style={{margin: 20, justifyContent: 'space-between', flex: 1}}>
                        <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Icon
                                name='mic'
                                size={25}
                                color={'grey'}
                            />
                            <Text style={{marginLeft: 10}}>{strings('Create.presstorecord')}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Icon
                                name='play'
                                size={25}
                                color={'grey'}
                            />
                            <Text style={{marginLeft: 10}}>{strings('Create.listentorecord')}</Text>
                        </View>
                        <TextInput
                            editable={false}
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'bottom', borderBottomWidth: 1}}
                            value={item.youranswer.length<10?item.youranswer:item.youranswer.substring(0, 10)+'...'}
                        />
                    </View>
                )
            case 'writethisimage':
                return (
                    <View style={{margin: 30}}>
                        <View style={{alignItems: 'center', marginTop: 10}}>
                            <Image source={{uri: item.image}} style={{width: itemWidth/2, height: itemWidth/2, resizeMode: 'cover'}}/>
                        </View>
                        <TextInput
                            editable={false}
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'bottom', borderBottomWidth: 1}}
                            value={item.youranswer.length<10?item.youranswer:item.youranswer.substring(0, 10)+'...'}
                        />
                    </View>
                )

            default:
                return (
                    <View></View>
                )
            }
        }
        return (
            <TouchableOpacity
                style={{width: itemWidth, height: (itemWidth/3)*4, backgroundColor: 'white'}}
                onPress={()=>handleCreateCard(item)}
            >
                <View style={{flex: 1}}>
                    <Text style={{alignSelf: 'center', marginTop: 10}}>{strings(item.title)}</Text>
                    <View style={{flex: 1}}>
                        {innerCard(item)}
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const addLesson = (lesson) => {
        return new Promise((resolve, reject)=>{
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').add(lesson).then(doc=>{
                const cardID = doc.id
                lesson['id'] = cardID
                const cards = cardItems.data
                cards.pop()
                cards.push(lesson)
                cards.push(null)
                setCardItems({data: cards})
                resolve(cards)
            }).catch(error=>{
                reject(error)
            })
        })
    }

    const updateLesson = (item) => {
        return new Promise((resolve, reject)=>{
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).update(item).then(doc=>{
                const cards = cardItems.data
                setCardItems({data: cards})
                resolve(cards)
            })
            return  
        })
    }

    const handleIntroductions = () => {
        if (yourmessage) {
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({yourmessage}).then(()=>{
                for (const item of cardItems.data) {
                    if (item && item.type == 'introductions') {
                        item.yourmessage = yourmessage
                        setCardVisible({visible:false, item: null})
                        firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).update(item).then(()=>{
                            setLoading(false)
                            setCardItems({data:cardItems.data})
                        })
                        return
                    }
                }
                setCardVisible({visible:false, item: null})
                const lesson = {
                    type: 'introductions',
                    title: 'Create.introductions',
                    yourmessage,
                    order: Date.now()
                }
                addLesson(lesson, viewShotIntroductions)
                return
            })    
            return
        }
        Toast.show('Please write your message!')
    }

    const handleSaytheimage = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({visible:false, item: null})
            setLoading(true)
            var newImage = uploadImage
            if (newImage === item.image) {
                newImage = ''
            }
            storageUpload('media', newImage).then(image=>{
                if (image) {
                    item.image = image
                }
                var newAudio = audioFile
                if (newAudio === item.audio) {
                    newAudio = ''
                }
                storageUpload('audios', newAudio).then(audio=>{
                    if (audio) {
                        item.audio = audio
                    }
                    updateLesson(item).then(()=>{
                        setLoading(false)
                    })
                })
            })
            return
        }
        if (uploadImage && audioFile) {
            setLoading(true)
            setCardVisible({visible:false, item: null})
            storageUpload('media', uploadImage).then(image=>{
                const lesson = {
                    type: 'saytheimage',
                    title: 'Create.saytheimage',
                    image,
                    order: Date.now()
                }
                storageUpload('audios', audioFile).then(audio=>{
                    lesson['audio'] = audio
                    addLesson(lesson, viewShotSaytheimage).then(()=>{
                        setLoading(false)
                    })
                })
            })
            return
        }
        Toast.show('Please record your voice and select one image file!')
        return
    }

    const handleTexttotext = () => {
        if (yourmessage && youranswer) {
            if (cardVisible.item) {
                const item = cardVisible.item
                item.yourmessage = yourmessage
                item.youranswer = youranswer
                setLoading(true)
                setCardVisible({visible:false, item: null})
                updateLesson(item).then(()=>{
                    setLoading(false)
                })
                return
            }
            const lesson = {
                type: 'texttotext',
                title: 'Create.texttotext',
                yourmessage,
                youranswer,
                order: Date.now()
            }
            setLoading(true)
            setCardVisible({visible:false, item: null})
            addLesson(lesson, viewShotTexttotext).then(()=>{
                setLoading(false)
            })
            return
        }
        Toast.show('Please write your message!')
        return
    }

    const handleChoosetheimage = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({visible:false, item: null})
            setLoading(true)
            var newImage = uploadImage
            if (newImage === item.image) {
                newImage = ''
            }
            storageUpload('media', newImage).then(image=>{
                if (image) {
                    item.image = image
                }
                newImage = uploadImage1
                if (newImage === item.image1) {
                    newImage = ''
                }
                storageUpload('media', newImage).then(image=>{
                    if (image) {
                        item.image1 = image
                    }
                    newImage = uploadImage2
                    if (newImage === item.image2) {
                        newImage = ''
                    }
                    storageUpload('media', newImage).then(image=>{
                        if (image) {
                            item.image2 = image
                        }
                        newImage = uploadImage3
                        if (newImage === item.image3) {
                            newImage = ''
                        }
                        storageUpload('media', newImage).then(image=>{
                            if (image) {
                                item.image3 = image
                            }
                            item.yourmessage = yourmessage
                        })
                        updateLesson(item).then(()=>{
                            setLoading(false)
                        })
                                                
                    })
                        
                })
                    
            })
            return
        }
        if (yourmessage && uploadImage && uploadImage1 && uploadImage2 && uploadImage3) {
            setCardVisible({visible:false, item: null})
            setLoading(true)
            const lesson = {
                type: 'choosetheimage',
                title: 'Create.choosetheimage',
                yourmessage,
                order: Date.now()
            }
            storageUpload('media', uploadImage).then(image=>{
                lesson['image'] = image
                storageUpload('media', uploadImage1).then(image=>{
                    lesson['image1'] = image
                    storageUpload('media', uploadImage2).then(image=>{
                        lesson['image2'] = image
                        storageUpload('media', uploadImage3).then(image=>{
                            lesson['image3'] = image
                            addLesson(lesson, viewShotChoosetheimage).then(()=>{
                                setLoading(false)
                            })
                        })
                    })
                })
            })
            return
        }
        Toast.show('Please selecte 4 images!')
        return
    }

    const handleListenthenwrite = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({visible:false, item: null})
            setLoading(true)
            var newAudio = audioFile
            if (newAudio === item.audio) {
                newAudio = ''
            }
            storageUpload('audios', newAudio).then(audio=>{
                if (audio) {
                    item.audio = audio
                }
                item.youranswer = youranswer
                updateLesson(item).then(()=>{
                    setLoading(false)
                })
            })
            return
        }
        if (youranswer && audioFile) {
            setCardVisible({visible:false, item: null})
            const lesson = {
                type: 'listenthenwrite',
                title: 'Create.listenthenwrite',
                youranswer,
                order: Date.now()
            }
            setLoading(true)
            storageUpload('audios', audioFile).then(audio=>{
                lesson['audio'] = audio
                addLesson(lesson, viewShotListenthenwrite).then(()=>{
                    setLoading(false)
                })
            })
            return
        }
        Toast.show('Please record your voice and write your right answer!')
        return
    }

    const handleWritethisimage = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({visible:false, item: null})
            setLoading(true)
            var newImage = uploadImage
            if (newImage === item.image) {
                newImage = ''
            }
            storageUpload('media', newImage).then(image=>{
                if (image) {
                    item.image = image
                }
                item.youranswer = youranswer
                updateLesson(item).then(()=>{
                    setLoading(false)
                })
            })
            return
        }
        if (youranswer && uploadImage) {
            setCardVisible({visible:false, item: null})
            const lesson = {
                type: 'writethisimage',
                title: 'Create.writethisimage',
                youranswer,
                order: Date.now()
            }
            setLoading(true)
            storageUpload('media', uploadImage).then(image=>{
                lesson['image'] = image
                addLesson(lesson, viewShotWritethisimage).then(()=>{
                    setLoading(false)
                })
            })
            return
        }
        Toast.show('Please select a image and write your right answer!')
        return
    }

    const renderCardModal = () => {
        if (lessonTypes.length == 0) {
            return null
        }
        const lessonType = lessonTypes[selectedTypeIndex]
        switch (lessonType.type) {
            case 'introductions': {
                return (
                    <View style={{margin: 20, flex: 1, justifyContent: 'space-around'}}>
                        <TextInput
                            placeholder={strings('Create.writeyourmessagehere')}
                            multiline={true}
                            numberOfLines={6}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'top', backgroundColor: colors.grey}}
                            value={yourmessage}
                            onChangeText={txt=>setYourmessage(txt)}
                        />
                        <TouchableOpacity style={styles.greenButton}
                            onPress={handleIntroductions}
                        >
                            <Text style={{color: 'white'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            case 'saytheimage':
                return (
                    <View style={{margin: 20, flex: 1, justifyContent: 'space-around'}}>
                        {/* <ViewShot style={{margin: 20}} ref={viewShotSaytheimage}> */}
                        <View style={{alignItems: 'center'}}>
                            <FileUpload
                                size={modalWidth*0.6}
                                padding={modalWidth/10}
                                title='Upload a image'
                                titleColor={colors.blue}
                                getPath={setUploadImage}
                                backgroundColor='lightgrey'
                                imageUrl={uploadImage}
                            />
                        </View>
                        <View style={{marginLeft: 50, marginRight: 30, marginTop: 20, marginBottom: 10}}>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}
                                onPress={()=>{
                                    if (playing) {
                                        return
                                    }
                                    if (recording) {
                                        stopRecord()
                                    } else {
                                        startRecord()
                                    }
                                }}
                            
                            >
                                <Icon
                                    name='mic'
                                    size={25}
                                    color={recording?'red':'grey'}
                                />
                                <Text style={{marginLeft: 10}}>{recording?textRecording?'Recording...':'Press to stop':strings('Create.presstorecord')}</Text>
                            </TouchableOpacity>
                            <View style={{height: 10}}/>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}
                                onPress={async ()=>{
                                    if (recording) {
                                        return
                                    }
                                    if (playing) {
                                        await audioRecorderPlayer.stopPlayer()
                                        setPlaying(false)
    
                                    } else {
                                        if (audioFile) {
                                            if (audioFile.substring(0, 4) == 'http') {
                                                SoundPlayer.playUrl(audioFile)
                                            } else {
                                                await audioRecorderPlayer.startPlayer()
                                                audioRecorderPlayer.addPlayBackListener(e=>{
                                                    if (e.current_position === e.duration) {
                                                        audioRecorderPlayer.stopPlayer()
                                                        setPlaying(false)
                                                    }
                                                })
                                            }
                                            setPlaying(true)
                                        }
                                    }
                                }}
                            >
                                <Icon
                                    name='play'
                                    size={25}
                                    color={playing?'red':'grey'}
                                />
                                <Text style={{marginLeft: 10}}>{playing?'Playing...':strings('Create.listentorecord')}</Text>

                            </TouchableOpacity>
                        </View>
                        {/* </ViewShot> */}
                        <TouchableOpacity style={styles.greenButton}
                            onPress={handleSaytheimage}
                        >
                            <Text style={{color: 'white'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'texttotext':
                return (
                    <View style={{margin: 20, flex: 1, justifyContent: 'space-around'}}>
                        <TextInput
                            placeholder={strings('Create.writeyourmessagehere')}
                            multiline={true}
                            numberOfLines={6}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'top', backgroundColor: colors.grey}}
                            value={yourmessage}
                            onChangeText={txt=>setYourmessage(txt)}
                        />
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'bottom', borderBottomWidth: 1}}
                            value={youranswer}
                            onChangeText={txt=>setYouranswer(txt)}
                        />
                        <TouchableOpacity style={styles.greenButton}
                            onPress={handleTexttotext}
                        >
                            <Text style={{color: 'white'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'choosetheimage': {
                const fuSize = modalWidth*0.8/2-30
                const padding = 5
                return (
                    <View style={{margin: 20, flex: 1, justifyContent: 'space-around'}}>
                        <TextInput
                            placeholder={strings('Create.choosewriteyourwordhere')}
                            placeholderTextColor={colors.blue}
                            style={{borderBottomWidth: 1, textAlignVertical: 'bottom', padding: 0}}
                            value={yourmessage}
                            onChangeText={txt=>setYourmessage(txt)}
                        />
                            <View style={{flexDirection: 'row', margin: 5, justifyContent: 'center'}}>
                                <View style={styles.subcomponent}>
                                    <FileUpload
                                        size={fuSize}
                                        padding={padding}
                                        title='Correct'
                                        titleColor='white'
                                        color='white'
                                        backgroundColor={colors.green}
                                        getPath={setUploadImage}
                                        imageUrl={uploadImage}
                                        />

                                </View>
                                <View style={styles.subcomponent}>
                                    <FileUpload
                                        size={fuSize}
                                        padding={padding}
                                        titleColor={colors.blue}
                                        getPath={setUploadImage1}
                                        backgroundColor='lightgrey'
                                        imageUrl={uploadImage1}
                                        />
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', margin: 5, justifyContent: 'center'}}>
                                <View style={[styles.subcomponent]}>

                                <FileUpload
                                    size={fuSize}
                                    padding={padding}
                                    titleColor={colors.blue}
                                    getPath={setUploadImage2}
                                    backgroundColor='lightgrey'
                                    imageUrl={uploadImage2}
                                    />
                                </View>
                                <View style={styles.subcomponent}>
                                <FileUpload
                                    size={fuSize}
                                    padding={padding}
                                    titleColor={colors.blue}
                                    getPath={setUploadImage3}
                                    backgroundColor='lightgrey'
                                    imageUrl={uploadImage3}
                                    />
                                </View>
                            </View>
                        <TouchableOpacity style={styles.greenButton}
                            onPress={handleChoosetheimage}
                        >
                            <Text style={{color: 'white'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            case 'listenthenwrite':
                return (
                    <View style={{margin: 20, flex: 1, justifyContent: 'space-around'}}>
                        {/* <ViewShot style={{margin: 20}} ref={viewShotListenthenwrite}> */}
                        <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}
                            onPress={()=>{
                                if (playing) {
                                    return
                                }
                                if (recording) {
                                    stopRecord()
                                } else {
                                    startRecord()
                                }
                            }}
                        >
                            <Icon
                                name='mic'
                                size={25}
                                color={recording?'red':'grey'}
                            />
                            <Text style={{marginLeft: 10}}>{recording?textRecording?'Recording...':'Press to stop':strings('Create.presstorecord')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}
                            onPress={async ()=>{
                                if (recording) {
                                    return
                                }
                                if (playing) {
                                    await audioRecorderPlayer.stopPlayer()
                                    setPlaying(false)

                                } else {
                                    if (audioFile) {
                                        if (audioFile.substring(0, 4) == 'http') {
                                            SoundPlayer.playUrl(audioFile)
                                        } else {
                                            await audioRecorderPlayer.startPlayer()
                                            audioRecorderPlayer.addPlayBackListener(e=>{
                                                if (e.current_position === e.duration) {
                                                    audioRecorderPlayer.stopPlayer()
                                                    setPlaying(false)
                                                }
                                            })
                                        }
                                        setPlaying(true)
                                    }
                                }
                            }}
                        >
                            <Icon
                                name='play'
                                size={25}
                                color={playing?'red':'grey'}
                            />
                            <Text style={{marginLeft: 10}}>{playing?'Playing...':strings('Create.listentorecord')}</Text>
                        </TouchableOpacity>
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'bottom', borderBottomWidth: 1}}
                            value={youranswer}
                            onChangeText={txt=>setYouranswer(txt)}
                        />
                        {/* </ViewShot> */}
                        <TouchableOpacity style={styles.greenButton}
                            onPress={handleListenthenwrite}
                        >
                            <Text style={{color: 'white'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'writethisimage':
                return (
                    <View style={{margin: 20, flex: 1, justifyContent: 'space-around'}}>
                        {/* <ViewShot style={{margin: 20}} ref={viewShotWritethisimage}> */}
                        <View style={{alignItems: 'center'}}>
                            <FileUpload
                                size={modalWidth*0.6}
                                padding={modalWidth/10}
                                title='Upload a image'
                                titleColor={colors.blue}
                                getPath={setUploadImage}
                                backgroundColor='lightgrey'
                                imageUrl={uploadImage}
                            />
                        </View>
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'bottom', borderBottomWidth: 1}}
                            value={youranswer}
                            onChangeText={txt=>setYouranswer(txt)}
                        />
                        {/* </ViewShot> */}
                        <TouchableOpacity style={styles.greenButton}
                            onPress={handleWritethisimage}
                        >
                            <Text style={{color: 'white'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                )
                
            default:
                return null
        
        }
    }
    const pager = () => {
        if (start == false) {
            return (
                <View>
                    <Text style={styles.subcomponent}>{strings('Create.lesson_language')}</Text>
                    <TouchableOpacity style={styles.outlineButton}
                        onPress={()=>setOpenModalForLessonLanguage(true)}>
                        <Text>{lessonLanguage}</Text>
                    </TouchableOpacity>
                    <Text style={styles.subcomponent}>{strings('Create.teaching')}</Text>
                    <TouchableOpacity style={styles.outlineButton}
                        onPress={()=>setOpenModalForLearnLanguage(true)}>
                        <Text>{teachingLanguage}</Text>
                    </TouchableOpacity>
    
                    <View style={styles.divider}/>
                    <View style={styles.topic}>
                        <TextInput
                            placeholder='Write your game name'
                            placeholderTextColor={colors.blue}
                            style={{textAlignVertical: 'bottom', borderBottomWidth: 1, marginBottom: 10}}
                            value={gameName}
                            onChangeText={txt=>setGameName(txt)}
                        />
                        <Text style={styles.gameLang}>{gameLang}</Text>
                        <FileUpload
                            size={viewportWidth*0.6}
                            padding={viewportWidth/10}
                            title='Upload a topic image'
                            titleColor={colors.blue}
                            getPath={(image)=>{
                                setGameImageUrl(null)
                                setUploadImage(image)
                            }}
                            backgroundColor='lightgrey'
                            imageUrl={gameImageUrl}
                            />

                    </View>
                    <TouchableOpacity
                        style={styles.blueButton}
                        onPress={handleGo}>
                        <Text style={styles.blueBtnTitle}>Let's go</Text>
                    </TouchableOpacity>
                </View>
            )

        }
        const handleRadioBtn = (i) => {
            if (cardItems.data.length > 0) {
                cardSlider.current.snapToItem(cardItems.data.length-1)
            }
            setActiveCard(cardItems.data.length-1)
            setSelectedTypeIndex(i)
        }
        const handleContinue = () => {
            setGameEditable(!gameEditable)
        }
        const handleEditGamePreview = () => {
            setYourmessage(gameName)
            setUploadImage(null)
            setGamePreviewModalVisible(true)
        }
        return (
            <View>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.subcomponent}>{strings('Create.lesson')}</Text>
                    {
                        // cardItems.data.length < maxCards+1
                        gameEditable
                        ?
                        <RadioForm>
                        {
                            lessonTypes.map((lessonType, i)=>(
                                <RadioButton key={i} style={{justifyContent: 'space-between'}}>
                                    <RadioButtonLabel
                                        obj={lessonType}
                                        labelStyle={{fontSize: 16}}
                                        onPress={(i)=>{handleRadioBtn(i)}}
                                    />
                                    <RadioButtonInput
                                        obj={lessonType}
                                        index={i}
                                        buttonOuterSize={40}
                                        isSelected={selectedTypeIndex==i}
                                        buttonWrapStyle={{marginLeft: 20}}
                                        onPress={()=>{handleRadioBtn(i)}}
                                        />
                                </RadioButton>
                            ))
                        }
                        </RadioForm>
                        :
                        <>
                        <Text style={{color: colors.blue}}>{gameLang}</Text>
                        <TouchableOpacity style={{margin: 10, padding: 20, backgroundColor: 'white', alignItems: 'center', width: modalWidth, height: modalWidth}}
                            onPress={handleEditGamePreview}
                        >
                            <Text style={{color: colors.blue}}>{gameName}</Text>
                            <Image source={{uri: gameImageUrl}} resizeMode='contain' style={{flex: 1, width: '100%', marginTop: 10}}/>
                        </TouchableOpacity>
                        </>
                    }
                </View>
                <View style={styles.divider}/>
                <Carousel
                    ref={cardSlider}
                    data={cardItems.data}
                    renderItem={renderCard}
                    extraData={cardItems}
                    sliderWidth={viewportWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={true}
                    firstItem={activeCard}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.5}
                    // inactiveSlideShift={20}
                    // containerCustomStyle={}
                    // contentContainerCustomStyle={{padding: 10}}
                    // loop={true}
                    // loopClonesPerSide={2}
                    //   autoplay={true}
                    // autoplayDelay={500}
                    // autoplayInterval={3000}
                    onSnapToItem={index => setActiveCard(index)}
                />
                <Pagination
                    dotsLength={cardItems.data.length}
                    activeDotIndex={activeCard}
                    // containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 0,
                        // backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={1}
                />
                {
                    cardItems.data.length > maxCards &&
                    <TouchableOpacity
                        style={styles.blueButton}
                        onPress={handleContinue}>
                        <Text style={styles.blueBtnTitle}>{!gameEditable?'Click on preview images to edit':'Continue'}</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
    const handlePost = () => {
        navigation.push('NewPost', { image: gameImageUrl, gameID, gameName, gameLang})
        // firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({status: 'completed'}).then(()=>{
        //     navigation.push('NewPost', { image: gameImageUrl, gameID, gameName, gameLang})
        // })
    }
    const handleToFriend = () => {
        setFriendModalVisible(true)
        setHideResults(true)
    }
    const handleInvite = () => {
        if (invited == null) {
            Toast.show('Select a friend again please')
            return
        }
        setFriendModalVisible(false)
        navigation.push('Chat', {uid: invited.uid, gameID, gameName, gameImageUrl, gameLang})
        // firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({status: 'completed'}).then(()=>{
        //     navigation.push('Chat', {uid: invited.uid, gameID, gameName, gameImageUrl, gameLang})
        // })
    }
    const handleGameEdit = () => {
        if (!yourmessage) {
            Toast.show('Please write your game name!')
            return
        }
        if (uploadImage == null && gameImageUrl == null) {
            Toast.show('Please upload a topic image!')
            return
        }
        setGamePreviewModalVisible(false)
        if (uploadImage == null) {
            setLoading(true)
            setGameName(yourmessage)
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({
                gameName: yourmessage,
            }).then(()=>{
                setLoading(false)
            })
            return

        }
        setLoading(true)
        storageUpload('media', uploadImage).then(url=>{
            setGameImageUrl(url)
            setGameName(yourmessage)
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({
                image: url,
                gameName,
            }).then(()=>{
                setLoading(false)
            })
            return
        })
        return

    }
    const films = []
    const regex = new RegExp(`${friendNick.trim()}`, 'i');
    for (const id in friends) {
        if (friends[id].username.search(regex) >= 0) {
            films.push(friends[id])
        }
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.mainBackground,
        }}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{width: '100%'}}>
                            <Slider
                                disabled
                                value={cardItems.data.length?(cardItems.data.length-1)/maxCards:0}
                                thumbTintColor={colors.blue}
                                minimumTrackTintColor={colors.blue}
                                maximumTrackTintColor={colors.blue}
                            />
                            {/* <Progress.Bar width={null} progress={cardItems.data.length?(cardItems.data.length-1)/10:0.01} /> */}
                        </View>
                        {/* <Text>{cardItems.data.length-1}/{maxCards}</Text> */}
                    </View>
                    {pager()}
                    <View>
                        {
                            gameEditable
                            ?
                            <View style={{margin: 10}}>
                            {/* <Text>Create <Text style={{color: colors.blue}}>{(maxCards+1)-cardItems.data.length}</Text> more cards.</Text> */}
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={handlePost}
                                    >
                                    <Text style={styles.text}>Post to social</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.blackButton}
                                    onPress={handleToFriend}>
                                    <Text style={styles.blackueBtnTitle}>Post to community</Text>
                                </TouchableOpacity>

                            </View>

                        }
                    </View>
                </View>
            </ScrollView>
            <Spinner visible={loading} />
            <LangModal
                visible={openModalForLessonLanguage}
                resetVisible={()=>setOpenModalForLessonLanguage(false)}
                changeLanguage={changeLessonLang}
                title={strings('Create.lesson_language')}
            />
            <LangModal
                visible={openModalForLearnLanguage}
                resetVisible={()=>setOpenModalForLearnLanguage(false)}
                changeLanguage={changeTeachingLang}
                title={strings('Create.teaching')}
            />
            <Modal
                animationType="slide"
                transparent={true}
                isVisible={cardVisible.visible}
                style={{alignSelf: 'center'}}
                onBackdropPress={()=>setCardVisible({visible:false, item: null})}
            >
                <View style={{justifyContent: 'center', backgroundColor: 'white', justifyContent: 'space-around', width: modalWidth, height: (modalWidth/3)*4}}>
                    <View style={{alignSelf: 'flex-end', marginTop: 10, marginRight: 10, flexDirection: 'row'}}>
                        {
                            cardVisible.item &&
                            <Icon
                                name='trash'
                                size={40}
                                color='grey'
                                onPress={()=>{
                                    const item = cardVisible.item
                                    setCardVisible({visible:false, item: null})
                                    setTimeout(()=>{
                                        setRemoveModalVisible({visible: true, item})
                                    }, 1000)
                                }}
                            />
                        }
                        <Icon
                            name='x'
                            size={40}
                            color='red'
                            onPress={()=>setCardVisible({visible:false, item: null})}
                        />
                    </View>
                    {renderCardModal()}

                </View>
            </Modal>
            <Modal
                backdropColor={'black'}
                backdropOpacity={0.5}
                animationType="slide"
                transparent={true}
                isVisible={friendModalVisible}
                onRequestClose={() => {
                }}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '80%', backgroundColor: 'white' }}>
                        <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                            <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                                <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                    {strings('CreateInvite.invite_your')}
                                </Text>
                            </View>
                            <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    setFriendModalVisible(false)
                                }}>
                                    <Icon
                                        color='white'
                                        size={25}
                                        name='x'
                                        type='entypo'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center', }}></View>
                            <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    hideResults={hideResults}
                                    listStyle={{ marginLeft: 17, fontSize: 15 }}
                                    containerStyle={{borderWidth: 0, flex: 1, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 10}}
                                    inputContainerStyle={{ borderWidth: 0, marginLeft: 17, marginRight: 10 }}
                                    data={films}
                                    defaultValue={friendNick}
                                    onChangeText={friendNick => {
                                        setFriendNick(friendNick)
                                        setHideResults(false)
                                    }}
                                    placeholder={strings('DrawThis.enter_friends')}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => {
                                            setInvited(item)
                                            setFriendNick(item.username)
                                            setHideResults(true)
                                        }}>
                                            <Text style={{fontSize: 15}}>
                                                {item.username}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                {/* <TextInput
                                    style={{ fontSize: 18, width: '70%', backgroundColor: '#FFFFFF', borderRadius: 3, borderWidth: 0, borderColor: '#E0E0E0' }}
                                    placeholder={strings('CreateInvite.friends_nickname')}
                                    placeholderTextColor="#D4D4D4"
                                    value={friendNick}
                                    onChangeText={friendNick => setFriendNick(friendNick)}
                                /> */}
                            </View>
                            <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}></View>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: 200, }}>
                                    <Button text={strings('CreateInvite.send')}
                                        style={{
                                            container: {
                                                height: 45,
                                                backgroundColor: '#2496BE',
                                                padding: 0,
                                                width: '100%',
                                            },
                                            text: {
                                                fontSize: 20,
                                                color: "#fff",
                                            }
                                        }}
                                        upperCase={false}
                                        onPress={handleInvite} />
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}></View>
                        </View>
                    </ElevatedView>
                </View>
            </Modal>
            <AwesomeAlert
                show={removeModalVisible.visible}
                showProgress={false}
                message='Are you sure to remove this card?'
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setRemoveModalVisible({visible: false, item: null})
                }}
                onConfirmPressed={() => {
                    const item = removeModalVisible.item
                    setRemoveModalVisible({visible: false, item: null})
                    setTimeout(()=>{
                        setLoading(true)
                        firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).delete().then(()=>{
                            const data = cardItems.data
                            for (var index=0;index<data.length;index++) {
                                if (data[index].id == item.id) {
                                    data.splice(index, 1)
                                    setCardItems({data})
                                    break
                                }
                            }
                            setLoading(false)
                        }).catch(e=>{
                            setLoading(false)
                            Toast.show(e.message)
                        })
    
                    }, 1000)
                }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                isVisible={gamePreviewModalVisible}
                style={{alignSelf: 'center'}}
                onBackdropPress={()=>setGamePreviewModalVisible(false)}
            >
                <View style={{justifyContent: 'center', backgroundColor: 'white', width: modalWidth, height: (modalWidth/3)*4}}>
                    <View style={{alignSelf: 'flex-end', marginTop: 10, marginRight: 10, flexDirection: 'row'}}>
                        <Icon
                            name='x'
                            size={40}
                            color='red'
                            onPress={()=>setGamePreviewModalVisible(false)}
                        />
                    </View>
                    <TextInput
                        placeholder={strings('Create.writeyouranswerhere')}
                        placeholderTextColor={colors.blue}
                        style={{textAlignVertical: 'bottom', borderBottomWidth: 1, marginLeft: 10, marginRight: 10}}
                        value={yourmessage}
                        onChangeText={txt=>setYourmessage(txt)}
                    />
                    <View style={{alignItems: 'center', flex: 1, marginTop: 10, justifyContent: 'center'}}>
                        <FileUpload
                            size={modalWidth*0.6}
                            padding={modalWidth/10}
                            title='Upload a image'
                            titleColor={colors.blue}
                            getPath={setUploadImage}
                            backgroundColor='lightgrey'
                            imageUrl={gameImageUrl}
                        />
                    </View>
                    <TouchableOpacity style={styles.greenButton}
                        onPress={handleGameEdit}
                    >
                        <Text style={{color: 'white'}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}
