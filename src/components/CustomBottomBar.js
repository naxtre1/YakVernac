import { createBottomTabNavigator } from 'react-navigation-tabs'
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import BottomIcon from '../components/common/BottomIcon'
import { colors } from '../static/constant';
import { HomeScreen } from '../App'
import ProfileScreen from './ProfileScreen';
import StartScreen from './StartScreen';
import CreateScreen from './CreateScreen';
import BuyScreen from './BuyScreen';
import StepperView from './StepperView';
import auth from '@react-native-firebase/auth'
import PostScreen from './PostScreen'
import BuyPlanScreen from './BuyPlanScreen'
import { StackActions, NavigationActions, withNavigationFocus  } from 'react-navigation'

const FirstScreen = (props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: colors.blue }}
                onPress={async () => {
                    try {
                        await auth().signOut();
                        props.navigation.navigate('Auth');
                    } catch (e) {
                        console.log(e);
                    }
                }}>
                <Text style={{ marginHorizontal: 32, marginVertical: 16, color: colors.button, fontWeight: 'bold' }}>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}

const CustomBottomBar = createBottomTabNavigator(
    {
        Start: {
            // screen: StartScreen,
            screen: StepperView,
            navigationOptions: ({ navigation }) => ({
                // tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomIcon
                        routeName={navigation.state.routeName}
                        isActive={focused} />
                ),
                // tabBarOnPress: ({ navigation }) => {
                //     navigation.navigate('Start')
                // }
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    // navigation.navigate('Start')

                    // navigation.dispatch(StackActions.popToTop());
                    // defaultHandler();

                    navigation.popToTop();
                    navigation.navigate('Start')
                },
            }),
        },
        Buy: {
            // screen: BuyScreen,
            screen: BuyPlanScreen,
            navigationOptions: ({ navigation }) => ({
                // tabBarLabel: 'Buy',
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomIcon
                        routeName={navigation.state.routeName}
                        isActive={focused} />
                ),
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    // navigation.navigate('Buy')
                    navigation.popToTop();
                    navigation.navigate('Buy')
                },
            }),
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: ({ navigation }) => ({
                // tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomIcon
                        routeName={navigation.state.routeName}
                        isActive={focused} />
                ),
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    // navigation.navigate('Profile')
                    navigation.popToTop();
                    navigation.navigate('Profile')
                }
            }),
        },
        // Chat: {
        //     screen: FirstScreen,
        //     navigationOptions: ({ navigation }) => ({
        //         // tabBarLabel: 'Start',
        //         tabBarIcon: ({ tintColor, focused }) => (
        //             <BottomIcon
        //                 routeName={navigation.state.routeName}
        //                 isActive={focused} />
        //         ),
        //         tabBarOnPress: () => {
        //             navigation.navigate('Chat')
        //         },
        //     }),
        // },
        PostScreen: {
            screen: PostScreen,
            navigationOptions: ({ navigation }) => ({
                // tabBarLabel: 'Start',
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomIcon
                        routeName={navigation.state.routeName}
                        isActive={focused} />
                ),
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    // navigation.navigate('PostScreen')
                    navigation.popToTop();
                    navigation.navigate('PostScreen')
                },
            }),
        },
        Create: {
            screen: CreateScreen,
            navigationOptions: ({ navigation }) => ({
                // tabBarLabel: 'Create',
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomIcon
                        routeName={navigation.state.routeName}
                        isActive={focused} />
                ),
                tabBarOnPress: ({ navigation, defaultHandler }) => {
                    // navigation.navigate('Create')
                    navigation.popToTop();
                    navigation.navigate('Create')
                }
            }),
        },
    },
    {
        initialRouteName: "Start",
        activeColor: colors.darkOrange,
        inactiveColor: colors.lightGrey,
        tabBarOptions: {
            activeTintColor: colors.darkOrange,
            inactiveTintColor: colors.lightGrey,
            tabStyle: {
                paddingVertical: 5
            },
            showLabel: false
        },
    },
);

export default CustomBottomBar;

// export default () => <CustomBottomBar
//     ref={(ref) => { this.nav = ref; }}
//     onNavigationStateChange={(prevState, currentState) => {
//         const getCurrentRouteName = (navigationState) => {
//             if (!navigationState) return null;
//             const route = navigationState.routes[navigationState.index];
//             if (route.routes) return getCurrentRouteName(route);
//             return route.routeName;
//         };
//         global.currentRoute = getCurrentRouteName(currentState);
//     }}
// />;
