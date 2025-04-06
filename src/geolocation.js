export function getDefaultLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            const response = await fetch(url, {
              headers: {
                // Es recomendable enviar un User-Agent válido según la política de Nominatim
                'User-Agent': 'AppName/1.0 (email@example.com)', // Cambiar esto
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const { address } = data;
            // Diferentes propiedades de localidades
            const locality =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              'Unknow locality';
            resolve(locality);
          } catch (error) {
            reject(
              new Error('Error during reverse geocoding: ' + error.message)
            );
          }
        },
        (error) => {
          reject(new Error('Error obtaining location: ' + error.message));
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}
