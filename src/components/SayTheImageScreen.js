import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Image, AppRegistry, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'
import { CheckBox, Slider } from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import { Button } from 'react-native-elements';
import { CustomHeader } from './common/CustomHeader';
import Tts from 'react-native-tts';
import { showMessage, hideMessage } from "react-native-flash-message";
import { setXp } from '../redux/action'
import Voice from '@react-native-community/voice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { strings } from '../../src/locales/i18n';
import SimpleToast from 'react-native-simple-toast';

Tts.setDefaultLanguage('pt-BR');
Tts.setDefaultRate(0.4);

class SayTheImageScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Spatial/Linguistic',
            headerTitle: <CustomHeader navigation={navigation} />,
            headerStyle: {
                backgroundColor: '#2496BE',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            recognized: '',
            pitch: '',
            error: '',
            end: '',
            started: '',
            results: [],
            partialResults: [],

            words: [''],
            index: 0,
            topicIndex: 0,
            a: [''],
            k: 0,
            temp: '',
            result: '',
            allCorrect: 0,
            max: 5,
            modalVisible: false
        };
        Voice.onSpeechStart = this.onSpeechStart.bind(this);
        Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
        Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (this.props.lang.languageLearning == 'Portuguese') {
            Tts.setDefaultLanguage('pt-BR');
        } else {
            Tts.setDefaultLanguage('en-US');
        }
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    onSpeechStart(e) {
        this.setState({
            started: '√',
        });
    }

    onSpeechRecognized(e) {
        this.setState({
            recognized: '√',
        });
    }

    onSpeechEnd(e) {
        this.setState({
            end: '√',
        });
    }

    onSpeechError(e) {
        this.setState({
            error: JSON.stringify(e.error),
        });
    }

    onSpeechResults(e) {
        this.setState({
            results: e.value,
        });

        SimpleToast.show('Speech Results : ' + e.value.join(', '), SimpleToast.LONG);
    }

    onSpeechPartialResults(e) {
        this.setState({
            partialResults: e.value,
        });
    }

    onSpeechVolumeChanged(e) {
        this.setState({
            pitch: e.value,
        });
    }

    async _startRecognizing(e) {
        this.setState({ temp: '' });
        this.setState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: ''
        });
        try {
            if (this.props.lang.languageLearning == 'Portuguese') {
                await Voice.start('pt-BR');
            } else {
                await Voice.start('en-US');
            }

        } catch (e) {
            console.error(e);
        }
    }

    async _stopRecognizing(e) {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    }

    async _cancelRecognizing(e) {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    }

    async _destroyRecognizer(e) {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
        this.setState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: ''
        });
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    onButtonPress() {

        const { navigate } = this.props.navigation;

        switch (this.state.index) {
            case 0:
                navigate('VisualAwareness');
            // case false:
            //   return <LoginForm />;
            default:
                return navigate('Home');
        }
    }

    changeWord(a) {

        if (this.state.k != this.state.max) {
            console.log("tempResult0 : ", a[this.state.k]);
            this.setState({ WordToGuess: a[this.state.k] });
            this.setState({ finalArray: [] });
            firestore().collection(`Vocabulary${this.props.lang.languageNative}${this.props.lang.languageLearning}`).doc(a[this.state.k]).get().then(doc => {
                if (doc.exists) {
                    const data = doc.data()
                    var temp = data.word;
                    var url = data.url;

                    this.setState({ url: url });

                    var tempResult = temp.split('');
                    var result = this.shuffle(tempResult);

                    console.log("tempResult : ", tempResult);
                    if (tempResult.indexOf('/') !== -1) {
                        this.setState({ moreInfo: 'This word can be masculine or feminine' })
                        var compRes = temp.split('/');
                        this.setState({ compareResult: compRes });

                        tempResult.splice(tempResult.indexOf('/'), 1);
                        var result = this.shuffle(tempResult);
                        console.log("tempResult2 : ", result);
                        this.setState({ result });
                    } else {
                        this.setState({ result });
                        this.setState({ compareResult: [temp] });
                        console.log("tempResult3 : ", temp);
                    }

                    this.setState({ result });
                }
            })
        } else if (this.state.k == this.state.max) {

            var userXP = this.props.xp + this.state.allCorrect;
            this.props.setXp(this.props.user.uid, userXP)
        }

    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        var a = this.shuffle(params.words);
        if (a.length > 5) {
            a = a.slice(0, 5);
            this.setState({ a })
        } else {
            this.setState({ max: a.length });
            this.setState({ a })
        }


        this.changeWord(a);
    }

    CheckIfCorrect() {
        var kelintas = this.state.k + 1;

        // Voice.cancel();
        // Voice.cancel()
        this._stopRecognizing(this);
        // this._destroyRecognizer.bind(this)

        var compareResult = this.state.compareResult;
        var myResults = [];
        if (this.state.results && this.state.results.length > 0) {
            this.state.results.forEach((item) => {
                myResults.push(item.toLowerCase().trim());
            });
        }

        // var myResults = this.state.results;
        // var found = compareResult.some(r => myResults.indexOf(r) >= 0)
        var found = compareResult.some(r => myResults.indexOf(r.toLowerCase().trim()) >= 0)

        console.log("compareResult : ", compareResult);
        console.log("myResults : ", myResults);
        console.log("found : ", found);

        if (found == true) {
            this.setState({ temp: strings('GamesCommon.correct') });
            this.setState({ allCorrect: this.state.allCorrect + 1 });

            showMessage({
                message: strings('GamesCommon.correct'),
                description: strings('GamesCommon.sucess_desc'),
                type: "success",
            });

        } else {
            this.setState({ temp: `${strings('SayTheImage.wrong_the', { name: compareResult[0] })}` });

            showMessage({
                message: strings('SayTheImage.wrong_the', { name: compareResult[0] }),
                description: strings('GamesCommon.better_luck'),
                type: "danger",
            });

        }
        const word = this.state.a[this.state.k]

        // newer way
        if (word) {
            firestore().collection('user').doc(this.props.user.uid).collection('progress').add({
                lang: this.props.lang.languageLearning,
                time: Date.now(),
                word,
                result: found,
                mode: 'speak',
                count: 1
            })
        }

        // older way
        // firestore().collection('user').doc(this.props.user.uid).collection('progress')
        // .where('lang', '==', this.props.lang.languageLearning)
        // .where('word', '==', word)
        // .where('mode', '==', 'speak')
        // .get()
        // .then(snapshotResult=>{
        //     if (snapshotResult.empty) {
        //         firestore().collection('user').doc(this.props.user.uid).collection('progress').add({
        //             lang: this.props.lang.languageLearning,
        //             time: Date.now(),
        //             word,
        //             result: found,
        //             mode: 'speak',
        //             count: 1
        //         })
        //         return
        //     } else {
        //         const data = snapshotResult.docs[0].data()
        //         const count = data.count?data.count+1:1
        //         firestore().collection('user').doc(this.props.user.uid).collection('progress').doc(snapshotResult.docs[0].id).update({
        //             result: found, time: Date.now(), count
        //         })
        //     }
        //     return
        // })

        this._destroyRecognizer(this);

        this.setState({
            k: kelintas
        }, () => {
            this.changeWord(this.state.a);
        });



    }

    // renderModalContent() {
    //   // const {currentUser} = auth();
    //   const { navigate } = this.props.navigation;

    //   return (
    //     <View>
    //         <Text>-----------------------------</Text> 
    //         <Text></Text>
    //         <Text>-----------------------------</Text>

    //         <TouchableHighlight
    //             onPress={() => {
    //                 this.setModalVisible(!this.state.modalVisible);
    //                 navigate('Start');
    //             }}>  
    //         <Text>Back to main menu</Text>
    //         </TouchableHighlight>

    //     </View>
    //   );
    // }

    renderContent(styles) {
        const { navigate } = this.props.navigation;
        var compareResult = this.state.compareResult;

        switch (this.state.k) {
            case this.state.max:
                return (
                    <View style={{ width: '100%', height: '100%', paddingHorizontal: 30, paddingTop: 15, backgroundColor: '#C3E3E4' }}>
                        <View style={{ width: '100%', height: '60%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FB5A3A', marginTop: 20 }}>{strings('GamesCommon.thanks_for')}</Text>
                            <Text style={{ marginTop: 27, fontSize: 24, color: '#2496BE' }}>{strings('GamesCommon.you_earned', { name: this.state.allCorrect })}</Text>
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
                                    onPress={() => {
                                        const lessonID = this.props.navigation.getParam('lessonID')
                                        console.log('lessonID:', lessonID)
                                        firestore().collection('user').doc(this.props.user.uid).collection('lesson').doc(lessonID).update({
                                            end: Date.now()
                                        }).then(() => {
                                            navigate('Start')

                                        })
                                    }} />
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 45 }}></View>
                    </View>
                );

            default:
                return (
                    <View style={{ width: '100%', height: '100%', paddingHorizontal: 30, paddingTop: 15, backgroundColor: '#C3E3E4' }}>
                        <Slider
                            value={this.state.k / this.state.max}
                            thumbTintColor='#FF7F00'
                            minimumTrackTintColor='#006780'
                            maximumTrackTintColor='#1EA2BC'
                        />
                        <View style={{ marginBottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Text>{this.state.k}/{this.state.max}</Text>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FD751C' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                {strings('SayTheImage.say_the')}
                            </Text>
                        </View>
                        <View style={{ width: '100%', paddingTop: 5 }}>
                            <TouchableHighlight onPress={() => { Tts.speak(compareResult[0]) }}>
                                <Image
                                    style={{
                                        alignSelf: 'center',
                                        height: 250,
                                        width: '100%',
                                        borderWidth: 1,
                                        //borderRadius:5,
                                    }}
                                    source={{ uri: this.state.url }}
                                    resizeMode="cover"
                                />
                            </TouchableHighlight>
                        </View>
                        <View style={{ paddingVertical: 5, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333' }} >
                                {strings('SayTheImage.say_the_word')}
                            </Text>
                        </View>
                        <Text style={styles.stat}>
                            {`${strings('SayTheImage.started')}: ${this.state.started}`}
                        </Text>
                        <Text style={styles.stat}>
                            {`${strings('SayTheImage.ended')}: ${this.state.end}`}
                        </Text>
                        <View style={{ marginVertical: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this._startRecognizing.bind(this)}>
                                <Image
                                    style={styles.button}
                                    source={require('../assets/button.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                title={strings('SayTheImage.reset')}
                                textStyle={{
                                    fontSize: 18,
                                    fontWeight: 'bold'
                               
                                }}
                                buttonStyle={{
                                    backgroundColor: '#006780',
                                    width: 150,
                                    height: 40,
                                }}
                                onPress={this._destroyRecognizer.bind(this)} />
                        </View>
                        {this.renderValidate()}
                        {/* <Text>{this.state.temp}</Text> */}
                    </View>
                );
        }
    }

    renderValidate() {

        var compareResult = this.state.compareResult;

        //    if (this.state.end == '√' && this.state.results.length > 0) {
        return (
            <View style={{ marginTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    title='GO!'
                    textStyle={{
                        fontSize: 24,
                        fontWeight: 'bold'
                    }}
                    buttonStyle={{
                        backgroundColor: '#1EA2BC',
                        width: 150,
                        height: 45,
                    }}
                    onPress={() => this.CheckIfCorrect()}
                />

                <Button
                    title='Hint'
                    textStyle={{
                        fontSize: 24,
                        fontWeight: 'bold'
                    }}
                    buttonStyle={{
                        backgroundColor: '#3aaa17',
                        width: 80,
                        height: 45,
                    }}
                    onPress={() => { Tts.speak(compareResult[0]) }} />


            </View>
        );
        //    } else {
        //      return false;
        //    }
    }

    render() {
        // The screen's current route is passed in to `props.navigation.state`:

        return (
            <KeyboardAwareScrollView style={{ backgroundColor: '#C3E3E4' }}>
                {this.renderContent(styles)}
            </KeyboardAwareScrollView>
        );
    }
}


const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    action: {
        textAlign: 'center',
        color: '#0000FF',
        marginVertical: 5,
        fontWeight: 'bold',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1 // label occupies 1/3 of the space
    },
    inputStyle: {
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        lineHeight: 23,
        flex: 2 // input ocupies 2/3 of the space
    }
});

function mapStateToProps(state) {
    return {
        user: state.user,
        lang: state.lang,
        xp: state.xp
    }
}

export default connect(mapStateToProps, { setXp })(SayTheImageScreen)
