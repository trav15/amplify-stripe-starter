import {
	Button,
	Flex,
	TextField,
	withAuthenticator,
} from '@aws-amplify/ui-react'

import React from 'react'

function CreateProductsPage({ signOut, user }) {
	const handleSubmit = async (e) => {
		e.preventDefault()

		const name = e.target.name.value
		const price = e.target.price.value
		const displayImage = e.target.displayImage.files[0]
		const productFile = e.target.productFile.files[0]
		const description = e.target.description.value

		console.log({ name, price, displayImage, productFile, description })
	}
	return (
		<>
			<Flex justifyContent={'flex-end'}>
				<Button onClick={signOut}>Sign Out</Button>
			</Flex>
			<Flex justifyContent={'center'}>
				<form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
					<TextField
						required
						label="name"
						placeholder="My cool product name"
						name={'name'}
					/>
					<TextField
						required
						label="description"
						placeholder="Here's an awesome description"
						name={'description'}
					/>
					<TextField
						required
						label="price"
						outerStartComponent={
							<>
								<Button>＄</Button>
							</>
						}
						placeholder="4.00"
						name={'price'}
						type="number"
					/>
					<TextField
						required
						label="Display Image"
						name={'displayImage'}
						type="file"
					/>
					<TextField
						required
						label="Product File"
						name={'productFile'}
						type="file"
					/>
					<Button marginTop={'2rem'} type="submit" variation="primary">
						Add Product
					</Button>
				</form>
			</Flex>
		</>
	)
}

export default CreateProductsPage
