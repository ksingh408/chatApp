import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

import {store,persistor} from "./store.js";
// frontend\src\store.js


{/* <Auth0Provider
  domain="dev-lfc7njf26v471pgk.us.auth0.com"
  clientId="KUKzMWZvOoRN5E1ZAwlITMGyLvH4ELjI"
  authorizationParams={{
    redirect_uri: window.location.origin
  }} 
>*/}
createRoot(document.getElementById('root')).render(
  <StrictMode>
 

<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
    {/* </Auth0Provider> */}
  </PersistGate>
    </Provider>
  </StrictMode>,
)
