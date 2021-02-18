import React, { Component } from 'react';
import { Text, Modal, TextInput, ScrollView, KeyboardAvoidingView, View, TouchableOpacity, Image, AppRegistry, StyleSheet, Alert, TouchableHighlight, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { CheckBox, Button, Icon } from 'react-native-elements';
import { Card, CardSection, Input } from './common';
import RNFetchBlob from 'rn-fetch-blob'
import Spinner from "react-native-loading-spinner-overlay";
import Autocomplete from 'react-native-autocomplete-input';
import { CustomHeader } from './common/CustomHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ElevatedView from 'react-native-elevated-view'
import { connect } from 'react-redux'
import { strings } from '../../src/locales/i18n';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

// const SketchDrawConstants = SketchDraw.constants;

const tools = { emptyString: 'Empty' };

// tools[SketchDrawConstants.toolType.pen.id] = {
//     id: SketchDrawConstants.toolType.pen.id,
//     name: SketchDrawConstants.toolType.pen.name,
//     nextId: SketchDrawConstants.toolType.eraser.id
// };
// tools[SketchDrawConstants.toolType.eraser.id] = {
//     id: SketchDrawConstants.toolType.eraser.id,
//     name: SketchDrawConstants.toolType.eraser.name,
//     nextId: SketchDrawConstants.toolType.pen.id
// };

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const API = 'https://swapi.co/api';
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const uploadImage = (uri, mime = 'application/octet-stream') => {
    return new Promise((resolve, reject) => {
        // const uploadUri = uri;
        const sessionId = Date.now().toString()
        // console.log('agora');
        // let uploadBlob = null
        const imageRef = storage().ref('drawings').child(`${sessionId}`);
        imageRef.putFile(uri).then(() => {
            imageRef.getDownloadURL().then(url => {
                resolve(url)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
        // fs.readFile(uploadUri, 'base64')
        // .then((data) => {
        //   return Blob.build(data, { type: `${mime};BASE64` })
        // })
        // .then((blob) => {
        //   uploadBlob = blob
        //   return imageRef.put(blob, { contentType: mime })
        // })
        // .then(() => {
        //   uploadBlob.close()
        //   return imageRef.getDownloadURL()
        // })
        // .then((url) => {
        //   resolve(url)
        // })
        // .catch((error) => {
        //   console.log('error:', error.message)
        //   reject(error)
        // })
    })
}

class DrawThisScreen extends Component {
    canvasRef = React.createRef()
 
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Spatial/Kinesthetic',
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
    static renderFilm(film) {
        const { username } = film;
    
        return (
            <View>
                {/* <Text>{'\n'}</Text>
        <Text>{'\n'}</Text>
        <Text>{'\n'}</Text>
        <Text>{'\n'}</Text> */}
                <Text style={styles.titleText}></Text>
                <Text style={styles.directorText}></Text>
                <Text style={styles.openingText}></Text>
            </View>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            color: '#000000',
            // toolSelected: SketchDrawConstants.toolType.pen.id,
            myURL: '',
            modalVisible: false,
            error: '',
            WordToSpeak: '',
            max: 5,
            a: [''],
            k: 0,
            temp: '',
            loadingScene: false,
            query: '',
            hideResults: false
        };
    }

    findFilm(query) {
        if (query === '') {
            return [];
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        const films = []
        for (const id in this.props.friends) {
            if (this.props.friends[id].username.search(regex) >= 0) {
                films.push(this.props.friends[id])
            }
        }
        return films
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

        const self = this;


        // console.log(a);

        this.changeWord(a);

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

    changeWord(a) {

        if (this.state.k != this.state.max) {
            // this.setState({WordToGuess:a[this.state.k]});
            //   this.setState({ImageToGuess:a})
            this.setState({ finalArray: [] });
            firestore().collection(`Vocabulary${this.props.lang.languageNative}${this.props.lang.languageLearning}`).doc(a[this.state.k]).get().then(doc => {
                var TranslatedWord = a[this.state.k];
                var snapshotResult = doc.data()
                var temp = snapshotResult.word;

                // console.log(temp);
                // console.log(snapshotResult);
                this.setState({ WordToSpeak2: TranslatedWord });
                this.setState({ WordToSpeak: temp });

                // this.setState({result});
            })

        }
    }

    // isEraserToolSelected() {
    //     return this.state.toolSelected === SketchDrawConstants.toolType.eraser.id;
    // }

    toolChangeClick() {
        this.setState({ toolSelected: tools[this.state.toolSelected].nextId });
    }

    getToolName() {
        return tools[this.state.toolSelected].name;
    }
    onSketchclear(saveEvent) {
alert('clear');
        // this.setState({ loadingScene: true });

        // this.props.onSave && this.props.onSave(saveEvent);
        // // console.log(saveEvent.localFilePath)
        // // this.setState({ uploadURL: saveEvent.localFilePath })
        // uploadImage('file://' + saveEvent.localFilePath)
        //     .then(url => {
        //         this.setState({ myURL: url, loadingScene: false });
        //     })
        //     .catch(error => {
        //         console.log('error:', error.message)
        //     })

        // console.log(this.state.uploadURL);
    }


    onSketchSave(saveEvent) {

        this.setState({ loadingScene: true });

        this.props.onSave && this.props.onSave(saveEvent);
        // console.log(saveEvent.localFilePath)
        // this.setState({ uploadURL: saveEvent.localFilePath })
        uploadImage('file://' + saveEvent.path)
            .then(url => {
                this.setState({ myURL: url, loadingScene: false });
                alert("url",url)
            })
            .catch(error => {
                console.log('error:', error.message)
                alert(" error.message", error.message)
            })

        // console.log(this.state.uploadURL);
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    findUsersMatchingEmail(emailAddress) {

        fb.child('users').orderByChild('age').equalTo(23).once('value', function (snap) {
            return snap.val();
        });
    }

    onButtonSend() {
        const { query, myURL } = this.state;

        const myUserId = this.props.user.uid;
        var correctResponse = this.state.WordToSpeak;
        var correctResponse2 = this.state.WordToSpeak2;


        var self = this;

        firestore().collection('user').where('username', '==', `${query}`).get().then(snap => {
            if (snap.docs.length <= 0) {
                return
            }
            for (const doc of snap.docs) {
                firestore().collection('user').doc(`${doc.id}`).collection('pendDrawings').doc(myUserId).set({ correctResponse, correctResponse2, myURL }).then(() => {

                    console.log('VISKAS KO REIKIA - TAI GERAI NU');
                    self.setModalVisible(true);
                })
                    .catch(() => {
                        console.log('NEIRASE I DB !!!')
                    })
            }

        });
    }

    
   
    


    renderContent() {
        const { navigate } = this.props.navigation;

        const { query } = this.state;
        const films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        switch (this.state.myURL) {
            case '':
                return (
                    <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
                        <View style={{ padding: 30, width: '100%', height: '92%', backgroundColor: '#C3E3E4' }}>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FD751C' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{strings('DrawThis.draw')} '{this.state.WordToSpeak}'</Text>
                            </View>
                            <View style={{  flexDirection: 'row',paddingTop: 5, width: '100%', aspectRatio: 1.3 }}>
                                {/* <SketchDraw style={{ flex: 1, backgroundColor: 'white' }} ref="sketchRef"
                                    selectedTool={this.state.toolSelected}
                                    toolColor={'#000000'}
                                    onSaveSketch={this.onSketchSave.bind(this)}
                                    localSourceImagePath={this.props.localSourceImagePath} /> */}

{/* <SketchCanvas  ref="sketchRef"
             style={{ flex: 1, backgroundColor: 'white' }}
            strokeColor={'#000000'}
            strokeWidth={7}    
            localSourceImagePath={this.props.localSourceImagePath}
            
          /> */}

<View style={{flexDirection: 'row', width: '100%', height: '8%',  backgroundColor: '#1EA2BC' ,paddingTop: 5, width: '100%', aspectRatio: 1.3  }  }>
            <RNSketchCanvas 
             ref="sketchRef"
              containerStyle={{ backgroundColor: 'transparent', flex: 1}}
              canvasStyle={{ position: 'relative',backgroundColor: 'white', flex: 1  }}       
              onStrokeEnd={data => {
              }}
              strokeComponent={color => (
                                <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                              )}
                              strokeSelectedComponent={(color, index, changed) => {
                                                return (
                                                  <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                                                )
                                              }}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              onSaveSketch={this.onSketchSave.bind(this)}
               saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Save</Text></View>}   
               savePreference={() => {
                return {
                  folder: "RNSketchCanvas",
                  filename: String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  imageType: "png",
                  localSourceImagePath: this.props.localSourceImagePath
                }
              }}
              onSketchSaved={(success, path) => {
                this.setState({ loadingScene: true });
                uploadImage('file://' + path)
            .then(url => {
                this.setState({ myURL: url, loadingScene: false });
            })
            .catch(error => {
                console.log('error:', error.message)
            })
              }}
              onPathsChange={(pathsCount) => {
                console.log('pathsCount', pathsCount)
              }}
              eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold'}}>Eraser</Text></View>}
              clearComponent={<View style={styles.functionButton}><Text style={Platform.OS='ios'?{ color: 'white' , fontSize: 20, fontWeight: 'bold',justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, marginRight: 40}
            : { color: 'white' , fontSize: 20, fontWeight: 'bold',justifyContent: 'center', alignItems: 'center'} }>Clear</Text></View>}
              onClearPressed={() => {
              }}
            />
          </View>
                            </View>
                        </View>
                        
                        {/* <View style={{ flexDirection: 'row', width: '100%', height: '8%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1EA2BC' }}>
                            <TouchableHighlight underlayColor={"#006780"} style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {  this.refs.sketchRef.clear() }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{strings('DrawThis.clear')}</Text>
                                
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={"#006780"} style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#006780' }} onPress={() => { 
                                 this.refs.sketchRef.save() }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{strings('DrawThis.done')}</Text>
                            </TouchableHighlight> 
                          
                         
                            { <TouchableHighlight underlayColor={"#006780"} style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: this.isEraserToolSelected() ? "#006780" : "rgba(0,0,0,0)" }} onPress={
                              this.toolChangeClick.bind(this)
                           
                            } 
                                >
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{strings('DrawThis.eraser')}</Text>
                            </TouchableHighlight> }
                        </View> */}
               


                    </View>
                );
            default:
                return (
                    <KeyboardAwareScrollView>
                        <View style={{ padding: 30, width: '100%', height: '100%', backgroundColor: '#C3E3E4' }}>
                            <View style={{  alignItems: 'center', backgroundColor: '#FF7F00' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                    {strings('DrawThis.your_drawing')}
                                </Text>
                            </View>
                            <View style={{ width: '100%', height: 150,  alignItems: 'center', backgroundColor: 'white' }}>
                                <View style={{ height: '100%', aspectRatio: 1.3, alignItems: 'center' }}>
                                    <Image
                                        style={{
                                            alignSelf: 'center',
                                            height: '100%',
                                            width: '100%',
                                        }}
                                        source={{ uri: this.state.myURL }}
                                        resizeMode="stretch"
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 20 }}></View>
                            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', width: '30%', alignItems: 'center' }}>
                                    <Text style={{ marginLeft: 20, fontSize: 14, fontWeight: 'bold', color: '#7F7F7F' }}>
                                        {strings('DrawThis.username')}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center'}}>
                                    <Autocomplete
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        hideResults={this.state.hideResults}
                                        listStyle={{ marginLeft: 17 }}
                                        containerStyle={[styles.autocompleteContainer, { borderWidth: 0 }]}
                                        inputContainerStyle={{ borderWidth: 0, marginLeft: 10, marginRight: 10 }}
                                        data={films}
                                        defaultValue={query}
                                        onChangeText={text => this.setState({ query: text, hideResults: false })}
                                        placeholder={strings('DrawThis.enter_friends')}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => this.setState({ query: item.username, hideResults: true })}>
                                                <Text style={styles.itemText}>
                                                    {item.username}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 1, flexDirection: 'row', width: '100%', height: 50, backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', width: '30%', height: 50, alignItems: 'center' }}>
                                    <Text style={{ marginLeft: 20, fontSize: 14, fontWeight: 'bold', color: '#7F7F7F' }}>
                                        {strings('DrawThis.correct_response')}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '60%', height: 50, alignItems: 'center' }}>
                                    <Text style={{ marginLeft: 20, fontSize: 14, color: 'black' }}>
                                        {this.state.WordToSpeak}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 30, width: '100%', height: 50 }} >
                                <View style={{ width: '90%', height: '100%', }} >
                                    <Button
                                        title={strings('DrawThis.submit')}
                                        textStyle={{
                                            fontSize: 24,
                                            fontWeight: 'bold'
                                        }}
                                        buttonStyle={{
                                            backgroundColor: '#FF7F00',
                                            width: '100%',
                                            height: 45,
                                        }}
                                        onPress={this.onButtonSend.bind(this)} />
                                </View>
                            </View>
                            <Text style={styles.errorTextStyle}>
                                {this.state.error}
                            </Text>
                        </View>
                    </KeyboardAwareScrollView>
                );
        }

    }

    renderModalContent() {

        const { navigate } = this.props.navigation;

        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#C3E3E4' }}>
                <ElevatedView style={{ width: '100%', height: 60, backgroundColor: '#2496BE' }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                                navigate('Start');
                            }}>
                                <Icon name='arrow-left' type='feather' color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                {strings('AllGames.draw_this')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', paddingRight: 15 }}>
                            <Icon name='home' type='FontAwesome' color='white' />
                        </View>
                    </View>
                </ElevatedView>

                <View style={{ width: '100%', height: '100%', paddingHorizontal: 40, backgroundColor: '#C3E3E4' }}>
                    <View style={{ width: '100%', height: '80%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, color: '#2496BE' }} >{strings('DrawThis.submitted')}</Text>
                        <Text></Text>
                        <Text style={{ fontSize: 20, color: '#2496BE' }}>{strings('DrawThis.you_and_friend')}</Text>
                        <Text></Text>
                        {/* <Text style={{fontSize:20, color:'#2496BE'}}>Fingers crossed :)</Text> */}

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
                                        this.setModalVisible(!this.state.modalVisible);
                                        const lessonID = this.props.navigation.getParam('lessonID')
                                        console.log('lessonID:', lessonID)
                                        firestore().collection('user').doc(this.props.user.uid).collection('lesson').doc(lessonID).update({
                                            end: Date.now()
                                        }).then(()=>{
                                            navigate('Start')

                                        })
                                    }} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        // The screen's current route is passed in to `props.navigation.state`:
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#C3E3E4' }}>
                {this.renderContent()}

                <Spinner visible={this.state.loadingScene} />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                    }}>
                    {this.renderModalContent()}
                </Modal>

            </View>
        );
    }
}

const styles = {
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
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    strokeColorButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 40, width: 100,
        backgroundColor: '#1EA2BC', justifyContent: 'center', alignItems: 'center'
    },
    autocompleteContainer: {
        borderWidth: 0,
        width: '70%',
        height: 70,
        // flex: 1,
        // left: 0,
        // position: 'absolute',
        // right: 0,
        top: 15,
        // zIndex: 1
    },
    MyNewcontainer: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 10
    },
    itemText: {
        fontSize: 15,
        margin: 2,
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: '#F5FCFF',
        marginTop: 25
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    }
};

function mapStateToProps(state) {
    return {
        user: state.user,
        friends: state.friends,
        lang: state.lang
    }
}

export default connect(mapStateToProps, {})(DrawThisScreen);
