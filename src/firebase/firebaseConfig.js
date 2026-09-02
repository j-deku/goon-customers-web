import { initializeApp } from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)

let messagingInstance = null
let messagingChecked = false

export async function getMessagingInstance() {
  if (messagingChecked) return messagingInstance

  messagingChecked = true
  try {
    const supported = await isSupported()
    if (supported) {
      messagingInstance = getMessaging(app)
    } else {
      console.warn('Firebase Messaging is not supported in this environment')
    }
  } catch (err) {
    console.warn('Firebase Messaging support check failed:', err)
  }
  return messagingInstance
}