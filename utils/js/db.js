import Enmap from "enmap";

export const calendarDB = new Enmap({ name: "calendar" });
export const linkDB = new Enmap({ name: "linkCutter" });

//* Funciones para generar las ID de los eventos o enlaces
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
  const entries = Array.from(calendarDB.entries());
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

export function getEventsByDate(date) {
  const formattedDate = date.split("/").reverse().join("-");
  const entries = Array.from(calendarDB.entries());
  return entries
    .filter(([key, value]) => value.date === formattedDate)
    .map(([key, value]) => ({
      id: key,
      date: value.date,
      time: value.time,
      type: value.type,
      description: value.description,
    }));
}

//* Funciones para manejar los enlaces
export function addLink(id, url) {
  if (id) {
    if (linkDB.has(id)) {
      return false;
    } else {
      linkDB.set(id, url);
      return true;
    }
  } else {
    let newId;
    do {
      newId = generateId();
    } while (linkDB.has(newId));

    linkDB.set(newId, url);
    return newId;
  }
}

export function editLink(id, url) {
  if (linkDB.has(id)) {
    linkDB.set(id, url);
    return true;
  } else {
    return false;
  }
}

export function removeLink(id) {
  if (linkDB.has(id)) {
    const url = linkDB.get(id);
    linkDB.delete(id);
    return url;
  } else {
    return false;
  }
}

export function getLink(id) {
  return linkDB.get(id);
}

export function getAllLinks() {
  return Array.from(linkDB.entries());
}
