import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, Alert, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../static/constant';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from 'react-redux'
// import stripe from 'tipsi-stripe';
import SimpleToast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore'
import axios from 'axios';
import moment from 'moment';
import { setProfilePremium } from '../redux/action'
import auth from '@react-native-firebase/auth'
import { strings } from '../../src/locales/i18n';
import { CustomHeader } from './common/CustomHeader';
import RNIap, {
    InAppPurchase,
    PurchaseError,
    SubscriptionPurchase,
    acknowledgePurchaseAndroid,
    consumePurchaseAndroid,
    finishTransaction,
    finishTransactionIOS,
    purchaseErrorListener,
    purchaseUpdatedListener,
  } from 'react-native-iap';


const { height, width } = Dimensions.get('window');
const packages = [
    { id: 0, duration: '1 Month Subscription', discount: '(0% off)', price: 'USD $4.50', tag: 'Taste Victory', isSelected: false, month: 1, amount: 450, color: '#707070', product_id:'Bronze_biyah' },
    { id: 1, duration: '1 Year Subscription', discount: '(15% off)', price: 'USD $45.95', tag: 'Most Popular', isSelected: false, month: 12, amount: 4590, color: '#2699FB', product_id:'Gold_biyah' },
    { id: 2, duration: '6 Months Subscription', discount: '(10% off)', price: 'USD $24.30', tag: 'Date Victory', isSelected: false, month: 6, amount: 2430, color: '#E24848', product_id:'Silver_biyah' },
];

const getPurchasedItem = (amount) => {
    return packages.find((item) => item.amount == amount);
}

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

let month;
let amnt;
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const itemSkus = Platform.select({
    ios: [
        'Bronze_biyah',
        'Gold_biyah',
         'Silver_biyah'
    ],
    android: [
        'most_popular',
        'taste_victory',
        'date_victory'
    ],
  });

const connector = connect((state) => {
    console.log("state : ", state);
    // this.state = {
    //     productList: [],
    //     receipt: '',
    //     availableItemsMessage: '',
    //        lang: state.lang,
    //     user: state.user,
    //   };
    return {
        lang: state.lang,
        user: state.user,
        paidData: state.paid
       
    }
}, { setProfilePremium });

class PaymentScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <CustomHeader navigation={navigation} />,
            headerStyle: {
                backgroundColor: '#BCE0FD',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    }

    constructor(props) {
        super(props);
      }
      state = {
        loading: false,
        paid: false  ,
        receipt: '',
       
      };


     isUserPremium = false;
     purchasedItem = null;
   



    componentDidMount = async () => {
        console.log("props.user.uid : ", moment(new Date(this.props.user.created * 1000)).format('DD/MM/YYYY'));
        console.log("props.user.premium : ", this.props.user.premium);
        console.log("isUserPremium : ", this.isUserPremium);
        if (this.props.user.premium && this.props.user.until != undefined && this.props.user.until > new Date().getTime()) {
            this.isUserPremium = true;
            console.log("isUserPremium : ", this.isUserPremium);
            this.purchasedItem = getPurchasedItem(this.props.user.amount);
            console.log("purchasedItem : ", this.purchasedItem);
            this.forceUpdate();         
        }else{
            this.goNext();
        }
       
        firestore().collection('user').doc(this.props.user.uid).collection('payment').get().then((snapShot) => {
            snapShot.docs.forEach((item) => {
                // console.log("item : ", item);
            });
        }).catch((error) => {
            console.log("error : ", error);
        });
        try {
          const result = await RNIap.initConnection();
          await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        //   this.getItems("Bronze_biyah");
          console.log('Inappresult', result);
        } catch (err) {
          console.warn(err.code, err.message);
          alert(err.message);
        }
    
        // if(this.props.user.premium == true){
        //     this.goNext();
        // }
        purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: InAppPurchase | SubscriptionPurchase) => {
              const receipt = purchase.transactionReceipt;
              if (receipt) {
                try {
                //   if (Platform.OS === 'ios') {
                  //   finishTransactionIOS(purchase.transactionId);
                  // } else if (Platform.OS === 'android') {
                  //   // If consumable (can be purchased again)
                  //   consumePurchaseAndroid(purchase.purchaseToken);
                  //   // If not consumable
                  //   acknowledgePurchaseAndroid(purchase.purchaseToken);
                  // }
                  const ackResult = await finishTransaction(purchase);
                } catch (ackErr) {
                  console.warn('ackErr', ackErr);
                }
                this.setState({receipt}, () => this.goNext());
              }
            },
          );
        purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.log('purchaseErrorListener', error);
           alert('purchase error', JSON.stringify(error));
          },
        );
        }

      componentWillUnmount = ()=> {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
        RNIap.endConnection();
      };


       goNext = () => {
       if(this.props.user.amount != undefined){
            amnt = this.props.user.amount;
            month = this.props.user.month;
           }
        // amnt = this.props.user.amount;
        // month = this.props.user.month;
       
     let now = new Date();
    //  let createdDate = now;
     var date = new Date().getDate();
     var months = new Date().getMonth() + 1;
     var year = new Date().getFullYear();
     let createdDate = date + '/' + months + '/' + year;//format: dd-mm-yyyy;


     let dayOfEnd = now.setMonth(now.getMonth() + month);
     console.log("dayOfEnd : ", dayOfEnd);
     let futureMonth = moment().add(month, 'M').format('DD-MM-YYYY');
     console.log("futureMonth : ", futureMonth);
     console.log("created : ",createdDate);
     this.isUserPremium = true;
     this.purchasedItem = getPurchasedItem(this.props.user.amount);
     if(this.purchasedItem!=null){
        this.props.setProfilePremium({
            premium: true,
            until: dayOfEnd,
            untilNice: futureMonth,
            amount: amnt,
            months: month,
            created:createdDate
        });
     }
       let payment = { amnt, month };
       console.log("payment fetched");
       console.log("payment fetched1",this.purchasedItem);
       console.log("payment fetched2",this.purchasedItem.duration);
       console.log("payment fetched2",this.purchasedItem.tag);
       this.forceUpdate();
       firestore().collection('user').doc(this.props.user.uid).update({
        premium: true,
        until: dayOfEnd,
        untilNice: futureMonth,
        amount: amnt,
        months: month,
        created:createdDate,
    });
       firestore().collection('user').doc(this.props.user.uid).collection('payment').add(payment).then((doc) => {
           this.setState = {loading : false};
           this.setState = {paid : true};
    }).catch((error) => {
        console.log('NEIRASE I DB !!!')
        this.setState = {loading : false};
        this.setState = {paid : false};
    })
  };

    // In App Purchase 
     getItems = async (item) => {
        try {
        const products = await RNIap.getProducts(itemSkus); 
          console.log('Products', products);
       //   alert("In APP");
         //  this.setState({productList: products});
        this.requestSubscription(item)
        // alert(JSON.stringify(item));
        } catch (err) {
          console.log(err.code, err.message);
          alert(JSON.stringify(err.message));
        }
      };

       requestSubscription = async (sku) => {
        try {
          RNIap.requestSubscription(sku);
        } catch (err) {
          alert(err.message);
        }
      };

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

    //         if (token) {
    //             console.log("Token successful", token);
    //             makePayment(token, months, amount);
    //         } else {
    //             console.log("Token process failed");
    //         }
    //     } catch (error) {
    //         console.log("Something went wrong!!");

    //         setToken(null);
    //         setPaid(false);
    //     }
    // }

    //  makePayment = async (token, months, amount) => {
    //     let userId = props.user.uid;
    //     if (props.user.uid) {
    //         userId = auth().currentUser.uid;
    //     }

    //     setLoading(true);
    //     axios({
    //         method: 'POST',
    //         url: 'https://us-central1-yak-vernac-app.cloudfunctions.net/completePaymentWithStripe',
    //         data: {
    //             currency: 'usd',
    //             token: token,
    //             months: months,
    //             amount: amount,
    //             uid: userId
    //         }
    //     }).then(response => {
    //         console.log("Payment Success : ", response);

    //         let date = moment(response.data.created).format('DD/MM/YYYY');
    //         console.log("date : ", date, response.data.created);
    //         let now = new Date();
    //         let dayOfEnd = now.setMonth(now.getMonth() + months);
    //         console.log("dayOfEnd : ", dayOfEnd);
    //         let futureMonth = moment().add(months, 'M').format('DD-MM-YYYY');
    //         console.log("futureMonth : ", futureMonth);
    //         console.log("response.amount : ", response.data.amount);

    //         props.setProfilePremium({
    //             premium: true,
    //             until: dayOfEnd,
    //             untilNice: futureMonth,
    //             amount: response.data.amount,
    //             months: months,
    //             created: response.data.created
    //         });

    //         setLoading(false);
    //     }).catch(error => {
    //         console.log("Payment Error : ", error);

    //         setLoading(false);
    //         SimpleToast.show('Something went wrong. please try again');
    //     });
    // }

    //  handleCardPayPress = async (months, amount) => {
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

    //         setLoading(true);
    //         // let payment = {
    //         //     token: token,
    //         //     amount: amount,
    //         //     months: months
    //         // }
          
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

     renderItem = ({ item }) => {
     
        let tag = item.tag == "Taste Victory" ? "Payment.taste" : item.tag == "Most Popular" ? "Payment.most" : "Payment.date";
        let subs = item.duration == "1 Month Subscription" ? "Payment.oneMonth" : item.duration == "1 Year Subscription" ? "Payment.oneYear" : "Payment.sixMonth";
        let dis = item.discount == "(0% off)" ? "Payment.zero" : item.discount == "(15% off)" ? "Payment.fifteen" : "Payment.ten";
      
        return (   
            
            <TouchableOpacity style={styles.cardContainer}
        
                onPress={() => {
                    month = item.month
                    amnt = item.amount
                    alert(month);
                //    handleCardPayPress(item.month, item.amount);
                //    inAppPurchase();
                // this.props.navigation.navigate("PostScreen");
                // const { navigate } = props.navigation;
                // navigate('InAppPurchase');
                 this.getItems("Bronze_biyah");
                }}>
                <View style={styles.cardTopContainer}>
                    {item.tag
                        ? <Text style={styles.packLabel}>{strings(tag)}</Text>
                        : null}
                    <Text style={styles.packPrice}>{item.price}</Text>
                    <Text style={styles.packDuration}>{strings(subs)}</Text>
                    <Text style={styles.packDiscount}>{strings(dis)}</Text>
                </View>
                <View style={{ height: 10, width: '100%', backgroundColor: item.color }} />
                <View style={styles.cardBottomContainer}>
                  <Text style={styles.cardButtonText}>{strings('Payment.choose')}</Text>
                    
                </View>
            </TouchableOpacity>
        );
    }


    if (loading) {
        return <Spinner visible={loading} />;
    }
    render() {

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#FFBE66', '#00000029', '#D3F1FA']} style={{ flex: 1 }}>
                <ScrollView showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                        {this.props.user.premium ?
                            <View style={styles.topContainer}>
                            <Image source={require('../assets/star-earth.png')} style={styles.logo} resizeMode='contain' />
                            <Text numberOfLines={5} style={styles.logoText}>
                                YOU HAVE PREMIUM. {"\n"}{"\n"}
                                THANK YOU
                            </Text>
                            {/* <Text numberOfLines={1} style={styles.thankText}>
                                THANK YOU
                            </Text> */}
                        </View> : 
                        <View style={styles.topContainer}>
                            <Image source={require('../assets/star-earth.png')} style={styles.logo} resizeMode='contain' />
                            <Text numberOfLines={5} style={styles.logoText}>
                                {strings('Payment.go')}
                            </Text>
                        </View>
                         }
                        {/* <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            overScrollMode='never'
                            contentContainerStyle={{ paddingHorizontal: 8 }}
                            horizontal={true}
                            data={packages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem} /> */}
                       
                        {this.props.user.premium && this.purchasedItem
                            ? <View style={styles.cardContainer}>
                                <View style={styles.cardTopContainer}>
                                    {this.purchasedItem.tag
                                        ? <Text style={styles.packLabel}>{strings(this.purchasedItem.tag == "Taste Victory" ? "Payment.taste" : this.purchasedItem.tag == "Most Popular" ? "Payment.most" : "Payment.date")}</Text>
                                        : null}
                                    <Text style={styles.packPrice}>{this.purchasedItem.price}</Text>
                                    <Text style={styles.packDuration}>{strings(this.purchasedItem.duration == "1 Month Subscription" ? "Payment.oneMonth" : this.purchasedItem.duration == "1 Year Subscription" ? "Payment.oneYear" : "Payment.sixMonth")}</Text>
                                    <Text style={styles.packDiscount}>{strings(this.purchasedItem.discount == "(0% off)" ? "Payment.zero" : this.purchasedItem.discount == "(15% off)" ? "Payment.fifteen" : "Payment.ten")}</Text>
                                </View>
                                <View style={{ height: 10, width: '100%', backgroundColor: this.purchasedItem.color }} />
                                <View style={styles.cardBottomContainer}>
                                    <Text style={styles.cardButtonText}>{strings('Payment.purchased')} {this.props.user.untilNice}</Text>
                                </View>
                            </View>
                            : <Carousel
                                data={packages}
                                renderItem={this.renderItem}
                                sliderWidth={width}
                                itemWidth={260}
                                hasParallaxImages={true}
                                inactiveSlideScale={0.8}
                                inactiveSlideOpacity={0.5}
                                firstItem={1}
                            />}
                        <View style={{ width: '100%', backgroundColor: colors.button, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>
                                {strings('Payment.better')}
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.study')}
                            </Text>
                            {/* <Text style={{ marginVertical: 8, fontSize: 16, color: colors.text }}>Track your progress and needs</Text>
                            <View style={{ height: 160, width: 260, marginBottom: 16 }} >
                                <Image source={require('../assets/better.png')} style={{ height: 160, width: 260 }} resizeMode='contain' />
                            </View> */}
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.track')}
                            </Text>
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
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>
                                {strings('Payment.easier')}
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.ads')}
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.unlocked')}
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.unlimited')}
                            </Text>
                            <View style={{ height: 160, width: 260, marginBottom: 8 }} >
                                <Image source={require('../assets/easier.png')} style={{ height: 160, width: 260 }} resizeMode='contain' />
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: colors.button, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
                            <Text style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: colors.text }}>
                                {strings('Payment.faster')}
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.lessons')}
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                                {strings('Payment.vip')}
                            </Text>
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
        alignItems: 'center',
        
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
    logoText1: {
        position: 'absolute',
        width: '50%',
        right: 0,
        paddingRight: 32,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.button
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
    thankText: {
        marginTop: 40,
        fontSize: 16,
        paddingRight: 32,   
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