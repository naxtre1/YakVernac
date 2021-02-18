import SoundPlayer from 'react-native-sound-player'
import { showMessage, hideMessage } from "react-native-flash-message"

import { strings } from '../../locales/i18n'
import {setLang} from '../../redux/action'


export const handleGo = (navigation, dispatch) => {
    const gameCards = navigation.getParam('gameCards')
    const gameData = navigation.getParam('gameData')
    var oneCard = gameCards.pop()
    if (oneCard) {
        navigation.replace(oneCard.type, {oneCard, gameCards, gameData})
    } else {
        dispatch(setLang(gameData.prevLang))
        navigation.replace('ThanksGame', {gameData})
    }
}

export const speakNow = audio => {
    SoundPlayer.playUrl(audio)
}

export const success = navigation => {
    const gameData = navigation.getParam('gameData')
    gameData['allCorrect'] = gameData['allCorrect']+1
    showMessage({
        message: strings('GamesCommon.correct'),
        description: strings('GamesCommon.sucess_desc'),
        type: "success",
    });
}

export const fail = navigation => {
    showMessage({
        message: strings('GamesCommon.wrong'),
        description: strings('GamesCommon.better_luck'),
        type: "danger",
    });

}

export const gameEarning = 1