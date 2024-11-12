// public/firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyDc3-aKR3Pj661qq_gfDkZoOsCL6fUDjEM',
  authDomain: 'ag-push-notifications-c39ae.firebaseapp.com',
  projectId: 'ag-push-notifications-c39ae',
  storageBucket: 'ag-push-notifications-c39ae.firebasestorage.app',
  messagingSenderId: '70554860970',
  appId: '1:70554860970:web:399d701c90327cd9303fd3',
  measurementId: 'G-PJ4F20RVV9',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[Service Worker] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'Notification Title';
  const notificationOptions = {
    body: payload.notification.body || 'Notification Body',
    icon: payload.notification.icon || '/icons/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
