import React, {useState, useEffect, useContext, useRef} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native'
import { NavigationContext } from 'react-navigation'
import { Button, Slider } from 'react-native-elements'
import {useDispatch} from 'react-redux'
import { showMessage, hideMessage } from "react-native-flash-message"

import {handleGo} from './Common'
import { styles, colors, viewportWidth } from '../../static/constant'
import {setXp} from '../../redux/action'

export default function Introductions() {
    const dispatch = useDispatch()
    const navigation = useContext(NavigationContext)
    const card = navigation.getParam('oneCard')
    const gameCards = navigation.getParam('gameCards')
    const gameData = navigation.getParam('gameData')
    console.log("gameData.cards ", gameData.cards);
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.mainBackground,
            padding: 20
        }}>
            <Slider
                value={(gameData.cards-gameCards.length-1)/gameData.cards}
                thumbTintColor='#FF7F00'
                minimumTrackTintColor='#006780'
                maximumTrackTintColor='#1EA2BC'
            />
            <View style={{ marginBottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text>{gameData.cards - gameCards.length}/{gameData.cards}</Text>
            </View>
            <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>{gameData.gameName}</Text>
            <Text style={{fontSize: 18}}>{card.yourmessage}</Text>
            <Image source={{uri: gameData.image}} resizeMode='contain' style={{flex: 1}}/>
            <View style={{margin: 10, alignItems: 'center'}}>
            <Button
                title="Let's go"
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
        </View>
    )
}
