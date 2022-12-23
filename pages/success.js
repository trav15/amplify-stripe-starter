import React from 'react'
import { useRouter } from 'next/router'
import { Text, View } from '@aws-amplify/ui-react'

function SuccessPage() {
	const router = useRouter()
	const { email } = router.query

	return (
		<View>
			Thank you! We've sent an email to{' '}
			<Text as="span" fontWeight={'bold'}>
				{email}
			</Text>{' '}
			with your downloads.
		</View>
	)
}

export default SuccessPage
