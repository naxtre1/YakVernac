import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../static/constant';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from 'react-redux'
// import stripe from 'tipsi-stripe';
import SimpleToast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore'

const { height, width } = Dimensions.get('window');
const packages = [
    { id: 0, duration: '1 Month Subscription', discount: '(0% off)', price: 'USD $4.50', tag: 'Taste Victory', isSelected: false, month: 1, amount: 450, color: '#707070' },
    { id: 1, duration: '1 Year Subscription', discount: '(15% off)', price: 'USD $45.95', tag: 'Most Popular', isSelected: false, month: 12, amount: 4590, color: '#2699FB' },
    { id: 2, duration: '6 Months Subscription', discount: '(10% off)', price: 'USD $24.30', tag: 'Date Victory', isSelected: false, month: 6, amount: 2430, color: '#E24848' },
];
const countries = [
    { id: 0, source: require('../assets/united-kingdom.png') },
    { id: 1, source: require('../assets/brazil.png') },
    { id: 2, source: require('../assets/mexico.png') },
    { id: 3, source: require('../assets/france.png') },
    { id: 4, source: require('../assets/italy.png') },
    { id: 5, source: require('../assets/russia.png') },
    { id: 6, source: require('../assets/germany.png') },
    { id: 7, source: require('../assets/china.png') },
    { id: 8, source: require('../assets/india.png') },
];

const connector = connect((state) => {
    return {
        lang: state.lang,
        user: state.user
    }
}, null);

const PaymentScreen = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        console.log("props.user.uid : ", props.user.uid);
        firestore().collection('user').doc(props.user.uid).collection('payment').get().then((snapShot) => {
            snapShot.docs.forEach((item) => {
                // console.log("item : ", item);
            });
        }).catch((error) => {
            console.log("error : ", error);
        });
    }, []);

    // const handleCardPayPress = async (months, amount) => {
    //     try {
    //         setToken(null);
    //         const token = await stripe.paymentRequestWithCardForm({
    //             email: 'kriminalas99@gmail.com',
    //             // Only iOS support this options
    //             smsAutofillDisabled: true,
    //             requiredBillingAddressFields: 'full',
    //             prefilledInformation: {
    //                 billingAddress: {
    //                     name: 'Gunilla Haugeh',
    //                     line1: 'Canary Place',
    //                     line2: '3',
    //                     city: 'Macon',
    //                     state: 'Georgia',
    //                     country: 'US',
    //                     postalCode: '31217',
    //                     email: 'ghaugeh0@printfriendly.com',
    //                 },
    //             },
    //         })

            // setLoading(true);
            // let payment = {
            //     token: token,
            //     amount: amount,
            //     months: months
            // }

    //         let payment = { token, amount, months }
    //         firestore().collection('user').doc(props.user.uid).collection('payment').add(payment).then((doc) => {
    //             setLoading(false);
    //             setToken(token);
    //             setPaid(true);
    //         }).catch((error) => {
    //             console.log('NEIRASE I DB !!!')

    //             setLoading(false);
    //             setToken(null);
    //             setPaid(false);

    //         })
    //     } catch (error) {
    //         console.log('CATCH CIKLAS...')

    //         setLoading(false);
    //         setToken(null);
    //         setPaid(false);
    //     }
    // }


    const inAppPurchase = async() => {
        try {
            this.props.navigation.navigate('InAppPurchase') 
        } catch (error) {
            
        }
     
    }


    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.cardContainer}
                onPress={() => {
              
                 inAppPurchase();
                }}>
                <View style={styles.cardTopContainer}>
                    {item.tag
                        ? <Text style={styles.packLabel}>{item.tag}</Text>
                        : null}
                    <Text style={styles.packPrice}>{item.price}</Text>
                    <Text style={styles.packDuration}>{item.duration}</Text>
                    <Text style={styles.packDiscount}>{item.discount}</Text>
                </View>
                <View style={{ height: 10, width: '100%', backgroundColor: item.color }} />
                <View style={styles.cardBottomContainer}>
                    <Text style={styles.cardButtonText}>Choose Me</Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (loading) {
        return <Spinner visible={loading} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#FFBE66', '#00000029', '#D3F1FA']} style={{ flex: 1 }}>
                <ScrollView showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.topContainer}>
                            <Image source={require('../assets/star-earth.png')} style={styles.logo} resizeMode='contain' />
                            <Text numberOfLines={5} style={styles.logoText}>Go premium to boost your learning and speak your language sooner.</Text>
                        </View>
                        {/* <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            overScrollMode='never'
                            contentContainerStyle={{ paddingHorizontal: 8 }}
                            horizontal={true}
                            data={packages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem} /> */}
                        <Carousel
                            data={packages}
                            renderItem={renderItem}
                            sliderWidth={width}
                            itemWidth={260}
                            hasParallaxImages={true}
                            inactiveSlideScale={0.8}
                            inactiveSlideOpacity={0.5}
                            firstItem={1}
                        />
                        <View style={{ width: '100%', backgroundColor: colors.button, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>BETTER</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>Unlimited Translations</Text>
                            {/* <Text style={{ marginVertical: 8, fontSize: 16, color: colors.text }}>Track your progress and needs</Text>
                            <View style={{ height: 160, width: 260, marginBottom: 16 }} >
                                <Image source={require('../assets/better.png')} style={{ height: 160, width: 260 }} resizeMode='contain' />
                            </View> */}
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>Track your progress and needs</Text>
                            <View style={{ height: 160, width: 260, marginBottom: 8 }} >
                                <Image source={require('../assets/better.png')} style={{ height: 160, width: 260 }} resizeMode='contain' />
                            </View>
                        </View>
                        {/* <View style={{ width: '100%', backgroundColor: colors.button, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>BETTER</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>Unlimited Translations</Text>
                            <Text style={{ marginVertical: 8, fontSize: 16, color: colors.text }}>Track your progress and needs</Text>
                            <View style={{ height: 160, width: 260, backgroundColor: colors.lightOrange, marginBottom: 16 }}>
                                <View style={{ marginTop: 26 }}>
                                    <Carousel
                                        style={{ marginHorizontal: 16 }}
                                        data={countries}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={{ height: 80, width: 100, }}>
                                                    <Image source={item.source} style={{ height: 80, width: 100 }} resizeMode='cover' />
                                                </View>
                                            );
                                        }}
                                        sliderWidth={260}
                                        itemWidth={100}
                                        hasParallaxImages={true}
                                        // firstItem={0}
                                        inactiveSlideScale={0.8}
                                        inactiveSlideOpacity={0.5}
                                        onSnapToItem={index => setActiveIndex(index)}
                                    />
                                </View>
                                <View style={{ marginBottom: 26 }}>
                                    <Pagination
                                        containerStyle={{ paddingVertical: 12 }}
                                        dotsLength={countries.length}
                                        activeDotIndex={activeIndex}
                                        dotStyle={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            marginHorizontal: -12,
                                        }}
                                        inactiveDotOpacity={0.5}
                                        inactiveDotScale={0.8}
                                    />
                                </View>
                            </View>
                        </View> */}
                        <View style={{ width: '100%', backgroundColor: colors.button, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>EASIER</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>No Ads</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>All features unlock</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>Study more languages</Text>
                            <View style={{ height: 160, width: 260, marginBottom: 8 }} >
                                <Image source={require('../assets/easier.png')} style={{ height: 160, width: 260 }} resizeMode='contain' />
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: colors.button, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>FASTER</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>Unlock all the lessons</Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>V.I.P and find study buddies</Text>
                            <View style={{ height: 160, width: 260, marginBottom: 8 }} >
                                <Image source={require('../assets/faster.png')} style={{ height: 160, width: 260 }} resizeMode='contain' />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    ScrollView: {
        flex: 1,
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center'
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    // logo: {
    //     height: width * 0.5,
    //     width: width * 0.5
    // },
    // logoText: {
    //     flex: 1,
    //     paddingHorizontal: 16,
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: colors.button
    // },
    logo: {
        height: width * 0.5,
        width: width,
        marginRight: 50
    },
    logoText: {
        position: 'absolute',
        width: '50%',
        right: 0,
        paddingRight: 32,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.button
    },
    cardContainer: {
        height: 180,
        width: 260,
        alignItems: 'center',
        flexDirection: 'column'
    },
    cardTopContainer: {
        height: 120,
        width: '100%',
        backgroundColor: colors.button,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardBottomContainer: {
        height: 50,
        width: '100%',
        // backgroundColor: colors.selectionGreen,
        backgroundColor: '#27D934',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.button
    },
    packLabel: {
        marginTop: 16,
        fontSize: 16,
        color: colors.darkOrange,
        fontWeight: 'bold'
    },
    packPrice: {
        marginTop: 8,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text
    },
    packDuration: {
        marginTop: 8,
        fontSize: 14,
        color: colors.text
    },
    packDiscount: {
        marginTop: 8,
        marginBottom: 16,
        fontSize: 14,
        color: colors.text
    }
});

export default (connector(PaymentScreen));