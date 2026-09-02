import { registerSW } from "virtual:pwa-register";

export function registerServiceWorker() {
  registerSW({
    immediate: true,

    onOfflineReady() {
      console.log("Dapitan Tourism is ready to work offline.");
    },

    onNeedRefresh() {
      console.log("A new version of Dapitan Tourism is available.");
    },

    onRegisterError(error) {
      console.error("PWA registration error:", error);
    },
  });
}