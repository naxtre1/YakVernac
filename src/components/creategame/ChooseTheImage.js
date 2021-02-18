import React, {useState, useEffect, useContext, useRef} from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import { NavigationContext } from 'react-navigation'
import { Button, Slider } from 'react-native-elements'
import Modal from "react-native-modal"
import {useDispatch, useSelector} from 'react-redux'
import { showMessage, hideMessage } from "react-native-flash-message"

import {handleGo, success, fail, gameEarning} from './Common'
import { styles, colors, viewportWidth } from '../../static/constant'
import {shuffle, maxCards} from '../../static/constant'
import { strings } from '../../locales/i18n'
import {setXp} from '../../redux/action'

export default function ChooseTheImage() {
    const navigation = useContext(NavigationContext)
    const dispatch = useDispatch()
    const card = navigation.getParam('oneCard')
    const user = useSelector(state=>state.user)
    const xp = useSelector(state=>state.xp)
    const images = [card.image, card.image1, card.image2, card.image3]
    shuffle(images)
    const gameCards = navigation.getParam('gameCards')
    const gameData = navigation.getParam('gameData')
    const CheckIfCorrect = image => {
        if (image == card.image) {
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
            paddingTop: 20,
            paddingBottom: 20
        }}>
            <ScrollView style={{paddingLeft: 20, paddingRight: 20}}>
            <Slider
                value={(gameData.cards-gameCards.length-1)/gameData.cards}
                thumbTintColor='#FF7F00'
                minimumTrackTintColor='#006780'
                maximumTrackTintColor='#1EA2BC'
            />
            <View style={{ marginBottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text>{gameData.cards - gameCards.length}/{gameData.cards}</Text>
            </View>
            <View style={{ marginBottom: 6, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F00' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{card.yourmessage}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
                aspectRatio: 1,
            }}>
                {images.map((image, index) => (
                    <View style={{
                        width: '50%',
                        aspectRatio: 1,
                        paddingTop: index < 2 ? 0 : 3,
                        paddingBottom: index < 2 ? 3 : 0,
                        paddingLeft: (index % 2) == 1 ? 3 : 0,
                        paddingRight: (index % 2) == 0 ? 3 : 0,
                    }}>
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                height: '100%',
                                aspectRatio: 1,
                            }} key={index} onPress={() => CheckIfCorrect(image)}>
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    height: '100%',
                                    width: '100%',
                                    borderWidth: 1,
                                    //borderRadius: 95
                                }}
                                source={{ uri: image }}
                            // resizeMode="stretch"
                            />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={{margin: 10, alignItems: 'center'}}>
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