let googleScriptPromise = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function getGoogleIdToken() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("VITE_GOOGLE_CLIENT_ID is not set");
  }

  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    let receivedToken = false;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response?.credential) {
          receivedToken = true;
          resolve(response.credential);
          return;
        }
        reject(new Error("Google did not return a credential"));
      },
      ux_mode: "popup",
      auto_select: false,
    });

    window.google.accounts.id.prompt((notification) => {
      if (receivedToken) {
        return;
      }

      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reject(new Error("Google sign-in prompt was closed or unavailable"));
      }
    });
  });
}
