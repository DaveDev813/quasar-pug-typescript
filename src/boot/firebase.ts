import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  onMessage,
  getToken,
  Messaging,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDc3-aKR3Pj661qq_gfDkZoOsCL6fUDjEM',
  authDomain: 'ag-push-notifications-c39ae.firebaseapp.com',
  projectId: 'ag-push-notifications-c39ae',
  storageBucket: 'ag-push-notifications-c39ae.firebasestorage.app',
  messagingSenderId: '70554860970',
  appId: '1:70554860970:web:399d701c90327cd9303fd3',
  measurementId: 'G-PJ4F20RVV9',
};

const firebaseApp = initializeApp(firebaseConfig);
let messaging: Messaging | null = null;

export default boot(async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Register your service worker
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      messaging = getMessaging(firebaseApp);

      // Request permission to receive notifications
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted. from BOOT');

        // Get FCM token
        const currentToken = await getToken(messaging, {
          vapidKey:
            'BKxaVbXostmFolcbC7dq9VOwqMJkZtClPi_x2CkfTXnh5yxeGA_92bI-PG_QfJ0Um9iZUFjp9joHARxaKjnrl1E', // Replace with your actual public VAPID key
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // Send the token to your server

          // Send the token to your server
          const userId = 1; // Replace with the actual user ID if available
          const payload = {
            user_id: userId,
            device_token: currentToken,
          };

          // Make a POST request using native fetch
          fetch(
            'http://localhost:8888/SHORE_ALLGRADUATES/ag-notifications-backend/public/register',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          )
            .then((response) => {
              if (response.ok) {
                console.log('Device token registered successfully. from');
              } else {
                console.error(
                  'Failed to register device token. Status:',
                  response.status
                );
              }
            })
            .catch((error) => {
              console.error('Error registering device token:', error);
            });
        } else {
          console.log('No registration token available.');
        }

        // Handle incoming messages
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          // Customize the notification here if needed
        });
      } else {
        console.log('Unable to get permission to notify.');
      }
    } catch (err) {
      console.error(
        'An error occurred while initializing Firebase Messaging: ',
        err
      );
    }
  } else {
    console.log(
      'Service Worker or Push Manager is not supported in this browser.'
    );
  }
});

export { messaging };
