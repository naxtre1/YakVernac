import React, { useState, useEffect, useContext, useRef } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import {
    View,
    StyleSheet,
    Text,
    Image,
    ImageBackground
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
    }
})

export default function FileUpload({ size, padding, title, titleColor, backgroundColor, getPath, imageUrl }) {
    const fuSize = size ? size : 200
    const fuPadding = padding ? padding : 20
    const fuTitleColor = titleColor ? titleColor : 'black'
    const fuBackgroundColor = backgroundColor ? backgroundColor : 'auto'
    const iconSize = fuSize - fuPadding * 2 - 40
    const borderRadius = iconSize / 5
    const innerPadding = borderRadius
    const [uploadFile, setUploadFile] = useState(imageUrl)
    useEffect(() => {
        setUploadFile(imageUrl)
    }, [imageUrl])
    const handleUpload = () => {
        ImagePicker.openPicker({
            // mediaType:'any',
            cropping: true
        }).then(image => {
            console.log("What is it : ", image);
            getPath(image.path)
            setUploadFile(image.path)
        }).catch(err => {
            console.log("What is it : ", err);
            getPath(null)
            setUploadFile(null)
        })
    }
    const handleX = () => {
        setUploadFile(null)
        getPath(null)
    }
    const iconTitle = title ? title : ''

    return uploadFile
        ?
        // (iconSize+fuPadding) < 50
        // ?
        <ImageBackground
            style={[styles.container, { width: fuSize, height: fuSize, borderColor: fuBackgroundColor, borderWidth: 2 }]}
            source={{ uri: uploadFile }}
        >
            {/* <Image style={{
                resizeMode: 'cover',
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center'
            }} source={{ uri: uploadFile }} /> */}
            <Icon name='trash' size={24} style={{ alignSelf: 'center', position: 'absolute', bottom: 12, padding: 12 }} color='red' onPress={handleX} />
            {/* <Icon name='x' size={size/2} style={{alignSelf: 'center', position: 'absolute', bottom: 12}} color='red' onPress={handleX}/> */}
        </ImageBackground>
        // :
        // <View style={[styles.container, {padding: fuPadding, width: fuSize, height: fuSize, backgroundColor: fuBackgroundColor}]}>
        //     <Image source={{uri: uploadFile}} style={{width: iconSize+fuPadding, height: iconSize+fuPadding, alignSelf: 'center'}} />
        //     <Icon name='x' size={30} style={{alignSelf: 'center'}} color='red' onPress={handleX}/>
        // </View>

        :
        (
            // <View style={[styles.container, { padding: fuPadding, width: fuSize, height: fuSize, backgroundColor: fuBackgroundColor }]}>
            //     <Icon
            //         name='upload'
            //         size={iconSize}
            //         style={{ borderRadius, padding: innerPadding, backgroundColor: 'white' }}
            //         onPress={handleUpload}
            //     />
            //     <Text style={{ color: fuTitleColor, marginTop: innerPadding }}>{iconTitle}</Text>
            // </View>

            <View style={[styles.container, { padding: fuPadding, width: fuSize, height: fuSize, backgroundColor: fuBackgroundColor }]}>
                <Icon
                    name='upload'
                    size={24}
                    style={{ borderRadius, padding: innerPadding, backgroundColor: 'white' }}
                    onPress={handleUpload}
                />
                <Text style={{ color: fuTitleColor, marginTop: innerPadding }}>{iconTitle}</Text>
            </View>
        )
}