// import { initializeApp } from 'firebase/app';
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAfqq-iavbZFvWy1OJu5QYQsUINlLdklYI',
  authDomain: 'i-saloon.firebaseapp.com',
  projectId: 'i-saloon',
  storageBucket: 'i-saloon.appspot.com',
  messagingSenderId: '175367481517',
  appId: '1:175367481517:web:278d3306e25ca858f03e24',
  measurementId: 'G-M43K2LD62W',
};
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
