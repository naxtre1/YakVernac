import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from "react-redux"
import App from './App'
import RootReducer from './redux/reducer'

const persistConfig = {
  key: 'YakVernac',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, RootReducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  )
}