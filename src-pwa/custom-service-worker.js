// src-pwa/custom-service-worker.ts

/// <reference lib="webworker" />
/* eslint-disable */
import { precacheAndRoute } from 'workbox-precaching';

// Precache files

precacheAndRoute(self.__WB_MANIFEST);

// Import Firebase scripts
importScripts(
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js'
);

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: 'AIzaSyDc3-aKR3Pj661qq_gfDkZoOsCL6fUDjEM',
  authDomain: 'ag-push-notifications-c39ae.firebaseapp.com',
  projectId: 'ag-push-notifications-c39ae',
  storageBucket: 'ag-push-notifications-c39ae.firebasestorage.app',
  messagingSenderId: '70554860970',
  appId: '1:70554860970:web:399d701c90327cd9303fd3',
  measurementId: 'G-PJ4F20RVV9',
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Background message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png', // Adjust the icon path as needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
/* eslint-disable */
