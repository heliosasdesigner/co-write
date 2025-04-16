import React, {useEffect} from "react";
import { View, Button } from "react-native";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, User } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { db, auth } from '../../firebase/config'
    // check adminConfig.js - does this need to be imported instead in the production version?

const LoginButton = () => {
    useEffect(() => {
        getRedirectResult(auth).then((result) => {
            if(result) {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential?.accessToken
                const user = result.user
                console.log("User info: ", user)

                // call firestore to store user info
                const storeUserData = async(user: User) => {
                    const userRef = doc(db, "users", user.uid)
                    await setDoc(userRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lastLogin: new Date(),
                    }, {merge: true})
                }

                if(user) {
                    storeUserData(user)
                }
            }
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    function handleLogin() {
        const provider = new GoogleAuthProvider()
        auth.useDeviceLanguage()

        signInWithRedirect(auth, provider)
    }

    return (
        <View>
            <Button onPress={handleLogin} title="Login with Google" accessibilityLabel="Login with Google blue button"/>
        </View>
    )
};

export default LoginButton;