import React, { useState, useEffect, useContext, useRef } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import { NavigationContext } from 'react-navigation'
import { Button, Slider } from 'react-native-elements'

import { strings } from '../../locales/i18n'

export default function ThanksGame() {
    const navigation = useContext(NavigationContext)
    const gameData = navigation.getParam('gameData')
    const allCorrect = gameData['allCorrect']
    return (
        <View style={{ width: '100%', height: '100%', paddingHorizontal: 30, paddingTop: 15, backgroundColor: '#C3E3E4' }}>
            <View style={{ width: '100%', height: '80%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FB5A3A', marginTop: 20 }}>{strings('GamesCommon.thanks_for')}</Text>
                <Text style={{ marginTop: 27, fontSize: 24, color: '#2496BE' }}>{strings('GamesCommon.you_earned', { name: allCorrect })}</Text>
            </View>
            <View style={{ width: '100%', height: 45 }}></View>
            <View style={{ width: '100%', height: 45, justifyContent: 'flex-start', alignItems: 'center' }} >
                <View style={{ width: '96%', height: 45, }} >
                    <Button
                        title={strings('GamesCommon.exit_game')}
                        textStyle={{
                            fontSize: 24,
                            fontWeight: 'bold'
                        }}
                        buttonStyle={{
                            backgroundColor: '#FF7F00',
                            width: '100%',
                            height: 45,
                        }}
                        onPress={() => navigation.pop()} />
                </View>
            </View>
            <View style={{ width: '100%', height: 45 }}></View>
        </View>

    )
}