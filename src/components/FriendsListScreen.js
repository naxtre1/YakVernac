import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button, TextInput, ScrollView, FlatList, RefreshControl} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import firestore from '@react-native-firebase/firestore'
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";
import ElevatedView from 'react-native-elevated-view';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { CustomHeader } from './common/CustomHeader';
import { showMessage } from "react-native-flash-message";
import { strings } from '../../src/locales/i18n';
import { p } from './common/normalize';
import { addFriend, removeFriend } from '../redux/action'

class FriendsListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('FriendsList.friends_list'),
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
    state = {
        name: "",
        uid: null,
        email: "",
        searchText: ''
    };

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
            this.state = {
                MydataSource: [],
                MySearchFriends: [],
                loading: true,
                films: [],
                query: '',
                blockedOn: false,
                openModalForBLocking: false,
                blockthisUser: ''
            };
    }

    findFilm(query) {
        if (query === '' || query.length <= 2) {
            return [];
        }

        const { films } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        // console.log(films.filter(film => film.username.search(regex) >= 0));
        var myfilms = films.filter(film => film.username.search(regex) >= 0);
        // this.setState({MySearchFriends:myfilms})
        return myfilms;
    }

    listenForItems(text) {
        this.setState({ loading: true });
        // friendsRef.on("value", snap => {
        if (text.length >= 3) {

            const items = []
            firestore().collection('user').get().then(col => {
                for (const doc of col.docs) {
                    const data = doc.data()
                    if (data) {
                        const username = data.username
                        if (data.email && data.email !== this.props.user.email && username.includes(text)) {
                            items.push({
                                username: data.username,
                                uid: data.uid,
                                email: data.email,
                                myPic: data.myPic,
                                languageNative: data.languageNative,
                                languageLearning: data.languageLearning,
                                blockedBy: data.blockedBy,
                                age: data.age,
                                sex: data.sex,
                                premium: data.premium
                            });
                        }
                    }
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    loading: false
                });
            })

        } else {

            const friends = []
            for (const key in this.props.friends) {
                const friend = this.props.friends[key]
                friend['uid'] = key
                friends.push(friend)
            }
            const blockeds = []
            for (const key in this.props.blockeds) {
                const blocked = this.props.blockeds[key]
                blocked['uid'] = key
                blockeds.push(blocked)
            }
            this.setState({
                MyblockedPeople: blockeds,
                MydataSource: friends,
                loading: false
            });
            // database().ref().child("users").child(`${this.props.user.uid}`).child("friends").on('value', (snap) => {
            //   var Myitems = [];
            //   snap.forEach(child => {
            //     Myitems.push({
            //       name: child.val().username,
            //       uid: child.val().uid,
            //       email: child.val().email,
            //       pic: child.val().myPic,
            //       langNative: child.val().languageNative,
            //       langLearning: child.val().languageLearning,
            //       friend: true,
            //       blockedBy: child.val().blockedBy,
            //       age: child.val().age,
            //       checkedMale: child.val().checkedMale,
            //       premium: child.val().premium
            //     });
            //   });
            //   const friends = []
            //   for (const key in this.props.friends) {
            //     friends.push(this.props.friends[key])
            //   }
            //   this.setState({
            //     MyblockedPeople: Myitems,
            //     // myBestFriends: items,
            //     // dataSource: this.state.dataSource.cloneWithRows(items),
            //     MydataSource: friends,
            //     loading: false
            //   });

            // });

        }

    }



    componentDidMount() {
        this.listenForItems('');

        // var myArray = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}];
        // console.log(myArray.find(x => x.id === '45'));

        const allUsers = []
        firestore().collection('user').get().then(snapshot => {
            for (const doc of snapshot.docs) {
                allUsers.push(doc.data())
            }
        })
        this.setState({ films: allUsers })
        // database().ref(`/users`).once("value", snap => {
        //   var results = snap.val();
        //   var allUsers = Object.values(results);

        //   self.setState({ films: allUsers });

        // })
    }

    blockFriend(rowData) {

        const { navigate } = this.props.navigation;
        // console.log(rowData);

        var myCurrentFriends = this.state.myBestFriends;

        // for(var i = 0; i < myCurrentFriends.length; i++) {
        // if (myCurrentFriends[i].name == row.name) {
        //     break;
        // } else {

        var blockedById = this.props.user.uid;
        const blockedBy = rowData.blockedBy
        blockedBy.push(this.props.user.uid)
        firestore().collection('user').doc(rowData.uid).update({ blockedBy }).then(() => {
            this.props.removeFriend(this.props.user.uid, blockedById)
            this.setState({ openModalForBLocking: false });
            navigate('FriendsList');
            this.setState({ loading: false })
        })
        // database().ref()
        //   .child(`/users/${rowData.uid}/blockedBy/${blockedById}`)
        //   .set(this.props.user.uid)
        //   .then(() => {
        //     // const key = snap.key;
        //     // console.log(snap);
        //     var survey = database().ref(`/users/${this.props.user.uid}/friends`);    //Eg path is company/employee                
        //     survey.child(rowData.uid).remove()
        //     showMessage({
        //       message: 'User has been blocked sucessfully',
        //       description: 'Redirecting...',
        //       type: "success",
        //     });

        //     this.setState({ openModalForBLocking: false });
        //     navigate('FriendsList');


        //     this.setState({ loading: false })

        //   })
        //   .catch(() => {
        //     console.log('NEIRASE I DB !!!')
        //   })

        // }
        // }

    }

    unblockFriend(rowData) {
        const { navigate } = this.props.navigation;
        const blockedBy = rowData.blockedBy
        for (var index = 0; index < blockedBy.length; index++) {
            if (blockedBy[index] == this.props.user.uid) {
                blockedBy.splice(index, 1)
                break
            }
        }
        firestore().collection('user').doc(rowData.uid).update({ blockedBy }).then(() => {
            showMessage({
                message: 'User has been unblocked!',
                description: 'Redirecting...',
                type: "success",
            });

            // this.setState({ openModalForBLocking: false });
            navigate('FriendsList');

        })

        // var survey = database().ref(`/users/${rowData.uid}/blockedBy`);    //Eg path is company/employee                
        // survey.child(this.props.user.uid).remove()

        // showMessage({
        //   message: 'User has been unblocked!',
        //   description: 'Redirecting...',
        //   type: "success",
        // });

        // // this.setState({ openModalForBLocking: false });
        // navigate('FriendsList');

    }

    checklastmessage(rowData) {
        if (rowData.lastMessage) {
            if (rowData.lastMessage.indexOf('game:') != -1) {
                return (
                    <Text>Invited Game!</Text>
                )
            }
            return (
                <Text>{rowData.lastMessage}</Text>
            )

        }
        return (
            <Text>No messages yet!</Text>
        )

        // firestore().collection('chat').where('user', 'array-contains-any', [this.props.user.uid, rowData.uid]).get().then(snapshot=>{
        //     if (snapshot.docs.length == 0) {
        //         return (
        //             <Text>No messages yet!</Text>
        //         )

        //     }
        //     const chatID = snapshot.docs[0].id
        //     firestore().collection('chat').doc(chatID).collection('msg').limit(1).get().then(lastMessageSnapshot=>{
        //         if (lastMessageSnapshot.docs.length == 0) {
        //             return (
        //                 <Text>No messages yet!</Text>
        //             )

        //         }
        //         const lastMessage = lastMessageSnapshot.docs[0].data()
        //         if (lastMessage) {
        //             if (result.hasOwnProperty("text") && result.text.length > 25) {
        //                 var message = result.text.substring(0, 25);
        //                 message = message + '...';
        //             } else {
        //                 var message = result.text;
        //             }
        //             return (
        //                 <Text>{message}</Text>
        //             )
        //         } else {
        //             return (
        //                 <Text>No messages yet!</Text>
        //             )
        //         }

        //     })

        // })

    }

    renderRow = rowData => {
        if (rowData.blockedBy.indexOf(this.props.user.uid) > -1) {
            var itHasBlocked = true;
        } else {
            var itHasBlocked = false;
        }

        switch (itHasBlocked) {
            case true:
                return (
                    <View style={{ flexDirection: 'row', height: 120, borderBottomColor: '#BEE1EB', borderBottomWidth: 1 }}>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, justifyContent: 'center', borderRadius: 30, backgroundColor: '#84BCD5' }}>
                                <Image
                                    source={{ uri: rowData.myPic }}
                                    style={{ width: 60, height: 60, alignSelf: 'center', borderRadius: 30 }}
                                    resizeMode='contain'
                                />
                            </View>
                        </View>
                        <View style={{ flex: 7, paddingTop: 15, paddingRight: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 18, color: '#BCBEC0', fontWeight: 'bold' }}>{rowData.username}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#00A1AF' }}>(User has been blocked)</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon
                                        name='block'
                                        size={17}
                                        color='#04A9D3'
                                        onPress={() => this.unblockFriend(rowData)}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    // <Text>THIS USER WAS BLOCKED</Text>
                    //   <TouchableOpacity
                    //   onPress={() => {
                    //     // console.log(rowData)
                    //   }}
                    // >
                    //   <View style={styles.profileContainer}>
                    //     <Text style={styles.profileName}>{rowData.name} (User has been blocked)</Text>

                    //     <Icon
                    //       name='block'
                    //       color='#2496BE'
                    //       onPress={() => this.unblockFriend(rowData)} />

                    //   </View>
                    // </TouchableOpacity>
                );
            case false:
                return (
                    <TouchableOpacity
                        style={{ flexDirection: 'row', height: 120, borderBottomColor: '#BEE1EB', borderBottomWidth: 1 }}
                        onPress={() => {
                            this.props.navigation.navigate('Chat', { uid: rowData.uid });
                        }}
                    >
                        <View style={{ margin:10, flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, justifyContent: 'center', borderRadius: 30, backgroundColor: '#84BCD5' }}>
                                {rowData.username == "YakVernac Support" &&
                                    <Image
                                        source={{ uri: rowData.myPic }}
                                        style={{ width: 60, height: 60, alignSelf: 'center', borderRadius: 30 }}
                                        resizeMode='contain'
                                    />
                                }
                                {rowData.username != "YakVernac Support" &&
                                    <Image
                                        source={{ uri: rowData.myPic }}
                                        style={{ width: 60, height: 60, alignSelf: 'center', borderRadius: 30 }}
                                        resizeMode='contain'
                                    />
                                }

                            </View>
                        </View>
                        <View style={{ flex: 7, paddingTop: 15, paddingRight: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 18, color: '#04A9D3', fontWeight: 'bold' }}>{rowData.username}</Text>

                                {rowData.premium &&

                                    <Icon
                                        name='crown'
                                        type='foundation'
                                        color='#517fa4'
                                        style={{ marginLeft: 1, alignItems: 'flex-start' }}
                                    />

                                }
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 12, color: '#63B1DC' }}>{strings('FriendsList.age')} </Text>
                                    <Text style={{ fontSize: 12, color: '#63B1DC' }}>{rowData.age}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    {/* <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#00A1AF' }}>Currently Learning:</Text> */}
                                    <Text style={{ fontSize: 12, color: '#F15A29', fontWeight: 'bold' }}>{rowData.languageNative} {'>'} {rowData.languageLearning}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon
                                        name='male'
                                        size={20}
                                        type='font-awesome'
                                        color={(rowData.sex == 'male') ? '#63B1DC' : '#BEE1EB'}
                                    />
                                    <Icon
                                        name='female'
                                        size={20}
                                        type='font-awesome'
                                        color={(rowData.sex == 'female') ? '#63B1DC' : '#BEE1EB'}
                                    />

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <View style={{ flex: 9 }}>
                                    <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#63B1DC' }}>{this.checklastmessage(rowData)}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch', alignItems: 'flex-end' }}>
                                    <Icon
                                        size={17}
                                        name='block'
                                        color='#E1423A'
                                        onPress={() => this.removeFriend(rowData)}
                                    />
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>
                );
        }
    };

    removeFriend(rowData) {
        this.props.removeFriend(this.props.user.uid, rowData.uid)
    }

    addFriend(row) {
        const { navigate } = this.props.navigation;

        var myCurrentFriends = this.state.MyblockedPeople;
        var IsPresent = false;
        // console.log(row.name);
        for (var i = 0; i < myCurrentFriends.length; i++) {
            // console.log(myCurrentFriends);
            if (myCurrentFriends[i].name == row.username) {
                // console.log(myCurrentFriends[i].name);
                var IsPresent = true;
                break;
                // } else {
            }
        }

        var rowId = row.uid;
        // console.log(IsPresent);
        if (IsPresent == false || myCurrentFriends.length == 0) {
            firestore().collection('user').doc(rowId).get().then(doc => {
                showMessage({
                    message: 'User has been saved!',
                    description: 'Redirecting...',
                    type: "success",
                });
                const friend = doc.data()
                this.props.addFriend(this.props.user.uid, rowId, friend)
                this.setState({ loading: false, query: '' })
            })
            // database().ref().child("users").child(this.props.user.uid).child("friends").child(rowId)
            //   .set(row)
            //   .then(() => {

            //     showMessage({
            //       message: 'User has been saved!',
            //       description: 'Redirecting...',
            //       type: "success",
            //     });

            //     // this.setState({ openModalForBLocking: false });
            //     navigate('FriendsList');

            //     this.setState({ loading: false })

            //   })
            //   .catch(() => {
            //     console.log('NEIRASE I DB !!!')
            //   })
        }
    }

    longBlock(user) {
        this.setState({ blockthisUser: user });
        // this.setState({blockedOn:true});
        this.setState({ openModalForBLocking: true });
    }

    shortChat(user) {
        const { navigate } = this.props.navigation;

        navigate("Chat", {
            uid: user.uid
        });
    }

    _renderModalContent() {
        return (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <ElevatedView elevation={4} style={{ borderTopStartRadius: 3, borderTopEndRadius: 3, borderBottomStartRadius: 5, borderBottomEndRadius: 5, width: '100%', backgroundColor: 'white' }}>
                    <View style={{ width: '100%', height: 45, flexDirection: 'row', borderTopStartRadius: 3, borderTopEndRadius: 3, backgroundColor: '#F15A29' }}>
                        <View style={{ width: '85%', paddingLeft: 15, height: 45, justifyContent: 'center', }}>
                            <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                {/* Translation */}
                            </Text>
                        </View>
                        <View style={{ width: '15%', height: 45, justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 6, paddingTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({ openModalForBLocking: false });
                            }}>
                                <Icon
                                    color='white'
                                    size={25}
                                    name='circle-with-cross'
                                    type='entypo'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', width: '100%', height: 45, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                Last Chance!
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: 200, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginTop: 30, fontSize: 20, fontWeight: 'bold', color: '#F68D3D', alignSelf: 'center' }}>
                                Do you want to block
                            </Text>
                            <Text style={{ marginBottom: 40, fontSize: 20, fontWeight: 'bold', color: '#F68D3D', alignSelf: 'center' }}>
                                username?
                            </Text>
                            <Icon
                                size={50}
                                //name='block'
                                name='check-circle'
                                type='font-awesome'
                                color='#3DB984'
                                onPress={() => this.blockFriend(this.state.blockthisUser)}
                            />
                        </View>
                    </View>
                </ElevatedView>
            </View>
        )
    }

    renderFilm(film, index) {

        var blockedUsers = film.blockedBy;
        // console.log("Row Data");
        // console.log(film);

        if (film.hasOwnProperty('friend')) {
            var star = 'star';
        } else {
            var star = 'star-o';
        }


        if (blockedUsers.indexOf(this.props.user.uid) > -1) {
            var itHasBlocked = true;
        } else {
            var itHasBlocked = false;
        }

        if (itHasBlocked) {
            return (
                // <View>
                // <Text>{film.username}</Text>
                // <Text>User was blocked!</Text>
                // <Icon
                //     name='block'
                //     color='#2496BE'
                //     onPress={() => this.unblockFriend(film)} />
                // </View>

                <View style={{ width: '100%', justifyContent: 'center', marginBottom: 10, alignItems: 'center' }}>
                    <View style={{ width: '90%', height: 115, flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 3, marginVertical: 5, paddingVertical: 10, backgroundColor: '#EAF6F7', borderRadius: 4 }}>
                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: 60, height: 60, justifyContent: 'center', borderRadius: 30, backgroundColor: '#84BCD5' }}>
                                        <Image
                                            source={{ uri: film.myPic }}
                                            style={{ width: 60, height: 60, alignSelf: 'center', borderRadius: 30 }}
                                            resizeMode='contain'
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 7, paddingRight: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, color: '#BCBEC0', fontWeight: 'bold', marginRight: 5 }}>{film.username}</Text>
                                        <Icon
                                            size={15}
                                            name='block'
                                            color='#E1423A'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#04A9D3' }}>User has been blocked</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 13 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#E1423A', borderRadius: 3 }} onPress={() => this.unblockFriend(film)}>
                                            <Text style={{ marginHorizontal: 20, marginVertical: 3, fontSize: 13, color: 'white' }}>Unblock</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {

            return (
                <View style={{ width: '100%', justifyContent: 'center', marginBottom: 10, alignItems: 'center' }}>
                    <View style={{ width: '90%', height: 130, flex: 1 }}>
                        <TouchableOpacity style={{ flex: 1 }} key={index}
                            // onLongPress={() => this.longBlock(film)}
                            onPress={() => {
                                this.shortChat(film)
                            }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 3, marginVertical: 5, paddingVertical: 10, backgroundColor: '#EAF6F7', borderRadius: 4 }}>
                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: 60, height: 60, justifyContent: 'center', borderRadius: 30, backgroundColor: '#84BCD5' }}>
                                        <Image
                                            source={{ uri: film.myPic }}
                                            style={{ width: 60, height: 60, alignSelf: 'center', borderRadius: 30 }}
                                            resizeMode='contain'
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 7, paddingRight: 20 }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>

                                        <Text style={{ fontSize: 18, color: '#04A9D3', fontWeight: 'bold' }}>{film.username}</Text>

                                        {film.premium &&
                                            <Icon
                                                name='crown'
                                                type='foundation'
                                                color='#517fa4'
                                                style={{ marginLeft: 1, alignItems: 'flex-start' }}
                                            />
                                        }

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 12, color: '#63B1DC' }}>Age: </Text>
                                            <Text style={{ fontSize: 12, color: '#63B1DC' }}>{film.age}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#00A1AF' }}>Currently Learning:</Text>
                                            <Text style={{ fontSize: 12, color: '#F15A29', fontWeight: 'bold' }}>{film.languageLearning}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon
                                                name='male'
                                                size={20}
                                                type='font-awesome'
                                                color={(film.sex == 'male') ? '#BEE1EB' : '#63B1DC'}
                                            />
                                            <Icon
                                                name='female'
                                                size={20}
                                                type='font-awesome'
                                                color={(film.sex == 'female') ? '#BEE1EB' : '#63B1DC'}
                                            />

                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <View style={{ flex: 6 }}>
                                            <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#63B1DC' }}>{this.checklastmessage(film)}</Text>
                                        </View>
                                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'stretch' }}>
                                            <TouchableOpacity style={{ backgroundColor: '#F7941D', borderRadius: 3 }} onPress={() => this.addFriend(film)}>
                                                <Text style={{ fontSize: 12, paddingHorizontal: 10, paddingVertical: 3, color: 'white' }}>Add Friend</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: 20, height: 20, backgroundColor: 'black', position: 'absolute', justifyContent: 'center', alignItems: 'center', right: 0, top: 0 }}>
                                <Icon
                                    name='ios-information-circle'
                                    size={20}
                                    type='ionicon'
                                    color='#E1423A'
                                    onPress={() => this.addFriend(film)}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    render() {
        const friends = []
        for (const key in this.props.friends) {
            const friend = this.props.friends[key]
            friend['uid'] = key
            friends.push(friend)
        }

        const { query } = this.state;
        const { navigate } = this.props.navigation;
        const films = this.findFilm(query);

        console.log("films : ", films);

        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#C3E3E4'}}>
                <View style={{ height: p(60), backgroundColor: '#4faaca', flexDirection: 'row', alignItems: 'center' }}>
                    {/* <View style={{ height: p(40), flex: 1, marginLeft: p(12) }}>
                        <View style={{ backgroundColor: '#def3f8', borderRadius: p(20), paddingHorizontal: p(20) }}>
                            <TextInput
                                placeholder={strings('FriendsList.search_for')}
                                placeholderTextColor='#a8cbd4'
                                underlineColorAndroid="transparent"
                                onChangeText={text => this.setState({ query: text })}
                                style={{ fontSize: 15, color: '#84BCD5' }}>
                            </TextInput>

                        </View>

                        <View style={{ position: 'absolute', right: p(0), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
                            <Icon
                                name='search'
                                type='font-awesome'
                                color='#88b7c3'
                            />
                        </View>

                    </View> */}

                    <View style={{ height: p(40), flex: 1, marginLeft: p(12), alignSelf: 'center', justifyContent: 'center' }}>
                        <TextInput style={{
                            paddingLeft: p(12),
                            width: '100%',
                            height: 40,
                            borderRadius: 20,
                            fontSize: 15,
                            color: '#84BCD5',
                            backgroundColor: '#def3f8',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            paddingTop: 0,
                            paddingBottom: 0
                        }}
                            placeholder={strings('FriendsList.search_for')}
                            placeholderTextColor='#a8cbd4'
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            onChangeText={text => this.setState({ query: text })}
                        />
                        <View style={{ position: 'absolute', right: p(0), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
                            <Icon
                                name='search'
                                type='font-awesome'
                                color='#88b7c3'
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={{ marginLeft: p(30), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
                        <MaterialCommunityIcons
                            name={'comment-processing'}
                            size={p(22)}
                            color={'#88b7c3'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigate('PostScreen');
                        }}
                        style={{ marginHorizontal: p(10), justifyContent: 'center', alignItems: 'center', backgroundColor: '#c3e3e5', width: p(40), height: p(40), borderRadius: p(20) }}>
                        <MaterialIcons
                            name={'group'}
                            size={p(22)}
                            color={'#88b7c3'}
                        />
                    </TouchableOpacity>

                </View>
                <View style={{ width: '100%', flex: 1, alignSelf: 'stretch' }}>
                    <ScrollView style={{ width: '100%', height: '100%', backgroundColor: (films.length > 0) ? '#BEE1EB' : 'white' }}>
                        {films.length > 0 ? (
                            <View style={{ width: '100%', paddingLeft: 20 }}>
                                {films.map((film, index) => (

                                    this.renderFilm(film, index)
                                ))}
                                {/* <Text>{films[1].username}</Text> */}
                                <Spinner visible={this.state.loading} />
                            </View>
                        ) : (
                                <View style={{ }} >
                                    <View style={{   paddingVertical:3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F15A29', margin: 15 }}>
                                        <Text style={{ fontSize: p(15), color: 'white' }}>{strings('FriendsList.saved_friends')}</Text>
                                    </View>
                                    <View style={ {backgroundColor: 'white', borderBottomColor: '#BEE1EB', borderBottomWidth: 1}}>
                                        <ListView
                                            style={{ backgroundColor: 'white' }}
                                            dataSource={this.dataSource.cloneWithRows(friends)}
                                            renderRow={this.renderRow}
                                        
                                        />
                                    </View>
                                    <Spinner visible={this.state.loading} />
                                </View>
                            )}
                    </ScrollView>
                </View>

                <Modal
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                    animationType="slide"
                    transparent={true}
                    isVisible={this.state.openModalForBLocking == true}
                    onBackdropPress={() => this.setState({ openModalForBLocking: false })}
                >
                    {this._renderModalContent()}
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

function mapStateToProps(state) {
    return {
        user: state.user,
        friends: state.friends,
        blockeds: state.blockeds
    }
}

export default connect(mapStateToProps, { addFriend, removeFriend })(FriendsListScreen);
