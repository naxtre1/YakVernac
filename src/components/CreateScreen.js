import React, { useState, useEffect, useContext, useRef } from 'react'
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
    Dimensions,
} from 'react-native'
import { Slider } from 'react-native-elements'
import Autocomplete from 'react-native-autocomplete-input'
import { Button } from 'react-native-material-ui'
import { strings } from '../locales/i18n'
import * as Progress from 'react-native-progress'
import firestore from '@react-native-firebase/firestore'
import { NavigationContext } from 'react-navigation'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import ElevatedView from 'react-native-elevated-view'
import LangModal from './LangModal'
import FileUpload from './FileUpload'
import Toast from 'react-native-simple-toast'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
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
import Voice from '@react-native-community/voice'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'

import { styles, colors, viewportWidth, maxCards } from '../static/constant'
import useInterval from './useInterval'
import { connect } from 'react-redux'
import { getLangResourceByType, getLangLocalisationsByLanguage } from '../utils/helpers'
import { NavigationEvents } from 'react-navigation'

const audioRecorderPlayer = new AudioRecorderPlayer()
const sliderWidth = viewportWidth - 20
const itemWidth = sliderWidth * 0.5
const modalWidth = sliderWidth * 0.8

const CreateScreen = (props) => {
    const navigation = useContext(NavigationContext)

    // data from redux store
    const user = useSelector(state => state.user)
    const lang = useSelector(state => state.lang)
    const friends = useSelector(state => state.friends)

    // lesson language selection button
    const [lessonLanguage, setLessonLanguage] = useState(lang.languageNative)
    // open and close lesson language modal
    const [openModalForLearnLanguage, setOpenModalForLearnLanguage] = useState(false)

    // teaching language selection button
    const [teachingLanguage, setTeachingLanguage] = useState(lang.languageLearning)
    // open and close teaching language modal
    const [openModalForLessonLanguage, setOpenModalForLessonLanguage] = useState(false)

    // game related details
    const [gameName, setGameName] = useState(null)
    const [gameImageUrl, setGameImageUrl] = useState(null)
    const [gameID, setGameID] = useState(null)
    const [gameLang, setGameLang] = useState(`${getLangLocalisationsByLanguage(lang.languageNative)[lessonLanguage.toLowerCase()]} > ${getLangLocalisationsByLanguage(lang.languageNative)[teachingLanguage.toLowerCase()]}`)

    // screen progress indicator
    const [loading, setLoading] = useState(false)

    //Edit game
    const [gameEditable, setGameEditable] = useState(true)

    // 6 types of lessions to select for creating game
    const [lessonTypes, setLessonTypes] = useState([])

    // list of carousel slider card items
    const [cardItems, setCardItems] = useState({ data: [null] })
    const cardSlider = useRef()

    const [activeCard, setActiveCard] = useState(0)
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(0)
    const [yourmessage, setYourmessage] = useState('')
    const [gamePreviewModalVisible, setGamePreviewModalVisible] = useState(false)

    const [uploadImage, setUploadImage] = useState(null)
    const [uploadImage1, setUploadImage1] = useState(null)
    const [uploadImage2, setUploadImage2] = useState(null)
    const [uploadImage3, setUploadImage3] = useState(null)
    const [youranswer, setYouranswer] = useState('')
    const [sayTheImageanswer, setSayTheImageanswer] = useState('')
    const [cardVisible, setCardVisible] = useState({ visible: false, item: null })
    const [removeModalVisible, setRemoveModalVisible] = useState({ visible: false, item: null })

    const [recording, setRecording] = useState(false)
    const [textRecording, setTextRecording] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [audioFile, setAudioFile] = useState(null)

    const [isGameCardScreen, setIsGameCardScreen] = useState(false)

    const [friendModalVisible, setFriendModalVisible] = useState(false)
    const [hideResults, setHideResults] = useState(false)

    const [friendNick, setFriendNick] = useState('')
    const [invited, setInvited] = useState(null)

    const [started, setStarted] = useState(false)
    const [speechResult, setSpeechResult] = useState([])

    Voice.onSpeechStart = () => {
        console.log('onSpeechStart')
        setStarted(true)
    }
    Voice.onSpeechRecognized = () => {
        console.log('onSpeechRecognized')
    }
    Voice.onSpeechEnd = () => {
        console.log('onSpeechEnd')
        setStarted(false)
    }
    Voice.onSpeechError = (e) => {
        console.log('onSpeechError')
        console.log(e)
        setStarted(false)
    }
    Voice.onSpeechResults = (e) => {
        setSpeechResult(e.value)
    }
    Voice.onSpeechPartialResults = () => {
    }
    Voice.onSpeechVolumeChanged = () => {
    }

    const startRecognizing = () => {
        if (Platform.OS == 'android') {
            check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
                if (result == RESULTS.GRANTED) {
                    start();
                    //record audio file
                    startRecord();
                } else {
                    request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
                        if (result === RESULTS.GRANTED) {
                            start();
                            //record audio file
                            startRecord();
                        } else {
                            Toast.show('Permission not granted!')
                        }
                    });
                }
            })
        } else {
            start();
            //record audio file
            startRecord();
        }
    }
    const start = async () => {
        setStarted(true)
        try {
            console.log('voice start!')
            if (lang == 'Portuguese') {
                await Voice.start('pt-BR')
            } else {
                await Voice.start('en-US');
            }

        } catch (e) {
            console.log(e.message)
        }

    }

    // change the game language
    useEffect(() => {
        setGameLang(`${getLangLocalisationsByLanguage(lang.languageNative)[lessonLanguage.toLowerCase()]} > ${getLangLocalisationsByLanguage(lang.languageNative)[teachingLanguage.toLowerCase()]}`)
    }, [lessonLanguage, teachingLanguage])

    // fetch the 6 types of lessions from firestore
    useEffect(() => {
        initData();
    }, []);

    const initData = () => {
        setLoading(true)
        firestore().collection('creategames').orderBy('order').get().then(snapshot => {
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
            setLoading(false);
        });
    }

    const refreshPage = () => {
        setLessonLanguage(lang.languageNative)
        setTeachingLanguage(lang.languageLearning)
        setOpenModalForLearnLanguage(false)
        setOpenModalForLessonLanguage(false)
        setGameName(null)
        setGameImageUrl(null)
        setGameID(null)
        setGameLang(`${getLangLocalisationsByLanguage(lang.languageNative)[lessonLanguage.toLowerCase()]} > ${getLangLocalisationsByLanguage(lang.languageNative)[teachingLanguage.toLowerCase()]}`)
        setGameEditable(true)
        setLessonTypes([])
        setCardItems({ data: [null] })
        setActiveCard(0)
        setSelectedTypeIndex(0)
        setYourmessage('')
        setGamePreviewModalVisible(false)
        setUploadImage(null)
        setUploadImage1(null)
        setUploadImage2(null)
        setUploadImage3(null)
        setYouranswer('')
        setSayTheImageanswer('')
        setCardVisible({ visible: false, item: null })
        setRemoveModalVisible({ visible: false, item: null })
        setRecording(false)
        setPlaying(false)
        setAudioFile(null)
        setIsGameCardScreen(false)
        setFriendModalVisible(false)
        setHideResults(false)
        setFriendNick('')
        setInvited(null)
        setStarted(false)
        setSpeechResult([])

        initData()
    }

    // calling from lesson language modal
    const changeLessonLang = lang => {
        setLessonLanguage(lang)
        setOpenModalForLessonLanguage(false)
    }

    // calling from teaching language modal
    const changeTeachingLang = lang => {
        setTeachingLanguage(lang)
        setOpenModalForLearnLanguage(false)
    }

    const handleGo = () => {
        if (!gameName) {
            Toast.show(strings('Create.write_game_name'))
            return
        }
        if (gameImageUrl == null) {
            Toast.show('Please upload a topic image!')
            return
        }

        setLoading(true)
        const tempGameID = firestore().collection('user').doc(user.uid).collection('games').doc().id;

        storageUpload('media', gameImageUrl).then(url => {
            firestore().collection('user').doc(user.uid).collection('games').doc(tempGameID).set({
                image: url,
                gameName,
                lessonLanguage,
                teachingLanguage,
                status: 'edit'
            }).then(() => {
                setGameID(tempGameID);
                setGameImageUrl(url)
                setLoading(false)
                setIsGameCardScreen(true)
            })
        })
    }

    const createGameTopicScreen = () => {
        return (
            <View>
                <Text style={styles.subcomponent}>{strings('Create.lesson_language')}</Text>
                {/* <TouchableOpacity style={styles.outlineButton}
                    onPress={() => {
                        setOpenModalForLessonLanguage(true);
                    }}>
                    <Text>
                        {lessonLanguage}
                    </Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.langButton}
                    onPress={() => {
                        setOpenModalForLessonLanguage(true);
                    }}>
                    <Image style={{
                        resizeMode: 'cover',
                        width: 32,
                        height: 32,
                        marginRight: 12,
                        marginLeft: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        source={getLangResourceByType(lessonLanguage).source}
                    />
                    <Text>
                        {getLangLocalisationsByLanguage(lang.languageNative)[lessonLanguage.toLowerCase()]}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.subcomponent}>{strings('Create.teaching')}</Text>
                {/* <TouchableOpacity style={styles.outlineButton}
                    onPress={() => {
                        setOpenModalForLearnLanguage(true);
                    }}>
                    <Text>
                        {teachingLanguage}
                    </Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.langButton}
                    onPress={() => {
                        setOpenModalForLearnLanguage(true);
                    }}>
                    <Image style={{
                        resizeMode: 'cover',
                        width: 32,
                        height: 32,
                        marginRight: 12,
                        marginLeft: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        source={getLangResourceByType(teachingLanguage).source}
                    />
                    <Text>
                        {getLangLocalisationsByLanguage(lang.languageNative)[teachingLanguage.toLowerCase()]}
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider} />
                <View style={styles.topic}>
                    <View style={{ width: '100%' }}>
                        <TextInput
                            placeholder={strings('Create.write_game_name')}
                            placeholderTextColor={colors.blue}
                            style={{ textAlignVertical: 'bottom', borderBottomWidth: 1, marginBottom: 10 , padding: 10, justifyContent: "center", textAlign: "center"}}
                            value={gameName}
                            onChangeText={txt => {
                                setGameName(txt);
                            }}
                        />
                    </View>
                    <Text style={styles.gameLang}>
                        {gameLang}
                    </Text>  
                    <FileUpload
                        size={viewportWidth * 0.6}
                        padding={viewportWidth / 10}
                        title={strings('Create.upload_topic_img')}
                        titleColor={colors.blue}
                        getPath={(image) => {
                            setGameImageUrl(image)
                        }}
                        backgroundColor='lightgrey'
                    // imageUrl={gameImageUrl}
                    />

                </View>
                <TouchableOpacity
                    style={styles.blueButton}
                    onPress={() => {
                        handleGo();
                    }}
                >
                    <Text style={styles.blueBtnTitle}>{strings('Create.lets_go')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleRadioBtn = (i) => {
        if (cardItems.data.length > 0) {
            cardSlider.current.snapToItem(cardItems.data.length - 1)
        }
        setActiveCard(cardItems.data.length - 1)
        setSelectedTypeIndex(i)
    }

    const handleContinue = () => {
        setGameEditable(!gameEditable)
    }

    const handleEditGamePreview = () => {
        setYourmessage(gameName)
        // setUploadImage(null)
        setGamePreviewModalVisible(true)
    }

    const handleCreateCard = (item) => {
        if (cardItems.data.length > 14) {
            Toast.show('Maximum 15 cards can be used while creating a game!!');
            return;
        }

        if (item) {
            for (var i = 0; i < lessonTypes.length; i++) {
                if (lessonTypes[i].type == item.type) {
                    setSelectedTypeIndex(i)
                    setUploadImage(item.image)
                    setYourmessage(item.yourmessage)
                    setYouranswer(item.youranswer)
                    if (item.yourmessage && item.yourmessage.length > 0) {
                        setSayTheImageanswer(item.yourmessage[0])
                    }
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
            setSayTheImageanswer('')
            setAudioFile(null)
        }
        setCardVisible({ visible: true, item })
    }

    const renderCard = ({ item, index }) => {
        if (item == null) {
            if (gameEditable) {
                return (
                    <Icon
                        name='plus'
                        color='white'
                        style={{ backgroundColor: colors.green, alignSelf: 'center' }}
                        size={itemWidth - 20}
                        onPress={() => {
                            // setSpeechResult([]);
                            setSayTheImageanswer('');
                            handleCreateCard(item);
                        }}
                    />
                )
            }
            return null
        }
        const innerCard = item => {
            switch (item.type) {
                case 'introductions':
                    return (
                        <View style={{ margin: 20, flex: 1, backgroundColor: colors.grey }}>
                            <Text style={{ alignSelf: 'center', textAlignVertical: 'top', padding: 10 }}>{item.yourmessage.length < 50 ? item.yourmessage : item.yourmessage.substring(0, 50) + '...'}</Text>
                        </View>
                    )
                case 'saytheimage':
                    return (
                        <>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{ uri: item.image }} style={{ width: '100%', height: (itemWidth / 3) * 2, padding: 30, resizeMode: 'contain' }} />
                            </View>
                            <View style={{ marginLeft: 20, marginRight: 30, marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon
                                        name='mic'
                                        size={25}
                                        color={'grey'}
                                    />
                                    <Text style={{ marginLeft: 10 }}>{strings('Create.presstorecord')}</Text>
                                </View>
                                <View style={{ height: 10 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Icon
                                        name='play'
                                        size={25}
                                        color={'grey'}
                                    />
                                    <Text style={{ marginLeft: 10 }}>{strings('Create.listentorecord')}</Text>

                                </View>
                            </View>
                        </>
                    )
                case 'texttotext':
                    return (
                        <View style={{ margin: 30 }}>
                            <TextInput
                                editable={false}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                placeholder={strings('Create.writeyourmessagehere')}
                                multiline={true}
                                numberOfLines={6}
                                placeholderTextColor={colors.blue}
                                style={{ textAlignVertical: 'top', backgroundColor: colors.grey, color: 'black' }}
                                value={item.yourmessage.length < 50 ? item.yourmessage : item.yourmessage.substring(0, 50) + '...'}
                            />
                            <TextInput
                                editable={false}
                                placeholder={strings('Create.writeyouranswerhere')}
                                placeholderTextColor={colors.blue}
                                style={{ textAlignVertical: 'bottom', borderBottomWidth: 1 }}
                                value={item.youranswer.length < 10 ? item.youranswer : item.youranswer.substring(0, 10) + '...'}
                            />
                        </View>
                    )
                case 'choosetheimage':
                    return (
                        <View style={{ margin: 10, flex: 1 }}>
                            <TextInput
                                editable={false}
                                placeholder={strings('Create.choosewriteyourwordhere')}
                                placeholderTextColor={colors.blue}
                                style={{ borderBottomWidth: 1, textAlignVertical: 'bottom' }}
                                value={item.yourmessage.length < 10 ? item.yourmessage : item.yourmessage.substring(0, 10) + '...'}
                            />
                            <View style={{ flex: 1, justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'space-around' }}>
                                    <Image source={{ uri: item.image }} style={{ width: itemWidth / 3, height: itemWidth / 3, resizeMode: 'cover', borderWidth: 2, borderColor: colors.green }} />
                                    <Image source={{ uri: item.image1 }} style={{ width: itemWidth / 3, height: itemWidth / 3, resizeMode: 'cover' }} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: item.image2 }} style={{ width: itemWidth / 3, height: itemWidth / 3, resizeMode: 'cover' }} />
                                    <Image source={{ uri: item.image3 }} style={{ width: itemWidth / 3, height: itemWidth / 3, resizeMode: 'cover' }} />
                                </View>
                            </View>
                        </View>
                    )
                case 'listenthenwrite':
                    return (
                        <View style={{ marginVertical: 20, marginLeft: 12, marginRight: 12, justifyContent: 'space-between', flex: 1 }}>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon
                                    name='mic'
                                    size={25}
                                    color={'grey'}
                                />
                                <Text style={{ marginLeft: 5 }}>{strings('Create.presstorecord')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon
                                    name='play'
                                    size={25}
                                    color={'grey'}
                                />
                                <Text style={{ marginLeft: 5 }}>{strings('Create.listentorecord')}</Text>
                            </View>
                            <TextInput
                                editable={false}
                                placeholder={strings('Create.writeyouranswerhere')}
                                placeholderTextColor={colors.blue}
                                style={{ textAlignVertical: 'bottom', borderBottomWidth: 1 }}
                                value={item.youranswer.length < 10 ? item.youranswer : item.youranswer.substring(0, 10) + '...'}
                            />
                        </View>
                    )
                case 'writethisimage':
                    return (
                        <View style={{ height: '100%' }}>
                            <View style={{ alignItems: 'center', marginTop: 10, flex: 1 }}>
                                {/* <Image source={{ uri: item.image }} style={{ width: itemWidth / 2, height: itemWidth / 2, resizeMode: 'cover' }} /> */}
                                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                            </View>
                            <TextInput
                                editable={false}
                                placeholder={strings('Create.writeyouranswerhere')}
                                placeholderTextColor={colors.blue}
                                style={{ textAlignVertical: 'bottom', borderBottomWidth: 1, marginBottom: 10, marginHorizontal: 16 }}
                                value={item.youranswer.length < 10 ? item.youranswer : item.youranswer.substring(0, 10) + '...'}
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
                style={{ width: itemWidth, height: (itemWidth / 3) * 4, backgroundColor: 'white' }}
                onPress={() => {
                    handleCreateCard(item);
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ alignSelf: 'center', marginTop: 10 }}>{strings(item.title)}</Text>
                    <View style={{ flex: 1 }}>
                        {innerCard(item)}
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const getTheType = (lessonType) => {
        console.log("lessonType ------------------------", lessonType)
        switch (lessonType.type) {
            case 'saytheimage': return {
                label: "Diga a imagem",
                type: "saytheimage",
                value: "Create.saytheimage"
            };
                break;
            case 'choosetheimage': return {
                label: "Escolha a imagem",
                type: "choosetheimage",
                value: "Create.choosetheimage"
            };
                break;
            default: return lessonType;
                break;
        }
    }

    const createGameSelectionSliderScreen = () => {
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.subcomponent}>{strings('Create.lesson')}</Text>
                    {gameEditable
                        ? <RadioForm>
                            {
                                lessonTypes.map((lessonType, i) => (
                                    <RadioButton key={i} style={{ justifyContent: 'space-between' }}>
                                        <RadioButtonLabel
                                            obj={lang.languageNative == 'Portuguese' ? getTheType(lessonType) : lessonType}
                                            labelStyle={{ fontSize: 16 }}
                                            onPress={(i) => { handleRadioBtn(i) }}
                                        />
                                        <RadioButtonInput
                                            obj={lessonType}
                                            index={i}
                                            buttonOuterSize={40}
                                            isSelected={selectedTypeIndex == i}
                                            buttonWrapStyle={{ marginLeft: 20 }}
                                            onPress={() => { handleRadioBtn(i) }}
                                        />
                                    </RadioButton>
                                ))
                            }
                        </RadioForm>
                        : <>
                            <Text style={{ color: colors.blue }}>{gameLang}</Text>
                            <TouchableOpacity style={{ margin: 10, padding: 20, backgroundColor: 'white', alignItems: 'center', width: modalWidth, height: modalWidth }}
                                onPress={handleEditGamePreview}>
                                <Text style={{ color: colors.blue }}>{gameName}</Text>
                                <Image source={{ uri: gameImageUrl }} resizeMode='contain' style={{ flex: 1, width: '100%', marginTop: 10 }} />
                            </TouchableOpacity>
                        </>
                    }
                </View>
                <View style={styles.divider} />
                <Carousel
                    containerCustomStyle={{ marginHorizontal: -30 }}
                    style={{ margin: 10 }}
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
                    onSnapToItem={index => setActiveCard(index)}
                />
                <Pagination
                    dotsLength={cardItems.data.length}
                    activeDotIndex={activeCard}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: -12
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots 
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={1}
                />
                {/* {
                    cardItems.data.length > maxCards &&
                        !gameEditable
                        ? <TouchableOpacity
                            style={styles.simpleTextButton}
                            onPress={handleContinue}>
                            <Text style={styles.simpleText}>Click on preview images to edit</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity
                            style={styles.blueButton}
                            onPress={handleContinue}>
                            <Text style={styles.blueBtnTitle}>Continue</Text>
                        </TouchableOpacity>
                } */}
                {
                    cardItems.data.length > maxCards &&
                    <TouchableOpacity
                        style={!gameEditable ? styles.simpleTextButton : styles.blueButton}
                        onPress={!gameEditable ? null : handleContinue}>
                        <Text style={!gameEditable ? styles.simpleText : styles.blueBtnTitle}>{!gameEditable ? strings('Create.click_on_preview') : strings('Create.continue')}</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    const addLesson = (lesson) => {
        return new Promise((resolve, reject) => {
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').add(lesson).then(doc => {
                const cardID = doc.id
                lesson['id'] = cardID
                const cards = cardItems.data
                cards.pop()
                cards.push(lesson)
                cards.push(null)
                setCardItems({ data: cards })
                resolve(cards)
            }).catch(error => {
                reject(error)
            })
        })
    }

    const updateLesson = (item) => {
        return new Promise((resolve, reject) => {
            firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).update(item).then(doc => {
                const cards = cardItems.data
                setCardItems({ data: cards })
                resolve(cards)
            })
            return
        })
    }

    // const handleIntroductions = async () => {
    //     if (yourmessage) {
    //         for (const item of cardItems.data) {
    //             if (item && item.type == 'introductions') {
    //                 item.yourmessage = yourmessage
    //                 setCardVisible({ visible: false, item: null })
    //                 firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).update(item).then(() => {
    //                     setLoading(false)
    //                     setCardItems({ data: cardItems.data })
    //                 })
    //                 return;
    //             }
    //         }
    //         setCardVisible({ visible: false, item: null })
    //         const lesson = {
    //             type: 'introductions',
    //             title: 'Create.introductions',
    //             yourmessage,
    //             order: Date.now()
    //         }
    //         addLesson(lesson);
    //         return;
    //     }
    //     Toast.show('Please write your message!')
    // }

    const handleIntroductions = async () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            item.yourmessage = yourmessage
            setLoading(true)
            setCardVisible({ visible: false, item: null })
            updateLesson(item).then(() => {
                setLoading(false)
            })
            return
        }
        const lesson = {
            type: 'introductions',
            title: 'Create.introductions',
            yourmessage,
            order: Date.now()
        }
        setLoading(true)
        setCardVisible({ visible: false, item: null })
        addLesson(lesson).then(() => {
            setLoading(false)
        })
        return

        // if (yourmessage) {
        //     for (const item of cardItems.data) {
        //         if (item && item.type == 'introductions') {
        //             item.yourmessage = yourmessage
        //             setCardVisible({ visible: false, item: null })
        //             firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).update(item).then(() => {
        //                 setLoading(false)
        //                 setCardItems({ data: cardItems.data })
        //             })
        //             return;
        //         }
        //     }
        //     setCardVisible({ visible: false, item: null })
        //     const lesson = {
        //         type: 'introductions',
        //         title: 'Create.introductions',
        //         yourmessage,
        //         order: Date.now()
        //     }
        //     addLesson(lesson);
        //     return;
        // }
        // Toast.show('Please write your message!')
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
            return;
        });
    }

    const stopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecording(false)
    }

    const handleSaytheimage = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({ visible: false, item: null })
            setLoading(true)
            var newImage = uploadImage
            if (newImage === item.image) {
                newImage = ''
            }
            storageUpload('media', newImage).then(image => {
                if (image) {
                    item.image = image
                }
                var newAudio = audioFile
                if (newAudio === item.audio) {
                    newAudio = ''
                }
                storageUpload('audios', newAudio).then(audio => {
                    if (audio) {
                        item.audio = audio
                    }
                    updateLesson(item).then(() => {
                        setLoading(false)
                    })
                })
            })
            return
        }
        if (uploadImage && audioFile && sayTheImageanswer.length > 0) {
            setLoading(true)
            setCardVisible({ visible: false, item: null })
            storageUpload('media', uploadImage).then(image => {
                const lesson = {
                    type: 'saytheimage',
                    title: 'Create.saytheimage',
                    image,
                    yourmessage: [sayTheImageanswer],
                    order: Date.now()
                }
                storageUpload('audios', audioFile).then(audio => {
                    lesson['audio'] = audio
                    addLesson(lesson).then(() => {
                        setLoading(false)
                    })
                })
            })
            return
        }
        Toast.show(strings('Create.record_voice_warn_long'))
        return
    }

    const handleTexttotext = () => {
        if (yourmessage && youranswer) {
            if (cardVisible.item) {
                const item = cardVisible.item
                item.yourmessage = yourmessage
                item.youranswer = youranswer
                setLoading(true)
                setCardVisible({ visible: false, item: null })
                updateLesson(item).then(() => {
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
            setCardVisible({ visible: false, item: null })
            addLesson(lesson).then(() => {
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
            setCardVisible({ visible: false, item: null })
            setLoading(true)
            var newImage = uploadImage
            if (newImage === item.image) {
                newImage = ''
            }
            storageUpload('media', newImage).then(image => {
                if (image) {
                    item.image = image
                }
                newImage = uploadImage1
                if (newImage === item.image1) {
                    newImage = ''
                }
                storageUpload('media', newImage).then(image => {
                    if (image) {
                        item.image1 = image
                    }
                    newImage = uploadImage2
                    if (newImage === item.image2) {
                        newImage = ''
                    }
                    storageUpload('media', newImage).then(image => {
                        if (image) {
                            item.image2 = image
                        }
                        newImage = uploadImage3
                        if (newImage === item.image3) {
                            newImage = ''
                        }
                        storageUpload('media', newImage).then(image => {
                            if (image) {
                                item.image3 = image
                            }
                            item.yourmessage = yourmessage
                        })
                        updateLesson(item).then(() => {
                            setLoading(false)
                        })

                    })

                })

            })
            return
        }
        if (yourmessage && uploadImage && uploadImage1 && uploadImage2 && uploadImage3) {
            setCardVisible({ visible: false, item: null })
            setLoading(true)
            const lesson = {
                type: 'choosetheimage',
                title: 'Create.choosetheimage',
                yourmessage,
                order: Date.now()
            }
            storageUpload('media', uploadImage).then(image => {
                lesson['image'] = image
                storageUpload('media', uploadImage1).then(image => {
                    lesson['image1'] = image
                    storageUpload('media', uploadImage2).then(image => {
                        lesson['image2'] = image
                        storageUpload('media', uploadImage3).then(image => {
                            lesson['image3'] = image
                            addLesson(lesson).then(() => {
                                setLoading(false)
                            })
                        })
                    })
                })
            })
            return
        }
        Toast.show(strings('Create.select_four_imgs'))
        return
    }

    const handleListenthenwrite = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({ visible: false, item: null })
            setLoading(true)
            var newAudio = audioFile
            if (newAudio === item.audio) {
                newAudio = ''
            }
            storageUpload('audios', newAudio).then(audio => {
                if (audio) {
                    item.audio = audio
                }
                item.youranswer = youranswer
                updateLesson(item).then(() => {
                    setLoading(false)
                })
            })
            return
        }
        if (youranswer && audioFile) {
            setCardVisible({ visible: false, item: null })
            const lesson = {
                type: 'listenthenwrite',
                title: 'Create.listenthenwrite',
                youranswer,
                order: Date.now()
            }
            setLoading(true)
            storageUpload('audios', audioFile).then(audio => {
                lesson['audio'] = audio
                addLesson(lesson).then(() => {
                    setLoading(false)
                })
            })
            return
        }
        Toast.show(strings('Create.record_voice_warn_short'))
        return
    }

    const handleWritethisimage = () => {
        if (cardVisible.item) {
            const item = cardVisible.item
            setCardVisible({ visible: false, item: null })
            setLoading(true)
            var newImage = uploadImage
            if (newImage === item.image) {
                newImage = ''
            }
            storageUpload('media', newImage).then(image => {
                if (image) {
                    item.image = image
                }
                item.youranswer = youranswer
                updateLesson(item).then(() => {
                    setLoading(false)
                })
            })
            return
        }
        if (youranswer && uploadImage) {
            setCardVisible({ visible: false, item: null })
            const lesson = {
                type: 'writethisimage',
                title: 'Create.writethisimage',
                youranswer,
                order: Date.now()
            }
            setLoading(true)
            storageUpload('media', uploadImage).then(image => {
                lesson['image'] = image
                addLesson(lesson).then(() => {
                    setLoading(false)
                })
            })
            return
        }
        Toast.show(strings('Create.select_img_warn'))
        return
    }

    const storageUpload = (ref, path) => {
        if (path) {
            const re = /(?:\.([^.]+))?$/
            const extension = re.exec(path)[1]
            const childPath = user.uid + `/${Date.now().toString()}.` + extension
            const storageRef = storage().ref(ref).child(childPath)
            return new Promise((resolve, reject) => {
                storageRef.putFile(path).then(() => {
                    storageRef.getDownloadURL().then(url => {
                        resolve(url);
                        // firestore().collection('user').doc(user.uid).collection('media').add({
                        //     url,
                        //     type: 'lesson',
                        //     content: 'image',
                        //     lang: teachingLanguage,
                        //     bookmark: false,
                        //     time: Date.now()
                        // }).then(() => {
                        //     resolve(url)
                        // })
                    })
                }).catch(error => {
                    reject(error)
                })
            })
        }
        return new Promise((resolve, reject) => {
            resolve('')
        })
    }

    const renderCardModal = () => {
        if (lessonTypes.length == 0) {
            return null
        }
        const lessonType = lessonTypes[selectedTypeIndex]
        switch (lessonType.type) {
            case 'introductions': {
                return (
                    <View style={{ margin: 20, flex: 1, justifyContent: 'space-around' }}>
                        <TextInput
                            placeholder={strings('Create.writeyourmessagehere')}
                            multiline={true}
                            numberOfLines={6}
                            placeholderTextColor={colors.blue}
                            style={{ textAlignVertical: 'top', backgroundColor: colors.grey }}
                            value={yourmessage}
                            onChangeText={txt => setYourmessage(txt)}
                        />
                        <TouchableOpacity style={styles.greenButton}
                            onPress={() => {
                                handleIntroductions();
                            }}>
                            <Text style={{ color: 'white' }}>{strings('Create.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            case 'saytheimage':
                return (
                    <View style={{ flex: 1, justifyContent: 'space-around', marginHorizontal: 16, flexDirection: 'column' }}>
                        <View style={{ alignItems: 'center' }}>
                            <FileUpload
                                size={modalWidth * 0.5}
                                padding={modalWidth / 32}
                                title={strings('Create.upload_img')}
                                titleColor={colors.blue}
                                getPath={setUploadImage}
                                backgroundColor='lightgrey'
                                imageUrl={uploadImage}
                            />
                        </View>
                        {/* <View style={{ marginLeft: 50, marginRight: 30, marginTop: 20, marginBottom: 10 }}> */}
                        <View style={{ marginHorizontal: 40, marginTop: 12 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                                onPress={() => {
                                    if (playing) {
                                        return
                                    }
                                    if (recording || textRecording) {
                                        stopRecord()
                                    } else {
                                        startRecord()
                                    }
                                    // if (recording) {
                                    //     stopRecord();
                                    //     Voice.stop();
                                    // } else {
                                    //     startRecognizing();
                                    // }
                                }}>
                                <Icon
                                    name='mic'
                                    size={25}
                                    color={recording ? 'red' : 'grey'} />
                                <Text style={{ marginLeft: 10 }}>{recording ? textRecording ? 'Recording...' : 'Press to stop' : strings('Create.presstorecord')}</Text>
                            </TouchableOpacity>
                            <View style={{ height: 8 }} />
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                                onPress={async () => {
                                    if (recording || textRecording) {
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
                                                audioRecorderPlayer.addPlayBackListener(e => {
                                                    if (e.current_position === e.duration) {
                                                        audioRecorderPlayer.stopPlayer()
                                                        setPlaying(false)
                                                    }
                                                })
                                            }
                                            setPlaying(true)
                                        }
                                    }
                                }}>
                                <Icon
                                    name='play'
                                    size={25}
                                    color={playing ? 'red' : 'grey'} />
                                <Text style={{ marginLeft: 10 }}>{playing ? 'Playing...' : strings('Create.listentorecord')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{ borderBottomWidth: 1, textAlignVertical: 'bottom', paddingTop: 0 }}
                            value={sayTheImageanswer}
                            onChangeText={txt => {
                                setSayTheImageanswer(txt);
                            }} />
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            marginTop: 8,
                            marginBottom: 8,
                            marginLeft: 30,
                            marginRight: 30,
                            backgroundColor: colors.green,
                            padding: 10,
                        }}
                            onPress={() => {
                                handleSaytheimage();
                            }}>
                            <Text style={{ color: 'white' }}>{strings('Create.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'texttotext':
                return (
                    <View style={{ margin: 20, flex: 1, justifyContent: 'space-around' }}>
                        <TextInput
                            placeholder={strings('Create.writeyourmessagehere')}
                            multiline={true}
                            numberOfLines={6}
                            placeholderTextColor={colors.blue}
                            style={{ textAlignVertical: 'top', backgroundColor: colors.grey }}
                            value={yourmessage}
                            onChangeText={txt => setYourmessage(txt)}
                        />
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{ textAlignVertical: 'bottom', borderBottomWidth: 1 }}
                            value={youranswer}
                            onChangeText={txt => setYouranswer(txt)}
                        />
                        <TouchableOpacity style={styles.greenButton}
                            onPress={() => {
                                handleTexttotext();
                            }}>
                            <Text style={{ color: 'white' }}>{strings('Create.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'choosetheimage': {
                const fuSize = modalWidth * 0.8 / 2 - 30
                const padding = 5
                return (
                    <View style={{ margin: 20, flex: 1, justifyContent: 'space-around' }}>
                        <TextInput
                            placeholder={strings('Create.choosewriteyourwordhere')}
                            placeholderTextColor={colors.blue}
                            style={{ borderBottomWidth: 1, textAlignVertical: 'bottom', padding: 0 }}
                            value={yourmessage}
                            onChangeText={txt => setYourmessage(txt)} />
                        <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'center' }}>
                            <View style={styles.subcomponent}>
                                <FileUpload
                                    size={fuSize}
                                    padding={padding}
                                    title='Correct'
                                    titleColor='white'
                                    color='white'
                                    backgroundColor={colors.green}
                                    getPath={setUploadImage}
                                    imageUrl={uploadImage} />
                            </View>
                            <View style={styles.subcomponent}>
                                <FileUpload
                                    size={fuSize}
                                    padding={padding}
                                    titleColor={colors.blue}
                                    getPath={setUploadImage1}
                                    backgroundColor='lightgrey'
                                    imageUrl={uploadImage1} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'center' }}>
                            <View style={[styles.subcomponent]}>
                                <FileUpload
                                    size={fuSize}
                                    padding={padding}
                                    titleColor={colors.blue}
                                    getPath={setUploadImage2}
                                    backgroundColor='lightgrey'
                                    imageUrl={uploadImage2} />
                            </View>
                            <View style={styles.subcomponent}>
                                <FileUpload
                                    size={fuSize}
                                    padding={padding}
                                    titleColor={colors.blue}
                                    getPath={setUploadImage3}
                                    backgroundColor='lightgrey'
                                    imageUrl={uploadImage3} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.greenButton}
                            onPress={() => {
                                handleChoosetheimage();
                            }}>
                            <Text style={{ color: 'white' }}>{strings('Create.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            case 'listenthenwrite':
                return (
                    <View style={{ margin: 20, flex: 1, justifyContent: 'space-around' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                            onPress={() => {
                                if (playing) {
                                    return
                                }
                                if (recording) {
                                    stopRecord()
                                } else {
                                    startRecord()
                                }
                            }}>
                            <Icon
                                name='mic'
                                size={25}
                                color={recording ? 'red' : 'grey'} />
                            <Text style={{ marginLeft: 10 }}>{recording ? textRecording ? 'Recording...' : 'Press to stop' : strings('Create.presstorecord')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                            onPress={async () => {
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
                                            audioRecorderPlayer.addPlayBackListener(e => {
                                                if (e.current_position === e.duration) {
                                                    audioRecorderPlayer.stopPlayer()
                                                    setPlaying(false)
                                                }
                                            })
                                        }
                                        setPlaying(true)
                                    }
                                }
                            }}>
                            <Icon
                                name='play'
                                size={25}
                                color={playing ? 'red' : 'grey'} />
                            <Text style={{ marginLeft: 10 }}>{playing ? 'Playing...' : strings('Create.listentorecord')}</Text>
                        </TouchableOpacity>
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{ textAlignVertical: 'bottom', borderBottomWidth: 1 }}
                            value={youranswer}
                            onChangeText={txt => {
                                setYouranswer(txt);
                            }} />
                        <TouchableOpacity style={styles.greenButton}
                            onPress={() => {
                                handleListenthenwrite();
                            }}>
                            <Text style={{ color: 'white' }}>{strings('Create.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'writethisimage':
                return (
                    <View style={{ margin: 20, flex: 1, justifyContent: 'space-around' }}>
                        <View style={{ alignItems: 'center' }}>
                            <FileUpload
                                size={modalWidth * 0.6}
                                padding={modalWidth / 10}
                                title={strings('Create.upload_img')}
                                titleColor={colors.blue}
                                getPath={setUploadImage}
                                backgroundColor='lightgrey'
                                imageUrl={uploadImage}
                            />
                        </View>
                        <TextInput
                            placeholder={strings('Create.writeyouranswerhere')}
                            placeholderTextColor={colors.blue}
                            style={{ textAlignVertical: 'bottom', borderBottomWidth: 1 }}
                            value={youranswer}
                            onChangeText={txt => setYouranswer(txt)}
                        />
                        <TouchableOpacity style={styles.greenButton}
                            onPress={() => {
                                handleWritethisimage();
                            }}>
                            <Text style={{ color: 'white' }}>{strings('Create.ok')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            default:
                return null
        }
    }

    const handleSendToSocial = () => {
        navigation.goBack();
        navigation.push('NewPost', { image: gameImageUrl, gameID, gameName, gameLang })
        // firestore().collection('user').doc(user.uid).collection('games').doc(gameID).update({ status: 'completed' }).then(() => {
        //     navigation.goBack();
        //     navigation.push('PostScreen');
        // })
    }

    const formatTime = (time) => {
        if (time.length < 2) time = "0" + time;
        return time;
    }

    const handlePost = () => {
        let currentDate = new Date();
        let dateTime = formatTime(currentDate.getHours()) + ":" + formatTime(currentDate.getMinutes()) + " "
            + formatTime(currentDate.getDate()) + "/" + formatTime(currentDate.getMonth() + 1) + "/" + formatTime(currentDate.getFullYear().toString().substr(-2));
        let curDateTime = Date.now().toString()

        setLoading(true)
        firestore().collection('Post').doc(curDateTime).set({
            id: curDateTime,
            uid: props.user.uid,
            username: props.user.username,
            myPic: props.profilePics.profilePics.length > 0 ? props.profilePics.profilePics[props.profilePics.profilePics.length - 1].illustration : props.user.myPic,
            postlang: 0, //0 : EN, 1: PT
            postmessage: gameName,
            gameID: gameID,
            gameName: gameName,
            gameLang: gameLang,
            loveList: [],
            commentList: [],
            hiddenList: [],
            postDate: dateTime,
            isHide: 1, //0: hide, 1: not hide
            isEn: 1, //1:EN, 0:PT
            imageURL: gameImageUrl,
            audioURL: '',
            audioDuration: '00:00:00',
            isFromCreateGame: true
        }).then(() => {
            if (gameImageUrl) {
                firestore().collection('user').doc(props.user.uid).collection('media').add({
                    url: gameImageUrl,
                    type: 'post',
                    id: curDateTime,
                    content: 'image',
                    bookmark: false,
                    isFromCreateGame: true,
                    time: Date.now()
                })
            }
            setLoading(false)
            navigation.goBack();
            navigation.push('PostScreen');
        }).catch((error) => {
            //error callback
            console.log('error ', error)
            alert("Please try again.")
            setLoading(false)
        })
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
        navigation.goBack();
        navigation.push('Chat', { uid: invited.uid, gameID, gameName, gameImageUrl, gameLang })
    }

    let films = []
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
                <NavigationEvents
                    onDidFocus={payload => {
                        refreshPage()
                    }}
                />
                <View style={styles.container}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {/* {cardItems.data.length > maxCards
                                ? <Text>Great job! Scroll down to continue.</Text>
                                : <Text>{`Create ${maxCards - (cardItems.data.length - 1)} more cards`}</Text>} */}
                            {isGameCardScreen
                                ? cardItems.data.length > maxCards
                                    ? <Text style={{ fontWeight: 'bold' }}>{strings('Create.great_job')}</Text>
                                    : <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{strings('Create.create')} </Text>
                                        <Text style={{ color: 'red', fontWeight: 'bold' }}>{maxCards - (cardItems.data.length - 1)} </Text>
                                        <Text style={{ fontWeight: 'bold' }}>{strings('Create.more_cards')}</Text>
                                    </View>
                                : null
                            }
                        </View>
                        <View style={{ width: '100%' }}>
                            <Slider
                                disabled
                                value={cardItems.data.length ? (cardItems.data.length - 1) / maxCards : 0}
                                thumbTintColor={colors.blue}
                                minimumTrackTintColor={colors.blue}
                                maximumTrackTintColor={colors.blue}
                            />
                        </View>
                    </View>
                    {isGameCardScreen
                        ? createGameSelectionSliderScreen()
                        : createGameTopicScreen()}
                    <View>
                        {
                            gameEditable
                                ? <View style={{ margin: 10 }} />
                                : <View style={{ flex: 1 }}>
                                    {/* <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            handleSendToSocial();
                                        }}>
                                        <Text style={styles.text}>Post to social</Text>
                                    </TouchableOpacity> */}

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        {/* <TouchableOpacity
                                            style={styles.blueButton}
                                            onPress={handleToFriend}>
                                            <Text style={styles.blueBtnTitle}>{strings('Create.send_to_friend')}</Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity
                                            style={styles.blueButton}
                                            onPress={() => {
                                                handlePost();
                                            }}>
                                            <Text style={styles.blueBtnTitle}>{strings('Create.post_to_community')}</Text>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity
                                            style={styles.blackButtonFull}
                                            onPress={() => {
                                                handlePost();
                                            }}>
                                            <Text style={styles.blackueBtnTitle}>{strings('Create.post_to_community')}</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                        }
                    </View>
                </View>
            </ScrollView>
            <Spinner visible={loading} />
            <LangModal
                visible={openModalForLessonLanguage}
                resetVisible={() => {
                    setOpenModalForLessonLanguage(false)
                }}
                changeLanguage={changeLessonLang}
                title={strings('Create.lesson_language')}
            />
            <LangModal
                visible={openModalForLearnLanguage}
                resetVisible={() => {
                    setOpenModalForLearnLanguage(false)
                }}
                changeLanguage={changeTeachingLang}
                title={strings('Create.teaching')}
            />
            <Modal
                animationType="slide"
                transparent={true}
                isVisible={cardVisible.visible}
                style={{ alignSelf: 'center' }}
                onBackdropPress={() => setCardVisible({ visible: false, item: null })}
            >
                <View style={{ justifyContent: 'center', backgroundColor: 'white', justifyContent: 'space-around', width: modalWidth, height: (modalWidth / 3) * 4 }}>
                    <View style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10, flexDirection: 'row' }}>
                        {
                            cardVisible.item &&
                            <Icon
                                name='trash'
                                size={36}
                                color='grey'
                                onPress={() => {
                                    const item = cardVisible.item
                                    setCardVisible({ visible: false, item: null })
                                    setTimeout(() => {
                                        setRemoveModalVisible({ visible: true, item })
                                    }, 1000)
                                }}
                            />
                        }
                        {/* <Icon
                            name='x'
                            size={40}
                            color='red'
                            onPress={() => setCardVisible({ visible: false, item: null })}
                        /> */}
                        <TouchableOpacity onPress={() => setCardVisible({ visible: false, item: null })} style={{ height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                            <Image style={{
                                resizeMode: 'cover',
                                width: 32,
                                height: 32,
                                justifyContent: 'center',
                                alignItems: 'center',
                                tintColor: 'grey'
                            }}
                                source={require('../assets/logout.png')}
                            />
                        </TouchableOpacity>
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
                onRequestClose={() => { }}>
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
                                    containerStyle={{ borderWidth: 0, flex: 1, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 10 }}
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
                                            <Text style={{ fontSize: 15 }}>
                                                {item.username}
                                            </Text>
                                        </TouchableOpacity>
                                    )} />
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
                message={strings('Create.delete_msg')}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={strings('Create.cancel_msg')}
                confirmText={strings('Create.confrim_msg')}
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setRemoveModalVisible({ visible: false, item: null })
                }}
                onConfirmPressed={() => {
                    const item = removeModalVisible.item
                    setRemoveModalVisible({ visible: false, item: null })
                    setTimeout(() => {
                        setLoading(true)
                        firestore().collection('user').doc(user.uid).collection('games').doc(gameID).collection('cards').doc(item.id).delete().then(() => {
                            const data = cardItems.data
                            for (var index = 0; index < data.length; index++) {
                                if (data[index].id == item.id) {
                                    data.splice(index, 1)
                                    setCardItems({ data })
                                    break
                                }
                            }
                            setLoading(false)
                        }).catch(e => {
                            setLoading(false)
                            Toast.show(e.message)
                        })
                    }, 1000)
                }}
            />
        </View>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user,
        friends: state.friends,
        profilePics: state.profilePics
    }
}

export default connect(mapStateToProps, {})(CreateScreen);