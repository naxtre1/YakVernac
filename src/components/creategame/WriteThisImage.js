import React, {useState, useEffect, useContext, useRef} from 'react'
import { Button, Slider } from 'react-native-elements'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import { NavigationContext } from 'react-navigation'
import {useDispatch, useSelector} from 'react-redux'
import { showMessage, hideMessage } from "react-native-flash-message"

import {handleGo, success, fail, gameEarning} from './Common'
import { styles, colors, viewportWidth } from '../../static/constant'
import {shuffleString, maxCards} from '../../static/constant'
import { strings } from '../../locales/i18n'
import {setXp} from '../../redux/action'

export default function WriteThisImage() {
    const dispatch = useDispatch()
    const navigation = useContext(NavigationContext)
    const card = navigation.getParam('oneCard')
    const gameCards = navigation.getParam('gameCards')
    const [finalArray, setFinalArray] = useState('')
    const [letters, setLetters] = useState(shuffleString(card.youranswer))
    const user = useSelector(state=>state.user)
    const xp = useSelector(state=>state.xp)
    const gameData = navigation.getParam('gameData')
    const addToArray = (letter, index) => {
        setFinalArray(finalArray+letter)
        setLetters(letters.slice(0, index)+letters.slice(index+1))
    }
    const deleteFromArray = (index, letter) => {
        setFinalArray(finalArray.slice(0, index)+finalArray.slice(index+1))
        setLetters(letters+letter)
    }
    const CheckIfCorrect = () => {
        if (finalArray == card.youranswer) {
            success(navigation)
            dispatch(setXp(user.uid, xp+gameEarning))
        } else {
            fail(navigation)
        }
        handleGo(navigation, dispatch)
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.mainBackground,
        }}>
            <ScrollView style={{padding: 20}}>
            <Slider
                value={(gameData.cards-gameCards.length-1)/gameData.cards}
                thumbTintColor='#FF7F00'
                minimumTrackTintColor='#006780'
                maximumTrackTintColor='#1EA2BC'
            />
            <View style={{ marginBottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text>{gameData.cards - gameCards.length}/{gameData.cards}</Text>
            </View>
            <View style={{width:'100%', justifyContent:'center',alignItems:'center', backgroundColor:'#FD751C'}}>
              <Text style={{fontSize:20, fontWeight:'bold', color:'white'}}>
                {strings('WriteTheImage.guess_image')}
              </Text>
            </View>
            <View style={{width:'100%', paddingTop:5}}>
                <Image
                    style={{
                    alignSelf: 'center',
                    height: 250,
                    width: '100%',
                    borderWidth: 1,
                    //borderRadius:5,
                    }}
                    source={{uri: card.image}}
                    resizeMode="cover"
                />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {[...letters].map((letter, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={()=>addToArray(letter, index)}
                    >
                        <View style={{ marginHorizontal: 2, marginVertical: 5, width: 25, height: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2496BE' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>{letter}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={{ marginTop: 10, }}>{strings('GamesCommon.your_response')}</Text>
            <View style={{ marginBottom: 20, width: '100%', height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {[...finalArray].map((letter, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={()=>deleteFromArray(index, letter)}
                            >
                            <Text style={{ padding: 5, fontSize: 20 }}>{letter}</Text>
                        </TouchableOpacity>

                    ))}
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 35, width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
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