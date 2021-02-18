import React, { useState, useEffect, useContext, useRef } from 'react'
import { Col, Row, Grid } from "react-native-easy-grid"
import {Dimensions} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import ImageCell from './ImageCell'
import { colors } from '../static/constant'

const deviceWidth = Dimensions.get('window').width

export default ({media, callbackBookmark, refreshPage, setLoading}) => {
    const rowArray = []
    for (var i=0;(i+3)<=media.length;i+=3) {
        const row = (
            <Row style={{height: deviceWidth/3}}>
                <Col>
                    <ImageCell media={media[i]} callbackBookmark={callbackBookmark} refreshPage={refreshPage} setLoading={setLoading}/>
                </Col>
                <Col>
                    <ImageCell media={media[i+1]} callbackBookmark={callbackBookmark} refreshPage={refreshPage} setLoading={setLoading}/>
                </Col>
                <Col>
                    <ImageCell media={media[i+2]} callbackBookmark={callbackBookmark} refreshPage={refreshPage} setLoading={setLoading}/>
                </Col>
            </Row>
        )
        rowArray.push(row)
    }
    switch (media.length-i) {
        case 1:
            rowArray.push((
                <Row style={{height: deviceWidth/3}}>
                    <Col>
                        <ImageCell media={media[i]} callbackBookmark={callbackBookmark} refreshPage={refreshPage} setLoading={setLoading}/>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            ))
            break
        case 2:
            rowArray.push((
                <Row style={{height: deviceWidth/3}}>
                    <Col>
                        <ImageCell media={media[i]} callbackBookmark={callbackBookmark} refreshPage={refreshPage} setLoading={setLoading}/>
                    </Col>
                    <Col>
                        <ImageCell media={media[i+1]} callbackBookmark={callbackBookmark} refreshPage={refreshPage} setLoading={setLoading}/>
                    </Col>
                    <Col></Col>
                </Row>
            ))
            break
        default:
            break
    }

    return (
        <Grid style={{marginTop: 10, backgroundColor: colors.mainBackground}}>
        {
            rowArray.map(row=>row)
        }
        </Grid>

    )
}
