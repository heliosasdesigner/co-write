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

const deleteUserByUsername = async(username) => {
    try{
        const docRef = db.collection('users').doc(username)

        const doc = await docRef.get()
        if(!doc.exists) {
            console.log('No such user')
            return
        }

        await docRef.delete()
        console.log(`User ${username} deleted successfully`)
    } catch(error) {
        console.error('Error deleting user', error)
    }
}

deleteUserByUsername('username1')

// node firebase/db-delete.js