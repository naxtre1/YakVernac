import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Home from '../../assets/home.png'
import Profile from '../../assets/profile.png'
import AddPost from '../../assets/add.png'
import Chat from '../../assets/message.png'
import More from '../../assets/more.png'
import { colors } from '../../static/constant';

const BottomIcon = (props) => {
    return (
        <Image
            style={props.isActive ? styles.imageActive : styles.imageInactive}
            source={props.routeName == 'Start'
                ? Home
                : props.routeName == 'Profile'
                    ? Profile
                    // : props.routeName == 'Chat'
                    : props.routeName == 'PostScreen'
                        ? Chat
                        : props.routeName == 'Buy'
                            ? More
                            : AddPost}
            // source={props.routeName == 'Bookings' ? require('../assets/img/tab_booking.png') : require('../assets/img/tab_menu.png')}
            resizeMode='contain'
        />
    );
}

const styles = StyleSheet.create({
    imageActive: {
        width: 20,
        height: 20,
        tintColor: colors.darkOrange,
    },
    imageInactive: {
        width: 20,
        height: 20,
        tintColor: '#E0E0E0',
    }
})

export default BottomIcon;