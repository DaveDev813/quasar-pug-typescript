<template lang="pug">
  h1 TEST FIREBASE
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { messaging } from '../firebaseConf';
import { getToken, onMessage } from 'firebase/messaging';
import { Notify } from 'quasar';

const deviceToken = ref<string | null>(null);

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      deviceToken.value = await getToken(messaging, {
        vapidKey:
          'BKxaVbXostmFolcbC7dq9VOwqMJkZtClPi_x2CkfTXnh5yxeGA_92bI-PG_QfJ0Um9iZUFjp9joHARxaKjnrl1E', // Replace with your actual public VAPID key
      });
      console.log('Device Token:', deviceToken.value);
      // Send the token to your server here

      const param = {
        user_id: 1,
        device_token: deviceToken.value,
      };
      await fetch(
        'http://192.168.0.102:8888/SHORE_ALLGRADUATES/ag-notifications-backend/public/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(param),
        }
      );
    } else {
      console.warn('Notification permission not granted');
    }
  } catch (error) {
    console.error('Error getting device token:', error);
  }
}

function listenForMessages() {
  onMessage(messaging, async (payload: any) => {
    console.log('Message received:', payload);
    // Handle foreground messages here

    Notify.create({
      message: payload.notification.body,
      color: 'blue',
      icon: 'info',
    });
  });
}

onMounted(() => {
  requestNotificationPermission();
  listenForMessages();
});
</script>
