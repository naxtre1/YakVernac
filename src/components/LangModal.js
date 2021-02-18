import React, {useState, useEffect, useContext, useRef} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Button
} from 'react-native'
import { Icon } from 'react-native-elements'
import ElevatedView from 'react-native-elevated-view'
import Modal from "react-native-modal"
import { strings } from '../locales/i18n'

export default function LangModal({visible, resetVisible, changeLanguage, title}) {
   
    return (
       
        <Modal
            backdropColor={'black'}
            backdropOpacity={0.5}
            animationType="slide"
            transparent={true}
            isVisible={visible}
            onBackdropPress={resetVisible}
        >
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '100%', backgroundColor: 'white' }}>
                    <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                        <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                            <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                {/* Translation */}
                            </Text>
                        </View>
                      
                        <View style={{ position: 'absolute', width: '100%', height: 45, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                {title}
                            </Text>
                        </View>
                        <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                            <TouchableOpacity   onPress={resetVisible }> 
                                <Icon
                                    color='white'
                                    size={25}
                                    name='circle-with-cross'
                                    type='entypo'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 230, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableHighlight onPress={() => changeLanguage('Portuguese')}>
                                {/* <Text style={{ marginTop: 20, paddingBottom: 0, marginBottom: 0, fontWeight: 'bold', color: '#F68D3D', alignSelf: 'center' }}> */}
                                <Image
                                    // source={{ uri: "https://www.waybrasil.net/uploaded/WAY_Brazil/Brazil_Logo.png" }}
                                    source={require('../assets/brazil.png')}
                                    style={{ width: 100, height: 100 }}
                                />
                                {/* </Text> */}
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => changeLanguage('English')} style={{ marginTop: 0, paddingBottom: 10, fontWeight: 'bold', color: '#F68D3D', alignSelf: 'center' }}>
                                {/* <Text style={{ marginTop: 0, paddingBottom: 0, marginBottom: 0, fontWeight: 'bold', color: '#F68D3D', alignSelf: 'center' }}> */}
                                <Image
                                    // source={{ uri: "http://icons.iconarchive.com/icons/wikipedia/flags/256/GB-United-Kingdom-Flag-icon.png" }}
                                    source={require('../assets/united-kingdom.png')}
                                    style={{ width: 100, height: 100, alignSelf: 'center' }}
                                />
                                {/* </Text> */}
                            </TouchableHighlight>
                            {/* <Icon
                size={50}
                //name='block'
                name='check-circle'
                type='font-awesome'
                color='#3DB984'
                onPress={() => this.blockFriend(this.state.blockthisUser)} /> */}
                        </View>
                    </View>
                </ElevatedView>
            </View>
        </Modal>
    )
}