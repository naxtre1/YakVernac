import React, { useState, useEffect, useContext, useRef } from 'react'
import { Button, Slider } from 'react-native-elements'
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    Platform,
} from 'react-native'
import Toast from 'react-native-simple-toast'
import { NavigationContext } from 'react-navigation'
import { useDispatch, useSelector } from 'react-redux'
import SoundPlayer from 'react-native-sound-player'
import { showMessage, hideMessage } from "react-native-flash-message"
import Voice from '@react-native-community/voice'
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'

import { handleGo, success, fail, speakNow, gameEarning } from './Common'
import { styles, colors, viewportWidth } from '../../static/constant'
import { shuffle, maxCards } from '../../static/constant'
import { strings } from '../../locales/i18n'
import { setXp } from '../../redux/action'
import SimpleToast from 'react-native-simple-toast'

export default function SayTheImage() {
    const dispatch = useDispatch()
    const navigation = useContext(NavigationContext)
    const card = navigation.getParam('oneCard')
    const gameCards = navigation.getParam('gameCards')
    const [started, setStarted] = useState('')
    const [end, setEnd] = useState('')
    const lang = useSelector(state => state.lang)
    const [speechResult, setSpeechResult] = useState([])
    const user = useSelector(state => state.user)
    const xp = useSelector(state => state.xp)
    const gameData = navigation.getParam('gameData')
    Voice.onSpeechStart = () => {
        console.log('onSpeechStart')
        setStarted('√')
    }
    Voice.onSpeechRecognized = () => {
        console.log('onSpeechRecognized')
    }
    Voice.onSpeechEnd = () => {
        console.log('onSpeechEnd')
        setEnd('√')
    }
    Voice.onSpeechError = (e) => {
        console.log('onSpeechError')
        console.log(e)
    }
    Voice.onSpeechResults = (e) => {
        setSpeechResult(e.value)

        SimpleToast.show('Speech Results : ' + e.value.join(', '), SimpleToast.LONG);
    }
    Voice.onSpeechPartialResults = () => {
    }
    Voice.onSpeechVolumeChanged = () => {
    }
    const startRecognizing = () => {
        if (Platform.OS == 'android') {
            check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
                if (result == RESULTS.GRANTED) {
                    start()
                } else {
                    Toast.show('Permission not granted!')
                }
            })
        } else {
            start()
        }
    }
    const start = async () => {
        setStarted('')
        setEnd('')
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
    const destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e.message);
        }

    }
    const CheckIfCorrect = () => {
        console.log("speechresult", speechResult);
        console.log("card", card);

        let firebaseResults = [];
        if (card.yourmessage != undefined && card.yourmessage.length > 0) {
            card.yourmessage.forEach((item) => {
                firebaseResults.push(item.toLowerCase().trim());
            });
        }

        console.log("card.yourmessage", card.yourmessage);
        console.log("firebaseResults", firebaseResults);
        if (card.yourmessage != undefined && speechResult.some(result => firebaseResults.indexOf(result.toLowerCase().trim()) >= 0)) {
            success(navigation)
            dispatch(setXp(user.uid, xp + gameEarning))
            handleGo(navigation, dispatch)
        } else {
            fail(navigation)
            handleGo(navigation, dispatch)
        }

        // if (card.yourmessage != undefined && speechResult.some(result => card.yourmessage.indexOf(result.toLowerCase()) >= 0)) {
        //     success(navigation)
        //     dispatch(setXp(user.uid, xp + gameEarning))
        //     handleGo(navigation, dispatch)
        // } else {
        //     fail(navigation)
        //     handleGo(navigation, dispatch)
        // }
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.mainBackground,
        }}>
            <ScrollView style={{ padding: 20 }}>
                <Slider
                    value={(gameData.cards - gameCards.length - 1) / gameData.cards}
                    thumbTintColor='#FF7F00'
                    minimumTrackTintColor='#006780'
                    maximumTrackTintColor='#1EA2BC'
                />
                <View style={{ marginBottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text>{gameData.cards - gameCards.length}/{gameData.cards}</Text>
                </View>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FD751C' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                        {strings('SayTheImage.say_the')}
                    </Text>
                </View>
                <View style={{ width: '100%', paddingTop: 5 }}>
                    <TouchableHighlight onPress={() => { () => speakNow(card.audio) }}>
                        <Image
                            style={{
                                alignSelf: 'center',
                                height: 250,
                                width: '100%',
                                borderWidth: 1,
                                //borderRadius:5,
                            }}
                            source={{ uri: card.image }}
                            resizeMode="cover"
                        />
                    </TouchableHighlight>
                </View>
                <View style={{ paddingVertical: 5, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333' }} >
                        {strings('SayTheImage.say_the_word')}
                    </Text>
                </View>
                <Text style={styles.stat}>
                    {`${strings('SayTheImage.started')}: ${started}`}
                </Text>
                <Text style={styles.stat}>
                    {`${strings('SayTheImage.ended')}: ${end}`}
                </Text>
                <View style={{ marginVertical: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={startRecognizing}>
                        <Image
                            style={styles.button}
                            source={require('./../../assets/button.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        title={strings('SayTheImage.reset')}
                        textStyle={{
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}
                        buttonStyle={{
                            backgroundColor: '#006780',
                            width: 150,
                            height: 30,
                        }}
                        onPress={destroyRecognizer} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 35, width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Button
                        title={strings('GamesCommon.validate')}
                        textStyle={{
                            fontSize: 24,
                            fontWeight: 'bold'
                        }}
                        buttonStyle={{
                            backgroundColor: '#1EA2BC',
                            width: 150,
                            height: 45,
                        }}
                        onPress={() => CheckIfCorrect()} />
                    <Button
                        title='skip'
                        textStyle={{
                            fontSize: 24,
                            fontWeight: 'bold'
                        }}
                        buttonStyle={{
                            backgroundColor: '#1EA2BC',
                            width: 150,
                            height: 45,
                        }}
                        onPress={() => handleGo(navigation, dispatch)}>
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}