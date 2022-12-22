import { AmplifyProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import { CartProvider } from 'use-shopping-cart'
import config from '../src/aws-exports'
import '../styles/globals.css'

Amplify.configure(config)
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

function MyApp({ Component, pageProps }) {
    return (
        <AmplifyProvider>
            <CartProvider cartMode="checkout-session" stripe={STRIPE_PUBLISHABLE_KEY}>
                <Component {...pageProps} />
            </CartProvider>
        </AmplifyProvider>
    )
}

export default MyApp
