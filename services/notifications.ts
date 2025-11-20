
export const NotificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta notificações.");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  },

  send: (title: string, body: string) => {
    if (Notification.permission === "granted") {
      try {
        // Send basic browser notification
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/1067/1067566.png', // Generic money icon
          vibrate: [200, 100, 200],
          requireInteraction: true
        } as any);
      } catch (e) {
        console.error("Erro ao enviar notificação", e);
      }
    }
  }
};
