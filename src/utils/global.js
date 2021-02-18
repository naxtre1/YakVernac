/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

export default class SingleTon {
    static myInstance = null;
    static getInstance() {
        if (SingleTon.myInstance == null) {
            SingleTon.myInstance = new SingleTon();
        }
        return this.myInstance;
    }
    playerId = "";
}