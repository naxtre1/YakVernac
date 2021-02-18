import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { getLangInitial } from '../static/constant'
import { colors } from '../static/constant';
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-snap-carousel'
import firestore from '@react-native-firebase/firestore'
import { setXp, setProfilePics } from '../redux/action'
import ChangeLookModal from './ChangeLookModal';
import Modal from "react-native-modal";
import ElevatedView from 'react-native-elevated-view';
import { strings } from '../../src/locales/i18n';
import { Button, Icon } from 'react-native-elements';

const { height, width } = Dimensions.get('window');
const connector = connect((state) => {
    return {
        user: state.user,
        lang: state.lang,
        profilePics: state.profilePics,
        xp: state.xp
    }
}, { setXp, setProfilePics });

const Countries = [
    { id: 0, name: "Spanish", isAvailable: false },
    { id: 1, name: "Russian", isAvailable: false },
    { id: 2, name: "Arabic", isAvailable: false },
    { id: 3, name: "Italian", isAvailable: false },
    { id: 4, name: "Polish", isAvailable: false },
];

const BuyPlanScreen = (props) => {
    const [profileEntries, setProfileEntries] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [item, setItem] = useState();
    const [itemStatus, setItemStatus] = useState(0);
    const [modalJson, setModalJson] = useState();
    const [isComingSoonModalVisible, setIsComingSoonModalVisible] = useState(false);

    const toggleIsComingSoonModal = () => {
        setIsComingSoonModalVisible(!isComingSoonModalVisible);
    }

    const toggleLookModal = () => {
        setIsModalVisible(!isModalVisible);
    }

    useEffect(() => {
        firestore().collection('App').doc('pic').get().then(doc => {
            if (doc.exists) {
                const picData = doc.data();
                setProfileEntries(picData.profile);

                // this.setState({ entries: picData.profile, entriesIsland: picData.island })
            }
        })
    }, []);

    const buyPicture = () => {
        const profilePics = props.profilePics.profilePics
        if (props.xp - item.xp >= 0) {
            const restXP = props.xp - item.xp;

            profilePics.push(item);
            props.setXp(props.user.uid, restXP)
            props.setProfilePics(props.user.uid, profilePics)

            setItemStatus(2);
        } else {
            setItemStatus(3);
        }
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={[styles.cardContainer, { backgroundColor: item.isAvailable ? colors.blue : colors.button }]}
                onPress={() => {
                    setModalJson({ type: 0, message: `${item.name} ${strings("BuyPlan.lang_not_avail")}`, title: strings("BuyPlan.lang") });
                    toggleIsComingSoonModal();
                }}>
                <Text style={{ fontSize: 28, color: item.isAvailable ? colors.button : colors.text }}>{strings("LangCourses." + item.name)}</Text>

                <MaterialIcons name={'lock'} size={24} color={colors.text} style={{ position: 'absolute', bottom: 16, right: 16 }} />
            </TouchableOpacity>
        );
    }

    const renderLookItem = ({ item }) => {
        let isItemPurchased = false;
        if (props.profilePics.profilePics && props.profilePics.profilePics.length > 0) {
            for (let i = 0; i < props.profilePics.profilePics.length; i++) {
                if (props.profilePics.profilePics[i].title == item.title) {
                    isItemPurchased = true;
                    break;
                }
            }
        }

        return (
            <View>
                <TouchableOpacity style={[styles.cardLookContainer, { backgroundColor: item.isAvailable ? colors.blue : colors.button }]}
                    onPress={() => {
                        if (!isItemPurchased) {
                            setItemStatus(1);
                            setItem(item);
                            toggleLookModal();
                        } else {
                            setItemStatus(0);
                            setItem(item);
                            toggleLookModal();
                        }
                    }}>
                    <Image
                        source={{ uri: item.illustration }}
                        defaultSource={require('../assets/coin.png')}
                        style={{ height: 130, width: 130 }} resizeMode='cover' />
                </TouchableOpacity>
                {isItemPurchased
                    ? <View style={{ alignItems: 'center', marginTop: 16, flexDirection: 'row', justifyContent: 'center' }}>
                        {/* <Text style={{ color: colors.text, fontSize: 20 }}>{item.xp} XP</Text> */}
                        <MaterialIcons name={'check'} size={16} color={colors.selectionGreen} />
                        <MaterialIcons name={'check'} size={16} color={colors.selectionGreen} />
                        <MaterialIcons name={'check'} size={16} color={colors.selectionGreen} />
                    </View>
                    : <View style={{ alignItems: 'center', marginTop: 16, justifyContent: 'center', flexDirection: 'row' }}>
                        <Image source={require('../assets/coin.png')} style={{ height: 24, width: 20, marginRight: 4 }} resizeMode='contain' />
                        <Text style={{ color: colors.text, fontSize: 20 }}>{item.xp}</Text>
                    </View>
                }
            </View>
        );
    }

    const renderUnlockItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ height: 180, width: 272 }}
                onPress={() => {
                    setModalJson({ type: 1, message: `This feature is coming soon!`, title: 'Unlock lessons' });
                    toggleIsComingSoonModal();
                }}>
                <Image
                    source={require('../assets/flirting.png')}
                    style={{ height: 180, width: 272 }} resizeMode='cover' />
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                overScrollMode='never'
                contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                    <View style={styles.pointContainer}>
                        <Text style={{ color: colors.darkOrange, fontSize: 20, fontWeight: 'bold' }}>YAK VERNAC</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 16 }}>
                            <Image source={require('../assets/coin.png')} style={{ height: 24, width: 20, marginLeft: 16 }} resizeMode='contain' />
                            <Text style={{ fontSize: 20, color: colors.darkOrange, paddingLeft: 4 }}>{props.xp}</Text>
                        </View>
                        <Text style={{ color: colors.text, fontSize: 20, paddingLeft: 16 }}>
                            {`${getLangInitial(props.lang.languageNative)} > ${getLangInitial(props.lang.languageLearning)}`}
                        </Text>
                        <Image source={props.user.premium ? require('../assets/crown.png') : require('../assets/crown-free.png')} style={{ height: 18, width: 24, marginLeft: 16 }} resizeMode='cover' />
                    </View>
                    <View style={{ height: 216, paddingVertical: 8, width: '100%', backgroundColor: colors.text, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/crown.png')} style={{ height: 40, width: 50, alignSelf: 'center' }} resizeMode='cover' />
                        <Text style={{ color: colors.smackOrange, fontSize: 28, fontWeight: 'bold', marginVertical: 8, textAlign: 'center' }}>
                            {strings('BuyPlan.premium')}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                            <MaterialIcons name={'check'} size={10} color={colors.button} />
                            <Text style={{ color: colors.button, marginHorizontal: 10, fontSize: 14 }}>{strings('BuyPlan.unlimited')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                            <MaterialIcons name={'check'} size={10} color={colors.button} />
                            <Text style={{ color: colors.button, marginHorizontal: 10, fontSize: 14 }}>{strings('BuyPlan.study')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                            <MaterialIcons name={'check'} size={10} color={colors.button} />
                            <Text style={{ color: colors.button, marginHorizontal: 10, fontSize: 14 }}>{strings('BuyPlan.unlocked')}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('PaymentScreen');
                        }} style={{ backgroundColor: colors.blue, alignSelf: 'center', borderRadius: 4 }}>
                            <Text style={{ color: colors.button, textAlign: 'center', fontSize: 16, paddingVertical: 8, paddingHorizontal: 24 }}>
                                {strings('BuyPlan.find')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 28, marginBottom: 18, color: colors.text, fontSize: 28, fontWeight: '500' }}>
                        {strings('BuyPlan.lang')}
                    </Text>
                    <Carousel
                        data={Countries}
                        renderItem={renderItem}
                        sliderWidth={width}
                        itemWidth={280}
                        hasParallaxImages={true}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        firstItem={1}
                    />
                    {profileEntries && profileEntries.length > 0
                        ? <>
                            <Text style={{ marginTop: 28, marginBottom: 18, color: colors.text, fontSize: 28, fontWeight: '500' }}>
                                {strings('BuyPlan.look')}
                            </Text>
                            <Carousel
                                data={profileEntries}
                                renderItem={renderLookItem}
                                sliderWidth={width}
                                itemWidth={172}
                                hasParallaxImages={true}
                                inactiveSlideScale={1}
                                inactiveSlideOpacity={1}
                                firstItem={1} />
                        </>
                        : null}
                    <Text style={{ marginTop: 28, marginBottom: 18, color: colors.text, fontSize: 28, fontWeight: '500' }}>
                        {strings('BuyPlan.lessons')}
                    </Text>
                    <Carousel
                        data={Countries}
                        renderItem={renderUnlockItem}
                        sliderWidth={width}
                        itemWidth={280}
                        hasParallaxImages={true}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        firstItem={1}
                    />
                </View>
            </ScrollView>
            <ChangeLookModal
                itemStatus={itemStatus}
                buyPicture={buyPicture}
                xp={item?.xp}
                title={item?.title}
                isModalVisible={isModalVisible}
                toggleLookModal={toggleLookModal} />
            <Modal
                style={{ margin: 0 }}
                isVisible={isComingSoonModalVisible}
                onSwipeComplete={toggleIsComingSoonModal}
                onRequestClose={toggleIsComingSoonModal}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '80%', backgroundColor: 'white' }}>
                        <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                            <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                                <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                    {modalJson?.title}
                                </Text>
                            </View>
                            <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                                <TouchableOpacity onPress={() => {
                                    toggleIsComingSoonModal();
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
                        <View>
                            <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginHorizontal: 15, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#009CD7' }}>
                                    {modalJson?.message}
                                </Text>
                            </View>
                        </View>
                    </ElevatedView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    pointContainer: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: colors.button,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    cardContainer: {
        height: 180,
        width: 272,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 8
    },
    cardLookContainer: {
        height: 172,
        width: 164,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default (connector(BuyPlanScreen));