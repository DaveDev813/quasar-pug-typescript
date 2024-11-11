<template lang="pug">
  h1 TEST FIREBASE
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { messaging } from '../firebaseConf';
import { getToken, onMessage } from 'firebase/messaging';

const deviceToken = ref<string | null>(null);

// async function requestNotificationPermission() {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       deviceToken.value = await getToken(messaging, {
//         vapidKey:
//           'BKxaVbXostmFolcbC7dq9VOwqMJkZtClPi_x2CkfTXnh5yxeGA_92bI-PG_QfJ0Um9iZUFjp9joHARxaKjnrl1E', // Replace with your actual public VAPID key
//       });
//       console.log('Device Token:', deviceToken.value);
//       // Send the token to your server here
//     } else {
//       console.warn('Notification permission not granted');
//     }
//   } catch (error) {
//     console.error('Error getting device token:', error);
//   }
// }

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await updateDeviceToken();
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}

async function updateDeviceToken() {
  try {
    const newToken = await getToken(messaging, {
      vapidKey:
        'BKxaVbXostmFolcbC7dq9VOwqMJkZtClPi_x2CkfTXnh5yxeGA_92bI-PG_QfJ0Um9iZUFjp9joHARxaKjnrl1E',
    });
    if (deviceToken.value !== newToken) {
      console.log('Device token refreshed:', newToken);
      deviceToken.value = newToken;
      // Send the new token to your server here

      const payload = {
        user_id: 1,
        device_token: newToken,
      };
      await fetch(
        'http://localhost:8888/SHORE_ALLGRADUATES/ag-notifications-backend/public/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
    }
  } catch (error) {
    console.error('Error getting device token:', error);
  }
}

function listenForMessages() {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    // Handle foreground messages here
  });
}

onMounted(() => {
  requestNotificationPermission();
  listenForMessages();
});
</script>
