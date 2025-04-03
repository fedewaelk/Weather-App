//Retorna una Promesa que se resuelve con la ubicación en formato "lat,lon"
export function getDefaultLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude},${longitude}`);
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
