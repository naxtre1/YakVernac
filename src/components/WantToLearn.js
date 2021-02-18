import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { learnLangList } from '../utils/helpers';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { colors } from '../static/constant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { strings } from '../locales/i18n';
import I18n from 'react-native-i18n';
import Toast from 'react-native-simple-toast'
import { useDispatch } from 'react-redux'
import { setLang } from '../redux/action'

const WantToLearn = (props) => {
    const [langList, setLangList] = useState([...learnLangList]);
    const dispatch = useDispatch()

    const updateListValues = (index) => {
        let tempList = [...langList];
        tempList.forEach((item) => {
            if (item.id == index) {
                item.isSelected = true;
            } else {
                item.isSelected = false;
            }
        });
        setLangList(tempList);
    }

    const onContinue = () => {
        let tempList = [...langList];
        let selectedLang = 100;
        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].isSelected) {
                selectedLang = i;
                break;
            }
        }

        if (selectedLang == 0) {
            dispatch(setLang({ languageNative: 'Portuguese', languageLearning: 'English' }));

            props.navigation.pop();
            props.navigation.navigate("LoginEmail", { title: strings('Learn.accountTitle'), isFromSignUp : true });
        } else if (selectedLang == 1) {
            dispatch(setLang({ languageNative: 'English', languageLearning: 'Portuguese' }));

            props.navigation.pop();
            props.navigation.navigate("LoginEmail", { title: strings('Learn.accountTitle'), isFromSignUp : true });
        } else {
            Toast.show(strings('Learn.errorMsg'));
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.arrowBack} onPress={props.toggleLangModal} onPress={() => {
                    props.navigation.goBack();
                }}>
                    <AntDesignIcon name='arrowleft' size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20 }}>{strings('Learn.learn')}</Text>
            </View>
            <FlatList
                contentContainerStyle={styles.ScrollView}
                overScrollMode='never'
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                data={langList}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity
                        style={{
                            height: 50, backgroundColor: item.isAvailable ? 'white' : colors.mainBackground,
                            flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
                            borderColor: colors.selectionGreen,
                            borderRadius: 4,
                            borderWidth: item.isSelected ? 2 : 0
                        }}
                        onPress={() => {
                            if (item.isAvailable) {
                                updateListValues(index);
                            }
                        }}>
                        {item.isAvailable
                            ? <Image source={item.source}
                                resizeMode='cover'
                                style={{ height: 24, width: 28, marginLeft: 24 }} />
                            : <View style={{ height: 20, width: 28, marginLeft: 24, backgroundColor: colors.lightGrey }} />}
                        <Text style={{ textDecorationLine: item.isAvailable ? 'none' : 'line-through', marginHorizontal: 16, flex: 1 }}>{item.name}</Text>
                        {item.isSelected
                            ? <MaterialIcons name='check' size={24} color={colors.selectionGreen} style={{ marginRight: 16 }} />
                            : null}
                    </TouchableOpacity>;
                }}
            />
            <View style={{
                backgroundColor: colors.mainBackground,
                paddingTop: 16,
                paddingBottom: 32,
            }}>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        onContinue();
                    }}>
                    <Text style={styles.buttonText}>{strings('Learn.continue')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    ScrollView: {
        flexGrow: 1,
        backgroundColor: colors.mainBackground
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.mainBackground
    },
    arrowBack: {
        flex: 1,
        alignSelf: 'flex-start'
    },
    button: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 8
    },
    buttonText: {
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
});

export default WantToLearn;