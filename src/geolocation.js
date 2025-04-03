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
          reject(new Error('Error al obtener la ubicación: ' + error.message));
        }
      );
    } else {
      reject(
        new Error('La geolocalización no está soportada en este navegador.')
      );
    }
  });
}
