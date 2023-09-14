import {getApp, getApps, initializeApp} from "@firebase/app";
import {getAuth} from "@firebase/auth";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_ID_PROVIDER_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_ID_PROVIDER_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGEING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

let app: any
if (!getApps().length) {
    app = initializeApp(firebaseConfig)
} else {
    app = getApp()
}

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app);