/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_PRODUCTIMAGES_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
};


const aws = require('aws-sdk')
const Stripe = require('stripe')
const nodemailer = require('nodemailer')

const ses = new aws.SES()
const s3 = new aws.S3()
const transporter = nodemailer.createTransport({
    SES: { ses, aws },
})
const fetchSecret = async (key) => {
    const { Parameters } = await new aws.SSM()
        .getParameters({
            Names: [key].map((secretName) => process.env[secretName]),
            WithDecryption: true,
        })
        .promise()

    return Parameters[0].Value
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const STRIPE_SECRET = await fetchSecret('STRIPE_SECRET_KEY')
    const STRIPE_WEBHOOK_SECRET = await fetchSecret('STRIPE_WEBHOOK_SECRET')
    const stripe = Stripe(STRIPE_SECRET)
    const sig = event.headers['stripe-signature']

    let stripeEvent

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.log('uh oh', err)
        return { 'problem occurred': err }
    }

    switch (stripeEvent.type) {
        case 'checkout.session.completed':
            const session = stripeEvent.data.object
            const items = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ['data.price.product'],
            })
            const customerEmail = session.customer_details.email
            const customerName = session.customer_details.name
            const ADMIN_IDENTITY = process.env.S3_USER_IDENTITY
            const RESUME_BUCKET = process.env.STORAGE_PRODUCTIMAGES_BUCKETNAME

            let urls = []
            for (let orderDataItem of items.data) {
                const fileKey = orderDataItem.price.product.metadata.productFileKey

                const bucketParams = {
                    Bucket: RESUME_BUCKET,
                    Key: `protected/${ADMIN_IDENTITY}/${fileKey}`,
                }
                try {
                    const productLinkURL = await s3.getSignedUrlPromise(
                        'getObject',
                        bucketParams
                    )
                    urls.push({
                        link: productLinkURL,
                        name: orderDataItem.price.product.name,
                    })
                } catch (e) {
                    console.log('error getting file', e)
                }
            }

            const mailOptions = {
                from: 'mtliendo@focusotter.com',
                subject: 'Focus Otter Order',
                html: `<p>Thank you ${customerName}!</p> <ul>${urls.map(
                    (u) => `<li>download: <a href=${u.link}>${u.name}</a></li>`
                )}</ul>`,
                to: customerEmail,
            }

            try {
                await transporter.sendMail(mailOptions)
            } catch (e) {
                console.log('error sending email', e)
            }
            break
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${stripeEvent.type}`)
    }
    return 'webhook finished'
}
