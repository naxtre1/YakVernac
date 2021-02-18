import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { Button, Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import ElevatedView from 'react-native-elevated-view';
import { strings } from '../../src/locales/i18n';
import {setXp, setIslandPics, setProfilePics} from '../redux/action'

class SliderEntry extends Component {

    state = {
        modalVisible: false,
        bought: 0,
      };


    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : styles.imageContainerEven]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    // getUpdatedUser = async () => {
    //     try {
          
    //         database().ref('/users/' + this.state.userId).once('value')
    //             .then(function(snapshot) {
    //             // console.log(snapshot.val());
    //             const values = snapshot.val();

    //             self.setState({ xp:values.xp, profilePics:values.profilePics });
                
    //             console.log('ATSINAUJINO USERIS ------------');
    //             return values;

    //             })
    //             .catch(() => {
    //             console.log('NIEKO NEGAVAU!');
    //             });
        
    //     } catch (error) {
    //       console.log('CATCH CIKLAS...')
    //     }
    //   }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    buyPicture() {
        const { data, userValues } = this.props;

        var myXP = this.props.xp;
        const islandPics = this.props.islandPics;

        if(data.hasOwnProperty('type')) { 

            if (islandPics.filter(function(e) { return e.title === data.title; }).length > 0) {
                this.setState({bought:1});
            } else if (myXP - data.xp >= 0) {
                var restXP = myXP - data.xp;
                
                islandPics.push(data);
                this.props.setXp(this.props.user.uid, restXP)
                this.props.setIslandPics(this.props.user.uid, islandPics)
                this.setState({bought: 2})
                // database().ref(`/users/${this.state.userId}`)
                // .update({xp: restXP, islandPics: newArray})
                // .then(() => {
                //     this.setState({bought:2, xp:restXP, MyislandPics: newArray})
                // })
                // .catch(() => {
                //     console.log('could not update the profile values!')
                // })

            } else {
                this.setState({bought:3});
            }

        } else {     
            const profilePics = this.props.profilePics.profilePics
            if (profilePics.filter(function(e) { return e.title === data.title; }).length > 0) {
                this.setState({bought: 1});    
            } else if (myXP - data.xp >= 0 ) {
                const restXP = myXP - data.xp;

                profilePics.push(data);
                this.props.setXp(this.props.user.uid, restXP)
                this.props.setProfilePics(this.props.user.uid, profilePics)
                this.setState({bought: 2})
                // database().ref(`/users/${this.state.userId}`)
                // .update({xp:restXP, profilePics:newArray})
                // .then(() => {
                //     this.setState({bought:2, xp:restXP, profilePics: newArray})
                // })
                // .catch(() => {
                //     console.log('could not update the profile values!')
                // })            
                
            } else {
                this.setState({bought:3});
            }

        }
    }

    renderContent() {
        const { data, userValues } = this.props;

        switch (this.state.bought) {
            case 3:
                return (
                    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                    
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
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
                  <View style={{ width:'100%', height:25, justifyContent:'center',}}></View>
                            <View style={{width:'100%',height:100, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ marginHorizontal:15, textAlign:'center', fontSize:20, fontWeight:'bold', color:'#009CD7'}}>
                                    You do not have sufficient XP to buy '{strings(data.title)}' profile picture!
                                </Text>
                                <Text style={{ marginHorizontal:15, textAlign:'center', fontSize:20, fontWeight:'bold', color:'#009CD7'}}>
                                    You can go back and search for other awesome items :)
                                </Text>
                            </View>
                            <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                            <View style={{ width:'100%', height:25, justifyContent:'center',}}></View>
                        </ElevatedView>
                    </View>
                )
            case 2:
                return (
                    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                    <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                    
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
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
                  <View style={{ width:'100%', height:25, justifyContent:'center',}}></View>
                            <View style={{width:'100%',height:100, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ marginHorizontal:15, textAlign:'center', fontSize:20, fontWeight:'bold', color:'#009CD7'}}>
                                    Thanks for buying '{strings(data.title)}' profile picture!
                                </Text>
                                <Text style={{ marginHorizontal:15, textAlign:'center', fontSize:20, fontWeight:'bold', color:'#009CD7'}}>
                                    You can go back and search for other awesome items :)
                                </Text>
                            </View>
                            <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                            <View style={{ width:'100%', height:35, alignItems:'center', justifyContent:'center',}}>
                                <View style={{width:35, height:35}}>
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
                            <View style={{ width:'100%', height:25, justifyContent:'center',}}></View>
                        </ElevatedView>
                    </View>
                )
            case 1: 
                return (
                    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                    
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
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
              <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                            <View style={{width:'100%',height:100, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ marginHorizontal:15, textAlign:'center', fontSize:20, fontWeight:'bold', color:'#009CD7'}}>
                                    
                                    You already have '{strings(data.title)}' profile picture!
                                </Text>
                                <Text style={{ marginHorizontal:15, textAlign:'center', fontSize:20, fontWeight:'bold', color:'#009CD7'}}>
                                    You can go back and search for other awesome items :)
                                </Text>
                            </View>
                            <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                            <View style={{ width:'100%', height:35, alignItems:'center', justifyContent:'center',}}>
                                <View style={{width:35, height:35}}>
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
                            <View style={{ width:'100%', height:25, justifyContent:'center',}}></View>
                        </ElevatedView>
                    </View>
                   
                )
            default:
                return (
                    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                   
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                    <Icon
                      color='white'
                      size={25}
                      name='circle-with-cross'
                      type='entypo'
                    />
                  </TouchableOpacity>
                </View>
              </View>
                        <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                            <View style={{width:'100%',height:100, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{ margin:15,textAlign:'center', fontSize:20, fontWeight:'bold', color:'black'}}>
                                    {/* Do you want to buy "{myTitle}" for {data.xp} ? */}
                                    {strings('BuyScreen.want_buy', {myTitle:strings(data.title), xp:data.xp})}
                                </Text>
                            </View>
                        <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around',alignItems:'center' }}>
                                <View style={{ flex:1, width:100, height:40, justifyContent:'center', alignItems:'center'}}>
                                    <Button 
                                        title={strings('BuyScreen.Buy')}
                                        textStyle={{
                                            fontSize:15,
                                            fontWeight:'bold'
                                        }}
                                        buttonStyle={{
                                            backgroundColor:'#F68D3D',
                                            width:100,
                                            height:40,
                                        }}
                                        onPress={() => this.buyPicture()}
                                    />
                                </View>
                                <View style={{ flex:1, width:100, height:40, justifyContent:'center', alignItems:'center'}}>
                                    <Button 
                                        title={strings('BuyScreen.Cancel')}
                                        textStyle={{
                                        fontSize:15,
                                        fontWeight:'bold'
                                        }}
                                        buttonStyle={{
                                        backgroundColor:'#2496BE',
                                        width:100,
                                        height:40,
                                        }}
                                        onPress={() => { this.setModalVisible(!this.state.modalVisible); }}
                                    />
                                </View>
                            </View>
                            <View style={{ width:'100%', height:15, justifyContent:'center',}}></View>
                        </ElevatedView>
                    </View>
                )    
        }
    }

    render () {
        const { data: { title, subtitle, xp, PTtitle }, even, dataFull } = this.props;

        const uppercaseTitle = strings(title) ? (
            <Text
              style={[styles.title, even ? styles.titleEven : styles.titleEven]}
              numberOfLines={2}
            >
                { strings(title).toUpperCase() }
            </Text>
        ) : false;

        return (
            <View>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { this.setModalVisible(true); }}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : styles.imageContainerEven]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : styles.radiusMaskEven]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : styles.textContainerEven]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : styles.subtitleEven]}
                      numberOfLines={2}
                    >
                        { strings(subtitle) }
                    </Text>
                </View>
            </TouchableOpacity>

                <Modal
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                    animationType="slide"
                    transparent={true}
                    isVisible={this.state.modalVisible}
                    onRequestClose={() => {
                    alert('Modal has been closed.');
                }}>
                    {this.renderContent()}
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) {
	return {
        user: state.user,
        xp: state.xp,
        lang: state.lang,
        profilePics: state.profilePics,
        islandPics: state.islandPics
	}
}
  
export default connect(mapStateToProps, {setXp, setIslandPics, setProfilePics})(SliderEntry);

