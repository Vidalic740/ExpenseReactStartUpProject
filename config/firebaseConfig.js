// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey:"AIzaSyBYyOjqK_07HH64kIEuH47jyeXpxLitgg0",
  authDomain: "expense-802f1.firebaseapp.com",
  projectId: "expense-802f1",
  storageBucket: "expense-802f1.appspot.com",
  appId: "1:200529939607:android:487e23916a70f1448b2dd2",
};

export const firebaseApp = initializeApp(firebaseConfig);

