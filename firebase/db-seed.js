import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replaces the escaped newline
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const seedData = async() => {
    // test data
    const users = [
        {username: 'username1', email: 'email1@example.com', password: 'password1'},
        {username: 'username2', email: 'email2@example.com', password: 'password2'}
    ]

    const batch = db.batch()
    users.forEach(user => {
        const docRef = db.collection('users').doc(user.username) // username as document ID
    
        batch.set(docRef, user)
    })
    await batch.commit()
    console.log('Firestore seeded')
}

seedData()
    .then(() => {
        console.log('Seeding complete')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Error seeding data', error)
        process.exit(1)
    })


// run with node db-seed.js
// to add users dynamically on registration, i think we need to use auth...
