import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { Button, Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import ElevatedView from 'react-native-elevated-view'
import {setProfilePics, setIslandPics, setXp} from '../redux/action'
import { Dimensions } from 'react-native';

class SliderEntryVIP extends Component {

    state = {
        modalVisible: false,
        xp: 0,
        bought: 0
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
            <View>
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
            
            </View>
        );
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    buyPicture() {
        const { data, userValues } = this.props;
        const myXP = this.props.xp;
        const profilePics = this.props.profilePics.profilePics;
        const islandPics = this.props.islandPics;

        // console.log(this.state.profilePics);

        if(data.hasOwnProperty('type')) { 

            if (islandPics.filter(function(e) { return e.title === data.title; }).length > 0) {
                this.setState({bought:1});
            } else if (myXP - data.xp >= 0) {
                const restXP = myXP - data.xp;
                
                islandPics.push(data);
                this.setIslandPics(this.props.user.uid, islandPics)
                this.props.setXp(this.props.user.uid, restXP)
                this.setState({bought: 3})

            } else {
                this.setState({bought:3});
            }

        } else {     

            if (profilePics.filter(function(e) { return e.title === data.title; }).length > 0) {
                this.setState({bought:1});    
            } else if (myXP - data.xp >= 0 ) {
                const restXP = myXP - data.xp;

                profilePics.push(data);
                this.props.setXp(this.props.user.uid, restXP)
                this.props.setProfilePics(this.props.user.uid, profilePics)
                this.setState({bought: 2})
                
            } else {
                this.setState({bought:3});
            }

        }
    }

    render () {
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        const { data: { PTdescription, PTtitle, title, description, subtitle, xp, illustration }, even, dataFull } = this.props;

        if (this.state.languageLearning == 'Portuguese') {
            var myTitle = title;
            var myDescription = description;
        } else {
            var myTitle = PTtitle;
            var myDescription = PTdescription;
        }

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : styles.titleEven]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        var newwidth = viewportWidth;

        return (
            <View style={{width:newwidth, justifyContent:'center',alignItems:'center' }}>
            <View style={{ width:100, height:100,  marginLeft: 30, marginRight: 70, backgroundColor:'white' }}>
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
            
           </View>
            <Text style={{ textAlign:'center', marginTop:15, marginLeft: 30, marginRight: 70, fontWeight:'bold', fontSize:20, color:'#EE202E'}}>{myTitle}</Text>
            <Text style={{ textAlign:'center',marginTop:15, marginLeft: 30, marginRight: 70, color:'#63B1DC'}}>{myDescription}</Text>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        lang: state.lang,
        profilePics: state.profilePics,
        islandPics: state.islandPics,
        xp: state.xp
    }
}

export default connect(mapStateToProps, {setProfilePics, setIslandPics, setXp})(SliderEntryVIP);
