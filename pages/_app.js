import { AmplifyProvider } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import '../styles/globals.css'
import { CartProvider } from 'use-shopping-cart'

function MyApp({ Component, pageProps }) {
	return (
		<AmplifyProvider>
			<CartProvider>
				<Component {...pageProps} />
			</CartProvider>
		</AmplifyProvider>
	)
}

export default MyApp
