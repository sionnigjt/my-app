import React from 'react'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './App.css'
import './util/http'
import { PersistGate } from 'redux-persist/integration/react'
import {  persister } from './redux/store'
export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persister={persister}>
                <IndexRouter></IndexRouter>
            </PersistGate>

        </Provider>

    )
}
