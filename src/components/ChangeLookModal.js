import React from 'react';
import { Button, Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import ElevatedView from 'react-native-elevated-view';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { strings } from '../../src/locales/i18n';

const ChangeLookModal = (props) => {

    return (
        <Modal
            style={{ margin: 0 }}
            isVisible={props.isModalVisible}
            // backdropColor='rgba(5, 16, 46, 0.9)'
            onSwipeComplete={props.toggleLookModal}
            onRequestClose={props.toggleLookModal}>
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '80%', backgroundColor: 'white' }}>
                    <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                        <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                            <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                {strings(props.title)}
                            </Text>
                        </View>
                        <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                props.toggleLookModal();
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
                    {props.itemStatus == 0
                        ? <View>
                            <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                            <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                    You already have '{strings(props.title)}' profile picture!
                                </Text>
                                <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                    You can go back and search for other awesome items :)
                                </Text>
                            </View>
                            <View style={{ width: '100%', height: 15, justifyContent: 'center', }}></View>
                            <View style={{ width: '100%', height: 35, alignItems: 'center', justifyContent: 'center', }}>
                                <View style={{ width: 35, height: 35 }}>
                                    <Image style={{
                                        flex: 1,
                                        width: 35,
                                        height: 35,
                                        justifyContent: 'center',
                                    }}
                                        source={require('../assets/emoji-smile.png')}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                        </View>
                        : props.itemStatus == 1
                            ? <View>
                                <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ margin: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                        {strings('BuyScreen.want_buy', { myTitle: strings(props.title), xp: props.xp })}
                                    </Text>
                                </View>
                                <View style={{ width: '100%', height: 15, justifyContent: 'center', }}></View>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <View style={{ flex: 1, width: 100, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            title={strings('BuyScreen.Buy')}
                                            textStyle={{
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}
                                            buttonStyle={{
                                                backgroundColor: '#F68D3D',
                                                width: 100,
                                                height: 40,
                                            }}
                                            onPress={() => props.buyPicture()}
                                        />
                                    </View>
                                    <View style={{ flex: 1, width: 100, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            title={strings('BuyScreen.Cancel')}
                                            textStyle={{
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}
                                            buttonStyle={{
                                                backgroundColor: '#2496BE',
                                                width: 100,
                                                height: 40,
                                            }}
                                            onPress={() => {
                                                props.toggleLookModal();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                            </View>
                            : props.itemStatus == 2
                                ? <View>
                                    <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                                    <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                            Thanks for buying '{strings(props.title)}' profile picture!
                                </Text>
                                        <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                            You can go back and search for other awesome items :)
                                </Text>
                                    </View>
                                    <View style={{ width: '100%', height: 15, justifyContent: 'center', }}></View>
                                    <View style={{ width: '100%', height: 35, alignItems: 'center', justifyContent: 'center', }}>
                                        <View style={{ width: 35, height: 35 }}>
                                            <Image style={{
                                                flex: 1,
                                                width: 35,
                                                height: 35,
                                                justifyContent: 'center',
                                            }}
                                                source={require('../assets/emoji-smile.png')}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                                </View>
                                : <View>
                                    <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                                    <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                            You do not have sufficient XP to buy '{strings(props.title)}' profile picture!
                                        </Text>
                                        <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                            You can go back and search for other awesome items :)
                                        </Text>
                                    </View>
                                    <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                                </View>}
                    <View>

                        {/* <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ margin: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                {strings('BuyScreen.want_buy', { myTitle: strings(props.title), xp: props.xp })}
                            </Text>
                        </View>
                        <View style={{ width: '100%', height: 15, justifyContent: 'center', }}></View>
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View style={{ flex: 1, width: 100, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    title={strings('BuyScreen.Buy')}
                                    textStyle={{
                                        fontSize: 15,
                                        fontWeight: 'bold'
                                    }}
                                    buttonStyle={{
                                        backgroundColor: '#F68D3D',
                                        width: 100,
                                        height: 40,
                                    }}
                                    onPress={() => props.buyPicture()}
                                />
                            </View>
                            <View style={{ flex: 1, width: 100, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    title={strings('BuyScreen.Cancel')}
                                    textStyle={{
                                        fontSize: 15,
                                        fontWeight: 'bold'
                                    }}
                                    buttonStyle={{
                                        backgroundColor: '#2496BE',
                                        width: 100,
                                        height: 40,
                                    }}
                                    onPress={() => {
                                        props.toggleLookModal();
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View> */}

                        {/* <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                        <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                You already have '{strings(props.title)}' profile picture!
                                </Text>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                You can go back and search for other awesome items :)
                                </Text>
                        </View>
                        <View style={{ width: '100%', height: 15, justifyContent: 'center', }}></View>
                        <View style={{ width: '100%', height: 35, alignItems: 'center', justifyContent: 'center', }}>
                            <View style={{ width: 35, height: 35 }}>
                                <Image style={{
                                    flex: 1,
                                    width: 35,
                                    height: 35,
                                    justifyContent: 'center',
                                }}
                                    source={require('../assets/emoji-smile.png')}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View> */}

                        {/* <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                        <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                Thanks for buying '{strings(props.title)}' profile picture!
                                </Text>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                You can go back and search for other awesome items :)
                                </Text>
                        </View>
                        <View style={{ width: '100%', height: 15, justifyContent: 'center', }}></View>
                        <View style={{ width: '100%', height: 35, alignItems: 'center', justifyContent: 'center', }}>
                            <View style={{ width: 35, height: 35 }}>
                                <Image style={{
                                    flex: 1,
                                    width: 35,
                                    height: 35,
                                    justifyContent: 'center',
                                }}
                                    source={require('../assets/emoji-smile.png')}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View> */}

                        {/* <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View>
                        <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                You do not have sufficient XP to buy '{strings(props.title)}' profile picture!
                            </Text>
                            <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                You can go back and search for other awesome items :)
                            </Text>
                        </View>
                        <View style={{ width: '100%', height: 25, justifyContent: 'center', }}></View> */}

                    </View>
                </ElevatedView>
            </View>
        </Modal>
    );
}

export default ChangeLookModal;