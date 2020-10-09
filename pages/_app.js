import { useStore } from '../store/store'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {

  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store)

return (
  <Provider store={store}>
     <Head>
      <title>Taraxa · Sandbox</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
      <Component {...pageProps} />
    </PersistGate>
  </Provider>
)
  
}

