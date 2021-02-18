import React, { useState, useEffect, useContext, useRef } from 'react'
import { NavigationContext } from 'react-navigation'
import { Icon } from 'react-native-elements'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import ElevatedView from 'react-native-elevated-view'
import { Avatar } from 'react-native-elements'
import Modal from "react-native-modal"
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ImageBackground,
    Platform,
    PermissionsAndroid,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    FlatList,
} from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector, useDispatch } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as Progress from 'react-native-progress'
import SwitchSelector from 'react-native-switch-selector'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { FlatGrid } from 'react-native-super-grid'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { Col, Row, Grid } from "react-native-easy-grid"
import ImagePicker from 'react-native-image-crop-picker'
import Toast from 'react-native-simple-toast'
import Spinner from "react-native-loading-spinner-overlay"
import storage from '@react-native-firebase/storage'
import { Slider } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { Chevron } from 'react-native-shapes'
import { showMessage, hideMessage } from "react-native-flash-message"
import AwesomeAlert from 'react-native-awesome-alerts'
import Entypo from 'react-native-vector-icons/Entypo'
import { Dialog } from 'react-native-simple-dialogs'

import { colors } from '../static/constant'
import { getLangInitial } from '../static/constant'
import { setSex, setMypic } from '../redux/action'
import LangModal from './LangModal'
import ImageGrid from './ImageGrid'
import { strings } from '../locales/i18n'
import { setLang, setNotify, logout, setUsername, setIntroduction, setProfilePics } from '../redux/action'

const deviceWidth = Dimensions.get('window').width

export default function ProfileScreen() {
    const [globalProgress, setGlobalProgress] = useState([]);
    const navigation = useContext(NavigationContext)
    const user = useSelector(state => state.user)
    const profilePics = useSelector(state => state.profilePics)
    const dispatch = useDispatch()
    // const profilePics = useSelector(state => state.profilePics)
    const lang = useSelector(state => state.lang)
    const friends = useSelector(state => state.friends)
    const buddies = Object.keys(friends).length
    const [segment, setSegment] = useState('photo')
    const [photoButton, setPhotoButton] = useState('all')
    const [lessonButton, setLessonButton] = useState('all')
    const [bookmarkButton, setBookmarkButton] = useState('all')
    const languageNative = getLangInitial(lang.languageNative)
    const languageLearning = getLangInitial(lang.languageLearning)
    const [removeModalVisible, setRemoveModalVisible] = useState(false)
    const [loveCnt, setLoveCnt] = useState(0)
    const [postCnt, setPostCnt] = useState(0)

    const var_rating = {}
    var_rating[languageLearning] = 0
    const [rating, setRating] = useState(var_rating)
    const tempRating = {}
    tempRating['all'] = 0
    tempRating[languageLearning] = 0
    const [globalTop10ErrorQuarter, setGlobalTop10ErrorQuarter] = useState([]);
    const [globalTop10ErrorYear, setGlobalTop10ErrorYear] = useState([]);

    const [listenRatingQuarter, setListenRatingQuarter] = useState(tempRating)
    const [listenRatingYear, setListenRatingYear] = useState(tempRating)
    const [speakRatingQuarter, setSpeakRatingQuarter] = useState(tempRating)
    const [speakRatingYear, setSpeakRatingYear] = useState(tempRating)
    const [writeRatingQuarter, setWriteRatingQuarter] = useState(tempRating)
    const [writeRatingYear, setWriteRatingYear] = useState(tempRating)
    const [seeRatingQuarter, setSeeRatingQuarter] = useState(tempRating)
    const [seeRatingYear, setSeeRatingYear] = useState(tempRating)

    const [vocabularyCntQuarter, setvocabularyCntQuarter] = useState(tempRating)
    const [vocabularyCntYear, setvocabularyCntYear] = useState(tempRating)
    const [successWordCntQuarter, setsuccessWordCntQuarter] = useState(tempRating)
    const [successWordCntYear, setsuccessWordCntYear] = useState(tempRating)
    const [unsuccessWordCntQuarter, setunsuccessWordCntQuarter] = useState(tempRating)
    const [unsuccessWordCntYear, setunsuccessWordCntYear] = useState(tempRating)
    const [compLessonCntQuarter, setcompLessonCntQuarter] = useState(tempRating)
    const [compLessonCntYear, setcompLessonCntYear] = useState(tempRating)
    const [translationCntQuarter, settranslationCntQuarter] = useState(tempRating)
    const [translationCntYear, settranslationCntYear] = useState(tempRating)
    const [hearingWinCntQuarter, sethearingWinCntQuarter] = useState(tempRating)
    const [hearingWinCntYear, sethearingWinCntYear] = useState(tempRating)
    const [hearingLossCntQuarter, sethearingLossCntQuarter] = useState(tempRating)
    const [hearingLossCntYear, sethearingLossCntYear] = useState(tempRating)
    const [speakingWinCntQuarter, setspeakingWinCntQuarter] = useState(tempRating)
    const [speakingWinCntYear, setspeakingWinCntYear] = useState(tempRating)
    const [speakingLossCntQuarter, setspeakingLossCntQuarter] = useState(tempRating)
    const [speakingLossCntYear, setspeakingLossCntYear] = useState(tempRating)
    const [writingWinCntQuarter, setwritingWinCntQuarter] = useState(tempRating)
    const [writingWinCntYear, setwritingWinCntYear] = useState(tempRating)
    const [writingLossCntQuarter, setwritingLossCntQuarter] = useState(tempRating)
    const [writingLossCntYear, setwritingLossCntYear] = useState(tempRating)
    const [sightWinCntQuarter, setsightWinCntQuarter] = useState(tempRating)
    const [sightWinCntYear, setsightWinCntYear] = useState(tempRating)
    const [sightLossCntQuarter, setsightLossCntQuarter] = useState(tempRating)
    const [sightLossCntYear, setsightLossCntYear] = useState(tempRating)
    const [lessonTimeQuarter, setLessonTimeQuarter] = useState(tempRating)
    const [lessonTimeYear, setLessonTimeYear] = useState(tempRating)

    const ErrorWords = {}
    ErrorWords[languageLearning] = []
    const [top10ErrorWordsQuarter, settop10ErrorWordsQuarter] = useState(ErrorWords)
    const [top10ErrorWordsYear, settop10ErrorWordsYear] = useState(ErrorWords)
    const [seletedErrorWord, setSeletedErrorWord] = useState(100)
    const [openLangModal, setOpenLangModal] = useState(false)

    const [allMedia, setAllMedia] = useState([])
    const [lessonsMedia, setLessonsMedia] = useState([])
    const [picturesMedia, setPicturesMedia] = useState([])
    const [videosMedia, setVideosMedia] = useState([])
    const [bookmarkAllMedia, setBookmarkAllMedia] = useState([])
    const [bookmarkLessonsMedia, setBookmarkLessonsMedia] = useState([])
    const [bookmarkPicturesMedia, setBookmarkPicturesMedia] = useState([])
    const [bookmarkVideosMedia, setBookmarkVideosMedia] = useState([])

    const [loading, setLoading] = useState(false)
    const [lessonDuration, setLessionDuration] = useState('quarter')
    const [editDialog, setEditDialog] = useState({ type: null, visible: false, title: '', text: '' })
    const [visibleModal, setvisibleModal] = useState(false)
    useEffect(() => {
        getMediaList()
        getProgress()
    }, [])
    const myPic = profilePics.profilePics.length > 0 ? profilePics.profilePics[profilePics.profilePics.length - 1].illustration : user.myPic
    const getMediaList = () => {
        setLoveCnt(0)
        setPostCnt(0)
        firestore().collection('user').doc(user.uid).collection('media').orderBy('time', 'desc').get().then(snapshot => {
            const media = []
            for (var i = 0; i < snapshot.docs.length; i++) {
                const item = snapshot.docs[i].data()
                item.key = snapshot.docs[i].id
                item.index = i
                media.push(item)
            }
            media.map(image => {
                if (image.type == 'post') {
                    if (image.id) {
                        firestore().collection('Post').doc(image.id).get().then(doc => {
                            if (doc.exists) {
                                const data = doc.data()
                                if (data.loveList && data.loveList.length > 0) {
                                    setLoveCnt(loveCnt => loveCnt + 1)
                                }
                            }
                        })
                    }
                }
            })
            setAllMedia([...media])
        })
        firestore().collection('Post').where('uid', '==', user.uid).get().then(snapshot => {
            const cnt = snapshot.docs.length
            setPostCnt(cnt)
        })

    }
    useEffect(() => {
        const lessonsMedia = allMedia.filter(item => {
            if (item.type == 'lesson') {
                return true
            }
            return false
        })
        setLessonsMedia(lessonsMedia)
        const picturesMedia = allMedia.filter(item => {
            if (item.content == 'image') {
                return true
            }
            return false
        })
        setPicturesMedia(picturesMedia)
        const videosMedia = allMedia.filter(item => {
            if (item.content == 'video') {
                return true
            }
            return false
        })
        setVideosMedia(videosMedia)
        const bookmarkAllMediaArray = allMedia.filter(item => {
            if (item.bookmark) {
                return true
            }
            return false
        })
        setBookmarkAllMedia(bookmarkAllMediaArray)
        const bookmarkLessonsMedia = bookmarkAllMediaArray.filter(item => {
            if (item.type == 'lesson') {
                return true
            }
            return false
        })
        setBookmarkLessonsMedia(bookmarkLessonsMedia)
        const bookmarkPicturesMedia = bookmarkAllMediaArray.filter(item => {
            if (item.content == 'image') {
                return true
            }
            return false
        })
        setBookmarkPicturesMedia(bookmarkPicturesMedia)
        const bookmarkVideosMedia = bookmarkAllMediaArray.filter(item => {
            if (item.content == 'video') {
                return true
            }
            return false
        })
        setBookmarkVideosMedia(bookmarkVideosMedia)
    }, [allMedia])


    const updateStatsUI = (progress) => {
        if (!progress) {
            return;
        }
        var count = 0
        progress.map(item => {
            if (item.result) {
                count++
            }
        })
        const tempRating = {}
        tempRating['all'] = count / 10000
        tempRating[languageLearning] = count / 10000
        setRating({ ...tempRating })
        var listenQuarter = 0, listenYear = 0
        var losslistenQuarter = 0, losslistenYear = 0
        var speakQuarter = 0, speakYear = 0
        var lossspeakQuarter = 0, lossspeakYear = 0
        var writeQuarter = 0, writeYear = 0
        var losswriteQuarter = 0, losswriteYear = 0
        var seeQuarter = 0, seeYear = 0
        var lossseeQuarter = 0, lossseeYear = 0
        var vocabularyQuarter = 0, vocabularyYear = 0
        var successQuarter = 0, successYear = 0
        var unsuccessQuarter = 0, unsuccessYear = 0
        progress.map(item => {
            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                vocabularyYear++
                if (item.result) {
                    successYear++
                } else {
                    unsuccessYear++
                }
                if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                    vocabularyQuarter++
                    if (item.result) {
                        successQuarter++
                    } else {
                        unsuccessQuarter++
                    }
                }
            }
            if (item.lang == lang.languageLearning) {
                if (item.mode == 'listen') {
                    if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                        if (item.result) {
                            listenYear++
                        } else {
                            losslistenYear++
                        }
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                            if (item.result) {
                                listenQuarter++

                            } else {
                                losslistenQuarter++
                            }
                        }
                    }
                } else if (item.mode == 'speak') {
                    if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                        if (item.result) {
                            speakYear++
                        } else {
                            lossspeakYear++
                        }
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                            if (item.result) {
                                speakQuarter++
                            } else {
                                lossspeakQuarter++
                            }
                        }
                    }
                } else if (item.mode == 'write') {
                    if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                        if (item.result) {
                            writeYear++
                        } else {
                            losswriteYear++
                        }
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                            if (item.result) {
                                writeQuarter++
                            } else {
                                losswriteQuarter++
                            }
                        }
                    }

                } else if (item.mode == 'see') {
                    if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                        if (item.result) {
                            seeYear++
                        } else {
                            lossseeYear++
                        }
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                            if (item.result) {
                                seeQuarter++
                            } else {
                                lossseeQuarter++
                            }
                        }
                    }

                }
            }
        })
        tempRating['all'] = (listenQuarter + losslistenQuarter) == 0 ? 1 : listenQuarter / (listenQuarter + losslistenQuarter)
        tempRating[languageLearning] = (listenQuarter + losslistenQuarter) == 0 ? 1 : listenQuarter / (listenQuarter + losslistenQuarter)
        setListenRatingQuarter({ ...tempRating })
        tempRating['all'] = (listenYear + losslistenYear) == 0 ? 1 : listenYear / (listenYear + losslistenYear)
        tempRating[languageLearning] = (listenYear + losslistenYear) == 0 ? 1 : listenYear / (listenYear + losslistenYear)
        setListenRatingYear({ ...tempRating })

        tempRating['all'] = (speakQuarter + lossspeakQuarter) == 0 ? 1 : speakQuarter / (speakQuarter + lossspeakQuarter)
        tempRating[languageLearning] = (speakQuarter + lossspeakQuarter) == 0 ? 1 : speakQuarter / (speakQuarter + lossspeakQuarter)
        setSpeakRatingQuarter({ ...tempRating })
        tempRating['all'] = (speakYear + lossspeakYear) == 0 ? 1 : speakYear / (speakYear + lossspeakYear)
        tempRating[languageLearning] = (speakYear + lossspeakYear) == 0 ? 1 : speakYear / (speakYear + lossspeakYear)
        setSpeakRatingYear({ ...tempRating })

        tempRating['all'] = (writeQuarter + losswriteQuarter) == 0 ? 1 : writeQuarter / (writeQuarter + losswriteQuarter)
        tempRating[languageLearning] = (writeQuarter + losswriteQuarter) == 0 ? 1 : writeQuarter / (writeQuarter + losswriteQuarter)
        setWriteRatingQuarter({ ...tempRating })
        tempRating['all'] = (writeYear + losswriteYear) == 0 ? 1 : writeYear / (writeYear + losswriteYear)
        tempRating[languageLearning] = (writeYear + losswriteYear) == 0 ? 1 : writeYear / (writeYear + losswriteYear)
        setWriteRatingYear({ ...tempRating })

        tempRating['all'] = (seeQuarter + lossseeQuarter) == 0 ? 1 : seeQuarter / (seeQuarter + lossseeQuarter)
        tempRating[languageLearning] = (seeQuarter + lossseeQuarter) == 0 ? 1 : seeQuarter / (seeQuarter + lossseeQuarter)
        setSeeRatingQuarter({ ...tempRating })
        tempRating['all'] = (seeYear + lossseeYear) == 0 ? 1 : seeYear / (seeYear + lossseeYear)
        tempRating[languageLearning] = (seeYear + lossseeYear) == 0 ? 1 : seeYear / (seeYear + lossseeYear)
        setSeeRatingYear({ ...tempRating })

        tempRating['all'] = vocabularyQuarter
        tempRating[languageLearning] = vocabularyQuarter
        setvocabularyCntQuarter({ ...tempRating })
        tempRating['all'] = vocabularyYear
        tempRating[languageLearning] = vocabularyYear
        setvocabularyCntYear({ ...tempRating })

        tempRating['all'] = successQuarter
        tempRating[languageLearning] = successQuarter
        setsuccessWordCntQuarter({ ...tempRating })
        tempRating['all'] = successYear
        tempRating[languageLearning] = successYear
        setsuccessWordCntYear({ ...tempRating })

        tempRating['all'] = unsuccessQuarter
        tempRating[languageLearning] = unsuccessQuarter
        setunsuccessWordCntQuarter({ ...tempRating })
        tempRating['all'] = unsuccessYear
        tempRating[languageLearning] = unsuccessYear
        setunsuccessWordCntYear({ ...tempRating })

        tempRating['all'] = listenQuarter
        tempRating[languageLearning] = listenQuarter
        sethearingWinCntQuarter({ ...tempRating })
        tempRating['all'] = listenYear
        tempRating[languageLearning] = listenYear
        sethearingWinCntYear({ ...tempRating })

        tempRating['all'] = speakQuarter
        tempRating[languageLearning] = speakQuarter
        setspeakingWinCntQuarter({ ...tempRating })
        tempRating['all'] = speakYear
        tempRating[languageLearning] = speakYear
        setspeakingWinCntYear({ ...tempRating })

        tempRating['all'] = writeQuarter
        tempRating[languageLearning] = writeQuarter
        setwritingWinCntQuarter({ ...tempRating })
        tempRating['all'] = writeYear
        tempRating[languageLearning] = writeYear
        setwritingWinCntYear({ ...tempRating })

        tempRating['all'] = seeQuarter
        tempRating[languageLearning] = seeQuarter
        setsightWinCntQuarter({ ...tempRating })
        tempRating['all'] = seeYear
        tempRating[languageLearning] = seeYear
        setsightWinCntYear({ ...tempRating })

        tempRating['all'] = losslistenQuarter
        tempRating[languageLearning] = losslistenQuarter
        sethearingLossCntQuarter({ ...tempRating })
        tempRating['all'] = losslistenYear
        tempRating[languageLearning] = losslistenYear
        sethearingLossCntYear({ ...tempRating })

        tempRating['all'] = lossspeakQuarter
        tempRating[languageLearning] = lossspeakQuarter
        setspeakingLossCntQuarter({ ...tempRating })
        tempRating['all'] = lossspeakYear
        tempRating[languageLearning] = lossspeakYear
        setspeakingLossCntYear({ ...tempRating })

        tempRating['all'] = losswriteQuarter
        tempRating[languageLearning] = losswriteQuarter
        setwritingLossCntQuarter({ ...tempRating })
        tempRating['all'] = losswriteYear
        tempRating[languageLearning] = losswriteYear
        setwritingLossCntYear({ ...tempRating })

        tempRating['all'] = lossseeQuarter
        tempRating[languageLearning] = lossseeQuarter
        setsightLossCntQuarter({ ...tempRating })
        tempRating['all'] = lossseeYear
        tempRating[languageLearning] = lossseeYear
        setsightLossCntYear({ ...tempRating })

        console.log("Progress", progress);
        const errorQuarter = progress.filter(item => {
            if (item.result == false && item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                return true
            }
            return false
        })

        errorQuarter.sort((one, two) => {
            if (one.word > two.word) {
                return -1
            }
            return 1
        })

        const trueFalseErrorQuarter=progress.filter(item => {
            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                return true
            }
            return false
        });

        setGlobalTop10ErrorQuarter(trueFalseErrorQuarter);
        // setGlobalTop10ErrorQuarter(errorQuarter);

        // M-1
        
        // var current = null
        // var sortedError = [];
        // errorQuarter.map((item, index) => {
        //     if (current == null) {
        //         current = {
        //             word: item.word,
        //             count: item.count
        //         }
        //         sortedError.push(current)
        //         return;
        //     }

        //     if (item.word == current.word) {
        //         current.count += item.count
        //     } else {
        //         sortedError.push(current)
        //         current = {
        //             word: item.word,
        //             count: item.count
        //         }
        //         if (index === errorQuarter.length - 1) {
        //             sortedError.push(current)
        //         }
        //     }
        // })

        // sortedError.sort((one, two)=>{
        //     if(one.count > two.count){
        //         return -1
        //     }
        //     return 1
        // })

        //  M-2
        var uniqueWords = [];
        errorQuarter.forEach((item) => {
            if (!uniqueWords.includes(item.word)) {
                uniqueWords.push(item.word);
            }
        });

        var sortedError = [];
        uniqueWords.map((word) => {
            var count = 0;
            errorQuarter.forEach((item) => {
                if (item.word == word) {
                    count++;
                }
            })
            const current = {
                word: word,
                count: count
            }
            sortedError.push(current);
        });
        //Till Here

        sortedError.sort((one, two) => {
            return two.count - one.count
        })

        var errorWords = []
        errorWords[languageLearning] = [...new Set(sortedError)].map(item => {
            return item.word
        }).slice(0, 10)

        settop10ErrorWordsQuarter(errorWords)
        console.log("errorWords Quarter : ",errorWords);

        const errorYear = progress.filter(item => {
            if (item.result == false && item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                return true
            }
            return false
        })
        
        errorYear.sort((one, two) => {
            if (one.word > two.word) {
                return -1
            }
            return 1
        })

        const trueFalseErrorYear=progress.filter(item => {
            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                return true
            }
            return false
        });
        
        setGlobalTop10ErrorYear(trueFalseErrorYear);
        // setGlobalTop10ErrorYear(errorYear);

        // M-1

        // current = null
        // sortedError = []
        // errorYear.map((item, index) => {
        //     if (current == null) {
        //         current = {
        //             word: item.word,
        //             count: item.count
        //         }
        //         return
        //     }
        //     if (item.word == current.word) {
        //         current.count += item.count
        //     } else {
        //         sortedError.push(current)
        //         current = {
        //             word: item.word,
        //             count: item.count
        //         }
        //         if (index === errorQuarter.length - 1) {
        //             sortedError.push(current)
        //         }
        //     }
        // })

        // M-2
        var uniqueWords = [];
        errorYear.forEach((item) => {
            if (!uniqueWords.includes(item.word)) {
                uniqueWords.push(item.word);
            }
        });

        var sortedError = [];
        uniqueWords.map((word) => {
            var count = 0;
            errorYear.forEach((item) => {
                if (item.word == word) {
                    count++;
                }
            })
            const current = {
                word: word,
                count: count
            }
            sortedError.push(current);
        });
        // till here

        sortedError.sort((one, two) => {
            // if (one.count > two.count) {
            //     return -1
            // }
            // return 1
            return two.count - one.count
        })
        errorWords = []
        errorWords[languageLearning] = [...new Set(sortedError)].map(item => {
            return item.word
        }).slice(0, 10)
        settop10ErrorWordsYear(errorWords)

        console.log("errorWords Year : ",errorWords);
    }

    const getProgress = () => {
        firestore().collection('user').doc(user.uid).collection('progress').get().then(snapshot => {
            const progress = []
            for (const doc of snapshot.docs) {
                progress.push(doc.data())
            }
            console.log("Progress uid: ", progress);
            setGlobalProgress(progress);
            updateStatsUI(progress);
        })

        firestore().collection('user').doc(user.uid).collection('lesson').get().then(snapshot => {
            const lesson = []
            for (const doc of snapshot.docs) {
                lesson.push(doc.data())
            }
            var lessonQuarter = 0, lessonYear = 0
            var lessonCntQuarter = 0, lessonCntYear = 0
            lesson.map(item => {
                if (item.start > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                    if (item.end > item.start) {
                        lessonYear += item.end - item.start
                        lessonCntYear++
                    }
                    if (item.start > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                        if (item.end > item.start) {
                            lessonQuarter += item.end - item.start
                            lessonCntQuarter++
                        }
                    }
                }
            })
            const tempRating = {}
            tempRating['all'] = lessonQuarter
            tempRating[languageLearning] = lessonQuarter
            setLessonTimeQuarter({ ...tempRating })
            tempRating['all'] = lessonYear
            tempRating[languageLearning] = lessonYear
            setLessonTimeYear({ ...tempRating })

            tempRating['all'] = lessonCntQuarter
            tempRating[languageLearning] = lessonCntQuarter
            setcompLessonCntQuarter({ ...tempRating })
            tempRating['all'] = lessonCntYear
            tempRating[languageLearning] = lessonCntYear
            setcompLessonCntYear({ ...tempRating })
        })
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
                        const media = {
                            url,
                            type: 'profile',
                            content: 'image',
                            bookmark: false,
                            time: Date.now()
                        }
                        firestore().collection('user').doc(user.uid).collection('media').add(media).then(() => {
                            setAllMedia([...allMedia, media])
                            resolve(url)
                        })
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
    const handleProfilePic = () => {
        setvisibleModal(true)
        // ImagePicker.openPicker({
        //     cropping: true
        // }).then(image => {
        //     setLoading(true)
        //     storageUpload('media', image.path).then(url=>{
        //         setLoading(false)
        //         dispatch(setMypic(url))
        //     })
        // }).catch(err=>{
        //     setLoading(false)
        //     Toast.show(err.message)
        // })
    }
    const handleSex = sex => {
        dispatch(setSex(sex))
    }
    const handleLang = () => {
        setOpenLangModal(true)
    }
    const changeNativeLang = lang => {
        setOpenLangModal(false)
        const [languageLearning, languageNative] = (lang == 'English') ? ['Portuguese', 'English'] : ['English', 'Portuguese']
        firestore().collection('user').doc(user.uid).update({ languageLearning, languageNative }).then(() => {
            dispatch(setLang({ languageLearning, languageNative }))
            showMessage({
                message: `You will be learning ${languageLearning} now!`,
                description: 'Redirecting...',
                type: "success",
            });
        }).catch(error => {
            console.log(error.message)
        })
    }
    const handleNotify = notify => {
        dispatch(setNotify(notify))
    }
    const handleEditSave = () => {
        if (editDialog.type == 'name') {
            dispatch(setUsername(editDialog.text))
        } else if (editDialog.type == 'introduction') {
            dispatch(setIntroduction(editDialog.text))
        }
        setEditDialog({ type: null, visible: false, title: '', text: '' })
        return
    }
    const handleBookmark = (media) => {
        firestore().collection('user').doc(user.uid).collection('media').doc(media.key).update({ bookmark: !media.bookmark }).then(() => {
            const mediaArray = [...allMedia]
            mediaArray[media.index].bookmark = !mediaArray[media.index].bookmark
            setAllMedia(mediaArray)
        })

    }
    const listenRating = lessonDuration == 'quarter' ? listenRatingQuarter : listenRatingYear
    const speakRating = lessonDuration == 'quarter' ? speakRatingQuarter : speakRatingYear
    const writeRating = lessonDuration == 'quarter' ? writeRatingQuarter : writeRatingYear
    const seeRating = lessonDuration == 'quarter' ? seeRatingQuarter : seeRatingYear
    const vocabularyCnt = lessonDuration == 'quarter' ? vocabularyCntQuarter : vocabularyCntYear
    const successWordCnt = lessonDuration == 'quarter' ? successWordCntQuarter : successWordCntYear
    const unsuccessWordCnt = lessonDuration == 'quarter' ? unsuccessWordCntQuarter : unsuccessWordCntYear
    const compLessonCnt = lessonDuration == 'quarter' ? compLessonCntQuarter : compLessonCntYear
    const translationCnt = lessonDuration == 'quarter' ? translationCntQuarter : translationCntYear
    const hearingWinCnt = lessonDuration == 'quarter' ? hearingWinCntQuarter : hearingWinCntYear
    const hearingLossCnt = lessonDuration == 'quarter' ? hearingLossCntQuarter : hearingLossCntYear
    const speakingWinCnt = lessonDuration == 'quarter' ? speakingWinCntQuarter : speakingWinCntYear
    const speakingLossCnt = lessonDuration == 'quarter' ? speakingLossCntQuarter : speakingLossCntYear
    const writingWinCnt = lessonDuration == 'quarter' ? writingWinCntQuarter : writingWinCntYear
    const writingLossCnt = lessonDuration == 'quarter' ? writingLossCntQuarter : writingLossCntYear
    const sightWinCnt = lessonDuration == 'quarter' ? sightWinCntQuarter : sightWinCntYear
    const sightLossCnt = lessonDuration == 'quarter' ? sightLossCntQuarter : sightLossCntYear
    const top10ErrorWords = lessonDuration == 'quarter' ? top10ErrorWordsQuarter : top10ErrorWordsYear
    const lessonTime = lessonDuration == 'quarter' ? lessonTimeQuarter : lessonTimeYear

    const secs = Math.floor((lessonTime[lessonButton] % 60000) / 1000)
    const minutes = Math.floor((lessonTime[lessonButton] / 60000) % 60)
    const hours = Math.floor(((lessonTime[lessonButton] / 60000) / 60) % 60)
    const days = Math.floor((((lessonTime[lessonButton] / 60000) / 60) / 60) / 24)
    const durationString = days > 0 ? `${days} days` : `` + hours > 0 ? `${hours.toString().padStart(2, 0)}h` : `` + minutes > 0 ? `${minutes.toString().padStart(2, 0)}m` : `` + secs > 0 ? `${secs.toString().padStart(2, 0)}s` : ``

    const _slider1Ref = useRef()
    const [slider1ActiveSlide, setslider1ActiveSlide] = useState(1)
    const _renderItem = ({ item, index }) => {

        var even = (index + 1) % 2 === 0;

        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        var baseOne = viewportWidth;
        if (viewportHeight < viewportWidth) {
            baseOne = viewportHeight;
        }
        var frameWidth = baseOne * 0.3; //this should be same to itemWidth
        var frameHeight = baseOne * 0.25;
        var frameMargin = 0;

        return (
            <View style={{ width: frameWidth, height: frameHeight, padding: 5, backgroundColor: 'transparent' }}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: '100%',
                        height: '100%',
                        paddingHorizontal: frameMargin,
                        paddingBottom: 0
                    }}
                    onPress={() => {
                        const pics = profilePics.profilePics
                        for (var i = 0; i < pics.length; i++) {
                            if (pics[i].title == item.title) {
                                pics.splice(i, 1)
                                break
                            }

                        }
                        pics.push(item)
                        dispatch(setProfilePics(user.uid, pics))
                        setvisibleModal(false)
                    }}
                // onPress={this.FirstSelectGame} 
                >
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: frameMargin,
                        right: frameMargin,
                        bottom: 0,
                        shadowColor: colors.black,
                        shadowOpacity: 0.25,
                        shadowOffset: { width: 0, height: 10 },
                        shadowRadius: 10,
                        borderRadius: 0
                    }}
                    />
                    <View style={[{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 16,
                        backgroundColor: '#0076B6',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    },
                    even ? { backgroundColor: '#0076B6' } : { backgroundColor: '#0076B6' }]}>
                        <Text
                            style={[{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 7,
                                fontWeight: 'bold',
                                letterSpacing: 0.5
                            },
                            even ? { color: 'white' } : { color: 'white' }]}
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>
                        <Text
                            style={[{
                                height: 0,
                                marginTop: 0,
                                color: colors.gray,
                                fontSize: 12,
                                fontStyle: 'italic'
                            }, even ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: 'rgba(255, 255, 255, 0.7)' }]}
                            numberOfLines={2}
                        >
                            Something...
                        </Text>
                    </View>
                    <View style={[{
                        flex: 1,
                        marginBottom: 0, // Prevent a random Android rendering issue
                        backgroundColor: 'white',
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }, even ? { backgroundColor: '#ffffff' } : { backgroundColor: '#ffffff' }]}>
                        <Image
                            source={{ uri: item.illustration }}
                            style={{
                                width: 50,
                                height: 50,
                                resizeMode: 'cover',
                                borderRadius: 0,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0
                            }}
                        />
                        <View style={[{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 0,
                            backgroundColor: 'white'
                        },
                        even ? { backgroundColor: '#ffffff' } : { backgroundColor: '#ffffff' }]} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const updateCategoryWiseErrorValues = (word) => {
        const tempRating = {};
        var listenQuarter = 0, listenYear = 0
        var losslistenQuarter = 0, losslistenYear = 0
        var speakQuarter = 0, speakYear = 0
        var lossspeakQuarter = 0, lossspeakYear = 0
        var writeQuarter = 0, writeYear = 0
        var losswriteQuarter = 0, losswriteYear = 0
        var seeQuarter = 0, seeYear = 0
        var lossseeQuarter = 0, lossseeYear = 0

        if (lessonDuration == 'quarter') {
            let selectedErrorMapQuarter = globalTop10ErrorQuarter.filter((item) => {
                return item.word == word;
            });

            console.log("selectedErrorMapQuarter : ", selectedErrorMapQuarter);

            selectedErrorMapQuarter.map((item) => {
                if (item.lang == lang.languageLearning) {
                    if (item.mode == 'listen') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                listenYear++
                            } else {
                                losslistenYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    listenQuarter++
                                } else {
                                    losslistenQuarter++
                                }
                            }
                        }
                    } else if (item.mode == 'speak') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                speakYear++
                            } else {
                                lossspeakYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    speakQuarter++
                                } else {
                                    lossspeakQuarter++
                                }
                            }
                        }
                    } else if (item.mode == 'write') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                writeYear++
                            } else {
                                losswriteYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    writeQuarter++
                                } else {
                                    losswriteQuarter++
                                }
                            }
                        }

                    } else if (item.mode == 'see') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                seeYear++
                            } else {
                                lossseeYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    seeQuarter++
                                } else {
                                    lossseeQuarter++
                                }
                            }
                        }
                    }
                }
            });

            tempRating['all'] = listenQuarter
            tempRating[languageLearning] = listenQuarter
            sethearingWinCntQuarter({ ...tempRating })

            tempRating['all'] = speakQuarter
            tempRating[languageLearning] = speakQuarter
            setspeakingWinCntQuarter({ ...tempRating })

            tempRating['all'] = writeQuarter
            tempRating[languageLearning] = writeQuarter
            setwritingWinCntQuarter({ ...tempRating })

            tempRating['all'] = seeQuarter
            tempRating[languageLearning] = seeQuarter
            setsightWinCntQuarter({ ...tempRating })

            tempRating['all'] = losslistenQuarter
            tempRating[languageLearning] = losslistenQuarter
            sethearingLossCntQuarter({ ...tempRating })

            tempRating['all'] = lossspeakQuarter
            tempRating[languageLearning] = lossspeakQuarter
            setspeakingLossCntQuarter({ ...tempRating })

            tempRating['all'] = losswriteQuarter
            tempRating[languageLearning] = losswriteQuarter
            setwritingLossCntQuarter({ ...tempRating })

            tempRating['all'] = lossseeQuarter
            tempRating[languageLearning] = lossseeQuarter
            setsightLossCntQuarter({ ...tempRating })
        } else {
            let selectedErrorMapYear = globalTop10ErrorYear.filter((item) => {
                return item.word == word;
            });

            selectedErrorMapYear.map((item) => {
                if (item.lang == lang.languageLearning) {
                    if (item.mode == 'listen') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                listenYear++
                            } else {
                                losslistenYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    listenQuarter++
                                } else {
                                    losslistenQuarter++
                                }
                            }
                        }
                    } else if (item.mode == 'speak') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                speakYear++
                            } else {
                                lossspeakYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    speakQuarter++
                                } else {
                                    lossspeakQuarter++
                                }
                            }
                        }
                    } else if (item.mode == 'write') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                writeYear++
                            } else {
                                losswriteYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    writeQuarter++
                                } else {
                                    losswriteQuarter++
                                }
                            }
                        }

                    } else if (item.mode == 'see') {
                        if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 12)) {
                            if (item.result) {
                                seeYear++
                            } else {
                                lossseeYear++
                            }
                            if (item.time > (Date.now() - 1000 * 3600 * 24 * 30 * 3)) {
                                if (item.result) {
                                    seeQuarter++
                                } else {
                                    lossseeQuarter++
                                }
                            }
                        }
                    }
                }
            });

            tempRating['all'] = listenYear
            tempRating[languageLearning] = listenYear
            sethearingWinCntYear({ ...tempRating })

            tempRating['all'] = speakYear
            tempRating[languageLearning] = speakYear
            setspeakingWinCntYear({ ...tempRating })

            tempRating['all'] = writeYear
            tempRating[languageLearning] = writeYear
            setwritingWinCntYear({ ...tempRating })

            tempRating['all'] = seeYear
            tempRating[languageLearning] = seeYear
            setsightWinCntYear({ ...tempRating })

            tempRating['all'] = losslistenYear
            tempRating[languageLearning] = losslistenYear
            sethearingLossCntYear({ ...tempRating })

            tempRating['all'] = lossspeakYear
            tempRating[languageLearning] = lossspeakYear
            setspeakingLossCntYear({ ...tempRating })

            tempRating['all'] = losswriteYear
            tempRating[languageLearning] = losswriteYear
            setwritingLossCntYear({ ...tempRating })

            tempRating['all'] = lossseeYear
            tempRating[languageLearning] = lossseeYear
            setsightLossCntYear({ ...tempRating })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: colors.mainBackground }}>
                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={handleProfilePic}>
                                <Image source={{ uri: myPic }} style={{ height: 95, width: 95, borderColor: colors.button, borderWidth: 1, borderRadius: 47.5, resizeMode: 'cover' }} />
                                {/* <UserAvatar size='150' name={user.username} src={myPic} /> */}
                                {/* <Avatar
                                rounded
                                source={{uri: myPic}}
                                size={95}
                                imageProps={{resizeMode: 'stretch'}}
                            /> */}
                            </TouchableOpacity>
                            {/* <AntDesign
                                name='plus'
                                size={20}
                                style={{ position: 'absolute', top: 82, right: 8, backgroundColor: 'white', borderRadius: 10 }}
                                color={colors.blue}
                                onPress={handleProfilePic} /> */}
                        </View>
                        <View style={{ marginLeft: 40, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: colors.text }}>{languageNative}</Text>
                                    <Progress.Bar progress={1} width={20} />
                                </View>
                                <Text style={{ fontWeight: 'bold', color: colors.text }}>&gt;</Text>
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: colors.text }}>{languageLearning}</Text>
                                    <Progress.Bar progress={rating[languageLearning]} width={20} />

                                </View>
                            </View>
                            {/* {
                                loveCnt > 0 && */}
                            <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                <FontAwesome name='heart' size={20} color={'red'} />
                                <Text style={{ marginLeft: 5, fontSize: 14, fontWeight: 'bold', color: colors.text }}>{loveCnt}</Text>
                            </View>
                            {/* } */}
                            <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                <Ionicons name='md-videocam' size={22} color={'grey'} />
                                <Text style={{ marginLeft: 5, fontSize: 14, fontWeight: 'bold', color: colors.text }}>{postCnt}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ margin: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setEditDialog({ type: 'name', visible: true, title: 'Edit your name!', text: user.username })}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }}>{user.username}</Text></TouchableOpacity>
                            <Entypo name='edit' color={colors.blue} size={15} style={{ marginLeft: 5 }}
                                onPress={() => setEditDialog({ type: 'name', visible: true, title: 'Edit your name!', text: user.username })} />
                        </View>
                        {
                            user.introduction ?
                                <TouchableOpacity onPress={() => setEditDialog({ type: 'introduction', visible: true, title: 'Edit your introduction!', text: user.introduction })}>
                                    <Text style={{ marginVertical: 15, fontSize: 14, color: colors.text }}>{user.introduction}
                                        <Text> </Text>
                                        <Entypo name='edit' color={colors.blue} size={15} style={{ marginLeft: 10 }}
                                            onPress={() => setEditDialog({ type: 'introduction', visible: true, title: 'Edit your introduction!', text: user.introduction })} />
                                    </Text></TouchableOpacity> :
                                <Text style={{ marginVertical: 15, fontSize: 14, color: colors.text, fontStyle: 'italic' }}>Add your introduction here!
                                <Text> </Text>
                                    <Entypo name='edit' color={colors.blue} size={15} style={{ marginLeft: 10 }}
                                        onPress={() => setEditDialog({ type: 'introduction', visible: true, title: 'Edit your introduction!', text: '' })} />
                                </Text>
                        }
                        <SwitchSelector
                            style={{ width: 80 }}
                            initial={user.sex == 'male' ? 1 : 0}
                            height={30}
                            buttonColor={colors.blue}
                            borderColor={colors.blue}
                            options={[
                                { value: 'female', customIcon: <Ionicons name='md-female' size={20} color={user.sex == 'female' ? 'white' : 'grey'} /> },
                                { value: 'male', customIcon: <Ionicons name='md-male' size={20} color={user.sex == 'male' ? 'white' : 'grey'} /> },
                            ]}
                            onPress={handleSex} />
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Buy')}>
                        <Image resizeMode='contain' source={require('../assets/boost.png')} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <FontAwesome name='file-photo-o' size={20} color={segment == 'photo' ? 'black' : 'grey'} onPress={() => setSegment('photo')} />
                        <MaterialCommunityIcons name='chart-bar' size={20} color={segment == 'lesson' ? 'black' : 'grey'} onPress={() => setSegment('lesson')} />
                        <FontAwesome name='bookmark' size={20} color={segment == 'bookmark' ? 'black' : 'grey'} onPress={() => setSegment('bookmark')} />
                        <Ionicons name='md-settings' size={20} color={segment == 'setting' ? 'black' : 'grey'} onPress={() => setSegment('setting')} />
                    </View>
                    {
                        segment == 'photo' &&
                        <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setPhotoButton('all')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: photoButton == 'all' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>all</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPhotoButton('lessons')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: photoButton == 'lessons' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>lessons</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPhotoButton('pictures')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: photoButton == 'pictures' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>pictures</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPhotoButton('videos')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: photoButton == 'videos' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>videos</Text>
                            </TouchableOpacity>
                        </View>

                    }
                    {
                        segment == 'lesson' &&
                        <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setLessonButton('all')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: lessonButton == 'all' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>all</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                onPress={() => setLessonButton(languageNative)}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: lessonButton == languageNative ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>{languageNative}</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                onPress={() => setLessonButton(languageLearning)}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: lessonButton == languageLearning ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>{languageLearning}</Text>
                            </TouchableOpacity>
                            <Text style={{ width: 64, height: 20, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}></Text>
                            <Text style={{ width: 64, height: 20, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}></Text>
                        </View>

                    }
                    {
                        segment == 'bookmark' &&
                        <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setBookmarkButton('all')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: bookmarkButton == 'all' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>all</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setBookmarkButton('lessons')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: bookmarkButton == 'lessons' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>lessons</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setBookmarkButton('pictures')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: bookmarkButton == 'pictures' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>pictures</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setBookmarkButton('videos')}>
                                <Text style={{ width: 64, height: 20, backgroundColor: 'white', opacity: bookmarkButton == 'videos' ? 1 : 0.5, color: 'grey', textAlign: 'center', fontSize: 12, textAlignVertical: 'center' }}>videos</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {
                    segment == 'lesson' &&
                    <View style={{ margin: 0 }}>
                        <View style={{ margin: 20, paddingLeft: 30, paddingRight: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setLessionDuration('quarter')
                                        updateStatsUI(globalProgress);
                                        setSeletedErrorWord(100)
                                    }} >
                                    <Text style={{ fontSize: 12, color: lessonDuration == 'quarter' ? 'black' : colors.text }}>per/quarter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setLessionDuration('year')
                                        updateStatsUI(globalProgress);
                                        setSeletedErrorWord(100)
                                    }} >
                                    <Text style={{ fontSize: 12, color: lessonDuration == 'year' ? 'black' : colors.text, marginLeft: 20 }}>year</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, width: 80, color: 'black' }}>{languageNative}</Text>
                                <Slider
                                    style={{ flex: 1 }}
                                    thumbStyle={{ borderColor: colors.blue, borderWidth: 2, width: 15, height: 15 }}
                                    trackStyle={{ height: 2 }}
                                    value={1}
                                    disabled
                                    thumbTintColor='white'
                                    minimumTrackTintColor={colors.blue}
                                    maximumTrackTintColor={colors.opacityBlue}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, width: 80, color: lessonButton == languageLearning || lessonButton == 'all' ? 'black' : colors.text }}>{languageLearning}</Text>
                                <Slider
                                    style={{ flex: 1 }}
                                    thumbStyle={{ borderColor: colors.blue, borderWidth: 2, width: 15, height: 15 }}
                                    trackStyle={{ height: 2 }}
                                    value={rating[languageLearning]}
                                    disabled
                                    thumbTintColor='white'
                                    minimumTrackTintColor={colors.blue}
                                    maximumTrackTintColor={colors.opacityBlue}
                                />

                            </View>
                            {
                                lessonButton == languageLearning ?
                                    <View style={{ flexDirection: 'row', margin: 20 }}>
                                        <Progress.Circle
                                            progress={rating[languageLearning]}
                                            size={100}
                                            // color={colors.blue}
                                            unfilledColor={colors.opacityBlue}
                                            borderWidth={0}
                                            thickness={10}
                                            showsText={true}
                                            direction={'counter-clockwise'}
                                            formatText={progress => Math.round(rating[languageLearning] * 100) + '%'}
                                        />
                                        {
                                            successWordCnt[languageLearning] < 500 &&
                                            <View style={{ marginLeft: 20 }}>
                                                <Text style={[{ ...styles.text2 }, { fontWeight: 'bold' }]}>Beginner</Text>
                                                <Text style={styles.text2}>0 - 500 word</Text>
                                                <Text style={styles.text2}>vocabulary</Text>
                                            </View>

                                        }
                                        {
                                            successWordCnt[languageLearning] < 4000 && successWordCnt[languageLearning] > 1000 &&
                                            <View style={{ marginLeft: 20 }}>
                                                <Text style={[{ ...styles.text2 }, { fontWeight: 'bold' }]}>Intermediate</Text>
                                                <Text style={styles.text2}>1000 - 4000 word</Text>
                                                <Text style={styles.text2}>vocabulary</Text>
                                            </View>

                                        }
                                        {
                                            successWordCnt[languageLearning] < 10000 && successWordCnt[languageLearning] > 4000 &&
                                            <View style={{ marginLeft: 20 }}>
                                                <Text style={[{ ...styles.text2 }, { fontWeight: 'bold' }]}>Advanced</Text>
                                                <Text style={styles.text2}>4000 - 10,000 word</Text>
                                                <Text style={styles.text2}>vocabulary</Text>
                                            </View>

                                        }
                                        {
                                            successWordCnt[languageLearning] > 10000 &&
                                            <View style={{ marginLeft: 20 }}>
                                                <Text style={[{ ...styles.text2 }, { fontWeight: 'bold' }]}>Flent</Text>
                                                <Text style={styles.text2}>10,000+ word</Text>
                                                <Text style={styles.text2}>vocabulary</Text>
                                            </View>

                                        }
                                    </View>
                                    :
                                    null
                            }
                            <Text style={styles.subtitle}>Learning Styles</Text>
                            <View style={styles.lessonLine}>
                                <Text style={styles.text1}>Listen</Text>
                                <View style={{ justifyContent: 'center', flex: 1, height: 35 }}>
                                    <Text style={{ position: 'absolute', fontSize: 9, color: colors.blue, top: 0, left: (listenRating[lessonButton] * 100 - 8) + '%' }}>{listenRating[lessonButton] * 100}%</Text>
                                    <Progress.Bar progress={listenRating[lessonButton]} width={null} height={10} />
                                </View>
                            </View>
                            <View style={styles.lessonLine}>
                                <Text style={styles.text1}>Speak</Text>
                                <View style={{ justifyContent: 'center', flex: 1, height: 35 }}>
                                    <Text style={{ position: 'absolute', fontSize: 9, color: colors.blue, top: 0, left: (speakRating[lessonButton] * 100 - 8) + '%' }}>{speakRating[lessonButton] * 100}%</Text>
                                    <Progress.Bar progress={speakRating[lessonButton]} width={null} height={10} />
                                </View>
                            </View>
                            <View style={styles.lessonLine}>
                                <Text style={styles.text1}>Write</Text>
                                <View style={{ justifyContent: 'center', flex: 1, height: 35 }}>
                                    <Text style={{ position: 'absolute', fontSize: 9, color: colors.blue, top: 0, left: (writeRating[lessonButton] * 100 - 8) + '%' }}>{writeRating[lessonButton] * 100}%</Text>
                                    <Progress.Bar progress={writeRating[lessonButton]} width={null} height={10} />
                                </View>
                            </View>
                            <View style={styles.lessonLine}>
                                <Text style={styles.text1}>See</Text>
                                <View style={{ justifyContent: 'center', flex: 1, height: 35 }}>
                                    <Text style={{ position: 'absolute', fontSize: 9, color: colors.blue, top: 0, left: (seeRating[lessonButton] * 100 - 8) + '%' }}>{seeRating[lessonButton] * 100}%</Text>
                                    <Progress.Bar progress={seeRating[lessonButton]} width={null} height={10} />
                                </View>
                            </View>
                        </View>
                        <View style={{ marginLeft: 20, marginRight: 20 }}>
                            <Text style={styles.subtitle}>Word stats</Text>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#8221E6', '#A149E5', '#DC85E4']}
                                style={{ width: '100%', padding: 20, height: (deviceWidth / 2) - 50, marginTop: 20, borderRadius: 20, justifyContent: 'space-between' }}>

                                <Text style={styles.text3}>Vocabulary</Text>
                                <Text style={styles.text4}>{vocabularyCnt[lessonButton]}</Text>
                                <Text style={styles.text3}>Completed</Text>

                            </LinearGradient>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#4AE671', '#65F17D', '#88FE8C']}
                                    style={styles.gradient1}>

                                    <Text style={styles.text3}>Attempt</Text>
                                    <Text style={styles.text4}>{successWordCnt[lessonButton]}</Text>
                                    <Text style={styles.text3}>Success</Text>

                                </LinearGradient>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#D85974', '#D7808D', '#D79D9F']}
                                    style={styles.gradient1}>

                                    <Text style={styles.text3}>Attempt</Text>
                                    <Text style={styles.text4}>{unsuccessWordCnt[lessonButton]}</Text>
                                    <Text style={styles.text3}>Non - Success</Text>

                                </LinearGradient>

                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#E9D845', '#EAD977', '#EBD99C']}
                                    style={styles.gradient1}>

                                    <Text style={styles.text3}>Lessons</Text>
                                    <Text style={styles.text4}>{compLessonCnt[lessonButton]}</Text>
                                    <Text style={styles.text3}>Completed</Text>

                                </LinearGradient>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#3B96FD', '#449DFD', '#4AA1FD']}
                                    style={styles.gradient1}>

                                    <Text style={styles.text3}>Translations</Text>
                                    <Text style={styles.text4}>{translationCnt[lessonButton]}</Text>
                                    <Text style={styles.text3}>Used</Text>

                                </LinearGradient>

                            </View>
                        </View>
                        {
                            lessonButton == languageLearning ?
                                <>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.subtitle}>Time spent</Text>
                                            <Text style={[{ ...styles.text2 }, { textAlign: 'center' }]}>
                                                {durationString}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.subtitle}>Study buddies</Text>
                                            <Text style={[{ ...styles.text2 }, { textAlign: 'center' }]}>{buddies}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.subtitle}>Priority list</Text>
                                    <View style={{ marginLeft: 50, marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <View>
                                            <View
                                                style={{ alignItems: 'center', width: (deviceWidth / 2) - 30, height: (deviceWidth / 2) - 50, marginTop: 20 }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#3B96FD', '#449DFD', '#4AA1FD']}
                                                    style={styles.gradient2}>
                                                    <Text style={styles.text3}>Hearing</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {hearingWinCnt[lessonButton]}
                                                        </Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            win
                                                </Text>
                                                    </View>

                                                </LinearGradient>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#D85974', '#D7808D', '#D79D9F']}
                                                    style={styles.gradient3}>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {hearingLossCnt[lessonButton]}
                                                        </Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            loss</Text>
                                                    </View>

                                                </LinearGradient>

                                            </View>
                                            <View
                                                style={{ alignItems: 'center', width: (deviceWidth / 2) - 30, height: (deviceWidth / 2) - 50, marginTop: 10 }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#3B96FD', '#449DFD', '#4AA1FD']}
                                                    style={styles.gradient2}>
                                                    <Text style={styles.text3}>Speaking</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {speakingWinCnt[lessonButton]}</Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            win</Text>
                                                    </View>

                                                </LinearGradient>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#D85974', '#D7808D', '#D79D9F']}
                                                    style={styles.gradient3}>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {speakingLossCnt[lessonButton]}</Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            loss</Text>
                                                    </View>

                                                </LinearGradient>

                                            </View>
                                            <View
                                                style={{ alignItems: 'center', width: (deviceWidth / 2) - 30, height: (deviceWidth / 2) - 50, marginTop: 10 }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#3B96FD', '#449DFD', '#4AA1FD']}
                                                    style={styles.gradient2}>
                                                    <Text style={styles.text3}>Writing</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {writingWinCnt[lessonButton]}</Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            win</Text>
                                                    </View>

                                                </LinearGradient>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#D85974', '#D7808D', '#D79D9F']}
                                                    style={styles.gradient3}>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {writingLossCnt[lessonButton]}</Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            loss</Text>
                                                    </View>

                                                </LinearGradient>

                                            </View>
                                            <View
                                                style={{ alignItems: 'center', width: (deviceWidth / 2) - 30, height: (deviceWidth / 2) - 50, marginTop: 10 }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#3B96FD', '#449DFD', '#4AA1FD']}
                                                    style={styles.gradient2}>
                                                    <Text style={styles.text3}>Sight</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {sightWinCnt[lessonButton]}</Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            win</Text>
                                                    </View>

                                                </LinearGradient>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#D85974', '#D7808D', '#D79D9F']}
                                                    style={styles.gradient3}>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={[{ ...styles.text4 }, { flex: 1, textAlign: 'center' }]}>
                                                            {sightLossCnt[lessonButton]}</Text>
                                                        <Text style={[{ ...styles.text3 }, { flex: 1, textAlign: 'center' }]}>
                                                            loss</Text>
                                                    </View>

                                                </LinearGradient>

                                            </View>

                                        </View>
                                        <View style={{ marginLeft: 20, flex: 1 }}>
                                            <Text style={[{ ...styles.text2Bold }, { marginTop: 20, marginBottom: 20 }]}>Top 10 errors</Text>
                                            <View style={{ flex: 1 }}>
                                                {
                                                    top10ErrorWords[lessonButton].map((word, index) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={{ width: '100%', marginVertical: 5, backgroundColor: index == seletedErrorWord ? 'white' : 'transparent' }}
                                                                onPress={() => {
                                                                    updateCategoryWiseErrorValues(word);
                                                                    setSeletedErrorWord(index)
                                                                }}>
                                                                <Text style={styles.text2}>{word}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </>
                                :
                                null
                        }
                    </View>
                }
                {
                    segment == 'setting' &&
                    <>
                        <View style={{ backgroundColor: 'white', padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: colors.text }}>Native Language:</Text>
                                <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                    <Text style={{ color: colors.text }}>{lang.languageNative}</Text>
                                    <EvilIcons color="gray" size={30} name='chevron-down'
                                        onPress={handleLang} />
                                </View>
                                {/* <RNPickerSelect
                            placeholder={{}}
                            value={lang.languageNative}
                            style={{inputAndroid: styles.pickerStyles, inputIOS: styles.pickerStyles, iconContainer: {top: 15, right: 15}}}
                            // onValueChange={handleRefreshTime}
                            useNativeAndroidPickerStyle={false}
                            Icon={() => {
                                return <Chevron size={1.5} color="gray" />;
                            }}
                            items={[
                                {label: 'English', value: 'English'},
                                {label: 'Portuguese', value: 'Portuguese'},
                            ]}/> */}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={{ color: colors.text }}>Notifications</Text>
                                <SwitchSelector
                                    style={{ width: 70 }}
                                    initial={user.notify}
                                    height={30}
                                    // backgroundColor={colors.blue}
                                    buttonColor={'gainsboro'}
                                    // valuePadding={0}
                                    hasPadding={true}
                                    options={[
                                        { label: '', value: 0, },
                                        { label: '', value: 1, activeColor: colors.blue },
                                    ]}
                                    onPress={handleNotify} />

                            </View>
                        </View>
                        <Text style={styles.text5}>Notice: This is permanent</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: '#D83138', borderRadius: 10, marginTop: 5, padding: 15, marginHorizontal: 30 }}
                            onPress={() => setRemoveModalVisible(true)}
                        >
                            <Text style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>Delete Account</Text>
                        </TouchableOpacity>

                    </>
                }
                {
                    segment == 'photo' &&
                    <>
                        {photoButton == 'all' && <ImageGrid all={true} segment={segment} media={allMedia} callbackBookmark={handleBookmark} />}
                        {photoButton == 'lessons' && <ImageGrid all={true} segment={segment} media={lessonsMedia} callbackBookmark={handleBookmark} />}
                        {photoButton == 'pictures' && <ImageGrid all={true} segment={segment} media={picturesMedia} callbackBookmark={handleBookmark} />}
                        {photoButton == 'videos' && <ImageGrid all={true} segment={segment} media={videosMedia} callbackBookmark={handleBookmark} />}
                    </>
                }
                {
                    segment == 'bookmark' &&
                    <>
                        {bookmarkButton == 'all' && <ImageGrid all={false} segment={segment} media={bookmarkAllMedia} callbackBookmark={handleBookmark} />}
                        {bookmarkButton == 'lessons' && <ImageGrid all={false} segment={segment} media={bookmarkLessonsMedia} callbackBookmark={handleBookmark} />}
                        {bookmarkButton == 'pictures' && <ImageGrid all={false} segment={segment} media={bookmarkPicturesMedia} callbackBookmark={handleBookmark} />}
                        {bookmarkButton == 'videos' && <ImageGrid all={false} segment={segment} media={bookmarkVideosMedia} callbackBookmark={handleBookmark} />}
                    </>
                }
            </ScrollView>
            <Spinner visible={loading} />
            <LangModal
                visible={openLangModal}
                resetVisible={() => setOpenLangModal(false)}
                changeLanguage={changeNativeLang}
                title={'Native language'}
            />
            <AwesomeAlert
                show={removeModalVisible}
                showProgress={false}
                message='Are you sure to remove this account?'
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    setRemoveModalVisible(false)
                }}
                onConfirmPressed={async () => {
                    setRemoveModalVisible(false)
                    await auth().signOut();
                    navigation.navigate('Home');
                    // dispatch(logout())
                    // firestore().collection('user').doc(user.uid).delete().then(()=>{
                    //     dispatch(logout())
                    // })
                }}
            />
            <Dialog
                visible={editDialog.visible}
                title={editDialog.title}
                keyboardShouldPersistTaps={'handled'}
            >
                <TextInput
                    style={{ backgroundColor: colors.mainBackground }}
                    value={editDialog.text}
                    autoFocus={true}
                    maxLength={150}
                    onChangeText={text => setEditDialog({ ...editDialog, text })}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                    <TouchableOpacity
                        style={{ padding: 10, alignItems: 'center', backgroundColor: colors.blue }}
                        onPress={handleEditSave}>
                        <Text style={{ color: 'white' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ padding: 10, alignItems: 'center', borderColor: colors.blue, borderWidth: 1 }}
                        onPress={() => setEditDialog({ type: null, visible: false, title: '', text: '' })}>
                        <Text style={{ color: colors.blue }}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </Dialog>
            <Modal
                backdropColor={'black'}
                backdropOpacity={0.5}
                animationType="slide"
                transparent={true}
                isVisible={visibleModal}
                onBackdropPress={() => setvisibleModal(false)}
            >
                <View style={{ marginLeft: '10%', marginRight: '10%', width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '80%', backgroundColor: 'white' }}>
                        <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                            <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                                <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                    {strings('Profile.select_picture')}
                                </Text>
                            </View>
                            <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    setvisibleModal(false)
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

                        {/* <Text style={{ fontSize:20, fontWeight:'bold', color:'black' }}>{title}</Text> */}
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Carousel
                                ref={_slider1Ref}
                                data={profilePics.profilePics}
                                renderItem={_renderItem}
                                sliderWidth={deviceWidth}
                                itemWidth={deviceWidth * 0.3}
                                // hasParallaxImages={true}
                                firstItem={profilePics.profilePics.length - 1}
                                inactiveSlideScale={0.94}
                                inactiveSlideOpacity={0.5}
                                // inactiveSlideShift={20}
                                containerCustomStyle={{ backgroundColor: 'transparent', marginTop: 15, overflow: 'visible' }}
                                contentContainerCustomStyle={{ paddingVertical: 10 }}
                                loop={true}
                                loopClonesPerSide={2}
                                //   autoplay={true}
                                autoplayDelay={500}
                                autoplayInterval={3000}
                                onSnapToItem={(index) => setslider1ActiveSlide(index)}
                            />
                        </View>
                        <View style={{ width: '100%', height: 20 }}></View>
                    </ElevatedView>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    subtitle: {
        alignItems: 'center', textAlign: 'center', fontSize: 20, color: colors.text, marginTop: 20
    },
    lessonLine: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10
    },
    text1: {
        fontSize: 16, color: colors.text, width: 80
    },
    text2: {
        fontSize: 14, color: colors.text
    },
    text2Bold: {
        fontSize: 14, color: colors.text, fontWeight: 'bold'
    },
    text3: {
        fontSize: 16, color: 'white'
    },
    text4: {
        fontSize: 28, color: 'white'
    },
    text5: {
        fontSize: 10, color: colors.text, textAlign: 'center', marginTop: 20
    },
    gradient1: {
        width: (deviceWidth / 2) - 30, padding: 20, height: (deviceWidth / 2) - 50, marginTop: 20, borderRadius: 20, justifyContent: 'space-between'
    },
    gradient2: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20, flex: 3, width: '100%', justifyContent: 'flex-end', alignItems: 'center'
    },
    gradient3: {
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flex: 2, width: '100%', justifyContent: 'flex-start', alignItems: 'center'
    },
    pickerStyles: {
        color: 'black',
        borderWidth: 1,
        borderRadius: 4,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 30,
    }
})