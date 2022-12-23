import {
	Button,
	Card,
	Flex,
	Heading,
	Text,
	Menu,
	MenuButton,
	useTheme,
	Image,
} from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import { useState, useEffect } from 'react'
import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart'
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy'
import { fetchCheckoutURL, listProducts } from '../src/graphql/queries'


function HomePage() {
	const theme = useTheme()
	const { totalPrice, clearCart, addItem, cartDetails } = useShoppingCart()
	const [products, setProducts] = useState([])

	useEffect(() => {
		async function fetchProducts() {
			try {
				const { data } = await API.graphql({
					query: listProducts,
					authMode: 'AWS_IAM',
				})
				const productData = data.listProducts.items
				setProducts(productData)
			} catch (e) {
				console.error(e)
			}
		}
	
		fetchProducts()
	}, [])

	const handleCheckout = async (e) => {
		e.preventDefault()
		const { data } = await API.graphql({
			query: fetchCheckoutURL,
			authMode: 'AWS_IAM',
			variables: {
				input: JSON.stringify(cartDetails),
			},
		}).catch((e) => console.log('the returned error', e))
	
		const { sessionId } = JSON.parse(data.fetchCheckoutURL)
	
		window.location.href = sessionId
	}
	

	return (
		<Flex direction="column">
			<Flex alignSelf={'flex-end'}>
				<CheckoutMenu
					cartDetails={cartDetails}
					handleCheckout={handleCheckout}
					clearCart={clearCart}
					totalPrice={totalPrice}
					theme={theme}
				/>
			</Flex>
			<Heading textAlign={'center'} level={3}>
				Welcome to my store!
			</Heading>
			<Flex wrap={'wrap'} justifyContent="center">
				<ProductList products={products} addItem={addItem} />
			</Flex>
		</Flex>
	)
}

const CheckoutMenu = ({
	cartDetails,
	clearCart,
	handleCheckout,
	totalPrice,
	theme,
}) => {
	return (
		<Menu trigger={<MenuButton>View Cart</MenuButton>} menuAlign="end">
			{Object.entries(cartDetails).map(([key, value]) => (
				<Flex key={key} margin={theme.tokens.space.small}>
					<Text>
						<Text fontWeight={'bold'} display={'inline'}>
							{value.name}
						</Text>
						({value.quantity}) @ {value.formattedPrice}
					</Text>
				</Flex>
			))}

			<Flex justifyContent={'space-between'} margin={theme.tokens.space.small}>
				<Button
					onClick={() => clearCart()}
					backgroundColor={'red'}
					color="white"
				>
					Clear Cart
				</Button>
				<Button onClick={handleCheckout} variation="primary">
					Checkout (
					{formatCurrencyString({
						value: totalPrice,
						currency: 'USD',
					})}
					)
				</Button>
			</Flex>
		</Menu>
	)
}

const ProductList = ({ products, addItem }) => {
	return (
		<>
			{products.map((product) => (
				<Card key={product.id} variation="elevated">
					<Image src={product.image} height="250px" />
					<Flex direction={'column'}>
						<Heading level={5}>{product.name}</Heading>
						<Text>{product.description}</Text>
						<Flex justifyContent={'space-between'} alignItems="center">
							<Text>
								{formatCurrencyString({
									value: product.price,
									currency: 'USD',
								})}
							</Text>
							<Button variation="primary" onClick={() => addItem(product)}>
								Add to Cart
							</Button>
						</Flex>
					</Flex>
				</Card>
			))}
		</>
	)
}

export default HomePage
