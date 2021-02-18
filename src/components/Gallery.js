import React, { Component } from 'react';
import { Text, View, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import ModernHeader from './common/ModernHeader';
import { p } from './common/normalize';
import axios from 'axios';


export default class Gallery extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <ModernHeader title='Gallery' navigation={navigation} />,
            headerStyle: {
                backgroundColor: '#2496BE',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    }

    state = {
        gallerys: null
    }

    componentDidMount() {
        axios.get(`https://picsum.photos/v2/list?page=2&limit=100`)
            .then(res => {
                const gallerys = res.data;
                this.setState({ gallerys });
            })
    }

    _renderItem = ({ item, key }) => (
        <TouchableOpacity
            key={key}
            style={{ marginBottom: p(8), flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Image
                source={{ uri: item.download_url }}
                style={{ width: p(80), height: p(80), borderRadius: p(3) }}
            />

        </TouchableOpacity>
    )

    render() {
        const { gallerys } = this.state;
        return (
            <View style={styles.container}>

                {
                    gallerys &&
                    <FlatList
                        style={{ marginTop: 12 }}
                        numColumns={4}
                        data={gallerys}
                        keyExtractor={(item, i) => String(i)}
                        renderItem={this._renderItem}
                    />
                }

            </View>
        );
    }
}

const styles = {

};
