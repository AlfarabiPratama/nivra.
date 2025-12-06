export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
};

export const sendNotification = async ({ title, body }) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  const permission =
    Notification.permission === 'granted'
      ? 'granted'
      : await requestNotificationPermission();

  if (permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
};
