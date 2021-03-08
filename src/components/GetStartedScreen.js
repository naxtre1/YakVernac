import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, ImageBackground, Linking } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { CheckBox } from 'native-base';
import { colors } from '../static/constant';
import LangModal from './ChooseLangModal';
import Toast from 'react-native-simple-toast'
import { strings } from '../locales/i18n';
import { setLang } from '../redux/action'
import { connect } from 'react-redux'
import { getLangResourceByType } from '../utils/helpers';

const connector = connect((state) => {
    return {
        lang: state.lang
    }
}, { setLang });

const GetStartedScreen = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAgree, setIsAgree] = useState(false);
    const lang = props.lang;

    const toggleLangModal = () => {
        setIsModalVisible(!isModalVisible);
    }

    const toggleAgreeTerms = () => {
        setIsAgree(!isAgree);
    }

    return (
        <SafeAreaView testID="getStartedScreenView" style={styles.safeArea}>
            <ImageBackground source={require('../assets/home_bg.png')} style={{ flex: 1, resizeMode: 'cover' }}>
                <View style={styles.headerContainer}>
                    {/* <TouchableOpacity style={styles.arrowBack} >
                        <AntDesignIcon name='arrowleft' size={24} color="black" />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.langContainer} onPress={() => {
                        toggleLangModal();
                    }}>
                        <AntDesignIcon name='down' size={12} color="black" />
                        <Text style={styles.langText}>{getLangResourceByType(lang.languageNative).lang}</Text>
                        <Image source={getLangResourceByType(lang.languageNative).source} resizeMode='cover' style={{ height: 32, width: 28 }} />
                        {/* <AntDesignIcon name='flag' size={16} color="black" /> */}
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.ScrollView}>
                    <View>
                        <Text style={styles.title}>
                            YAKVERNAC
                    </Text>
                        <Image source={require('../assets/bubble-earth.png')} style={styles.logo} resizeMode='contain' />
                        <TouchableOpacity testID="getStartedButton" style={[styles.button, { backgroundColor: isAgree ? colors.blue : 'rgba(149,152,154,0.7)' }]}
                            onPress={() => {
                                if (isAgree) {
                                    props.navigation.navigate("WantToLearn");
                                } else {
                                    Toast.show(strings('GetStarted.agreeError'));
                                }
                            }}>
                            <Text style={styles.buttonText}>{strings('GetStarted.GetStarted')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity testID="getStartedLoginButton" style={[styles.outlineButton, { borderColor: isAgree ? colors.blue : 'rgba(149,152,154,0.7)' }]}
                            onPress={() => {
                                if (isAgree) {
                                    props.navigation.navigate("LoginEmail", { title: strings('GetStarted.emailTitle'), isFromSignUp : false });
                                } else {
                                    Toast.show(strings('GetStarted.agreeError'));
                                }
                            }}>
                            {/* <Text style={styles.outlineButtonText}>Sign in</Text> */}
                            <Text style={[styles.outlineButtonText, { color: isAgree ? colors.blue : colors.button }]}>{strings('GetStarted.log_in')}</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 8, marginBottom: 16, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <CheckBox checked={isAgree} color={colors.blue} onPress={toggleAgreeTerms} />
                            <View style={{ flex: 1, marginLeft: 20 }}>
                                <Text>{strings('GetStarted.agree')}&nbsp;
                                        <Text style={{ color: colors.blue }} onPress={() => Linking.openURL('http://www.yakvernac.com/privacy-policy')}>
                                        {strings('GetStarted.privacy_policy')}
                                    </Text>
                                        &nbsp;{strings('GetStarted.and')}&nbsp;
                                        <Text style={{ color: colors.blue }} onPress={() => Linking.openURL('http://www.yakvernac.com/terms-and-conditions')}>
                                        {strings('GetStarted.terms')}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
            <LangModal isModalVisible={isModalVisible}
                toggleLangModal={toggleLangModal} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    ScrollView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        marginHorizontal: 16,
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrowBack: {
        flex: 1,
        alignSelf: 'flex-start'
    },
    langContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    langText: {
        paddingHorizontal: 8,
        fontSize: 16,
        fontWeight: 'bold'
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        // marginVertical: 24,
        marginTop: 24,
        color: colors.darkOrange
    },
    logo: {
        marginVertical: 16,
        height: 250,
        width: 250,
        alignSelf: 'center'
    },
    button: {
        // marginTop: 24,
        marginBottom: 8,
        marginHorizontal: 16,
        // backgroundColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 8
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'
    },
    outlineButton: {
        marginTop: 8,
        marginBottom: 8,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 2,
        // borderColor: colors.blue
    },
    outlineButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        // color: colors.blue
    }
});

export default (connector(GetStartedScreen));