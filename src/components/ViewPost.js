import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { Header } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather'

import OnePost from './OnePost'
import { connect } from 'react-redux'
import { CustomHeader } from './common/CustomHeader'

const ViewPost = (props) => {
    const rowData = props.navigation.getParam('rowData')
    const index = props.navigation.getParam('index')
    const query = props.navigation.getParam('query')
    // const user = props.navigation.getParam('user')
    const onSoundPlay = props.navigation.getParam('onSoundPlay')
    const blockList = props.navigation.getParam('blockList')
    const startGame = props.navigation.getParam('startGame')
    const setLoading = props.navigation.getParam('setLoading')
    const refreshPage = props.navigation.getParam('refreshPage')
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header backgroundColor='#2496BE'
                containerStyle={{ height: 60, alignSelf: 'center' }}
                leftComponent={
                    <Feather name='arrow-left' color='white' size={25}
                        onPress={() => props.navigation.navigate('Profile')} />
                }
            />
            <OnePost
                rowData={rowData}
                index={index}
                navigation={props.navigation}
                query={query}
                user={props.user}
                onSoundPlay={onSoundPlay}
                blockList={blockList}
                startGame={startGame}
                setLoading={setLoading}
                refreshPage={refreshPage}
            />

        </SafeAreaView>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(ViewPost);