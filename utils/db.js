import Enmap from "enmap";

export const calendarDB = new Enmap({ name: "calendar" });
export const linkDB = new Enmap({ name: "linkCutter" });

//* Funciones para generar las ID de los eventos, que también se puede aplicar a los links
function shuffleString(str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function generateId() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  const chars = letras + numeros;

  let idGenerada = "";
  for (let i = 0; i < 6; i++) {
    const indice = Math.floor(Math.random() * chars.length);
    idGenerada += chars.charAt(indice);
  }

  idGenerada = shuffleString(idGenerada);

  return idGenerada;
}

//* Funciones para manejar los eventos
export function addEvent(event) {
  let newId;
  do {
    newId = generateId();
  } while (calendarDB.has(newId));

  calendarDB.set(newId, event);
  return newId;
}

export function removeEvent(event) {
  if (calendarDB.has(event.id)) {
    calendarDB.delete(event.id);
    return true;
  } else {
    return false;
  }
}

export function getAllEvents(style) {
  const entries = calendarDB.entries();
  if (style === "full") {
    return entries.map(([key, value]) => {
      return {
        id: key,
        date: value.date,
        time: value.time,
        type: value.type,
        description: value.description,
      };
    });
  }

  if (style === "simple") {
    return entries.map(([key, value]) => {
      return {
        date: value.date,
        time: value.time,
        type: value.type,
        description: value.description,
      };
    });
  }
}
