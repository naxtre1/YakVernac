import React from 'react';
import Modal from 'react-native-modal';
import { Text, View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { countryList } from '../utils/helpers';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { colors } from '../static/constant';
import { useDispatch } from 'react-redux'
import { setLang } from '../redux/action'
import Toast from 'react-native-simple-toast'

const { height, width } = Dimensions.get('window');
const ChooseLangModal = (props) => {
    const dispatch = useDispatch()

    const onContinue = (index) => {
        if (index == 0) {
            dispatch(setLang({ languageNative: 'English', languageLearning: 'Portuguese' }));
            
            props.toggleLangModal();
        } else if (index == 1) {
            dispatch(setLang({ languageNative: 'Portuguese', languageLearning: 'English' }));

            props.toggleLangModal();
        } else {
            Toast.show("Please select a language!!");
        }
    }

    return (
        <Modal
            style={{ margin: 0 }}
            isVisible={props.isModalVisible}
            // backdropColor='rgba(5, 16, 46, 0.9)'
            onSwipeComplete={props.toggleLangModal}
            onRequestClose={props.toggleLangModal}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.arrowBack} onPress={props.toggleLangModal}>
                        <AntDesignIcon name='arrowleft' size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    numColumns={2}
                    style={{ marginVertical: 16 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    overScrollMode='never'
                    data={countryList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return <TouchableOpacity style={{ width: width * 0.5, marginBottom: 16 }}
                            onPress={() => {
                                onContinue(index);
                            }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: 80, width: width * 0.35, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={item.source}
                                        resizeMode='cover'
                                        style={{ height: 80, width: width * 0.35 }} />
                                    {item.isAvailable
                                        ? null
                                        : <View style={{
                                            height: 80, width: width * 0.35, position: 'absolute',
                                            backgroundColor: 'rgba(128,128,128,0.4)'
                                        }} />
                                    }
                                </View>
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableOpacity>;
                    }} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGrey
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
});

export default ChooseLangModal;