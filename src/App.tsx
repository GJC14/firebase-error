import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth'
import { useEffect, useRef } from 'react'
import './App.css'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
}

const app = initializeApp(firebaseConfig)

const actionCodeSettings = {
    url: 'http://localhost:5173',
    handleCodeInApp: true,
}

export default function App() {
    const auth = getAuth(app)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleSignInWithEmailLink = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn')
                if (!email) {
                    email = window.prompt('Please provide your email for confirmation')
                    if (!email) return alert('Please enter an email')
                }

                // The function will send multiple requests to the server.
                // When sign up, results in both error auth/email-already-in-use and success.
                const result = await signInWithEmailLink(auth, email, window.location.href)
                console.log('result.user', result.user)
            }
        }

        handleSignInWithEmailLink()
    }, [])

    return (
        <>
            <h1>Sign In</h1>
            <input ref={inputRef} />
            <button
                onClick={async () => {
                    const email = inputRef.current?.value
                    alert(`Email: ${email}`)

                    if (!email) return alert('Please enter an email')
                    window.localStorage.setItem('emailForSignIn', email)
                    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
                    alert('Email sent')
                }}
            >
                Sign In
            </button>
        </>
    )
}
