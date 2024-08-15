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

//* Funciones para manejar los enlaces acortados

export function addLink(linkData) {
  let newId = linkData.id;

  if (newId) {
    if (linkDB.has(newId)) {
      throw new Error(`ID ${newId} already exists.`);
    }
  } else {
    do {
      newId = generateId();
    } while (linkDB.has(newId));
  }

  linkDB.set(newId, linkData);
  return newId;
}

export function updateLink(linkData) {
  if (linkDB.has(linkData.id)) {
    linkDB.set(linkData.id, linkData);
    return true;
  } else {
    return false;
  }
}

export function removeLink(id) {
  if (linkDB.has(id)) {
    linkDB.delete(id);
    return true;
  } else {
    return false;
  }
}

export function getLinkData(id) {
  if (linkDB.has(id)) {
    return linkDB.get(id);
  } else {
    return null;
  }
}

export function getAllLinks() {
  const entries = Array.from(linkDB.entries());
  return entries.map(([key, value]) => {
    return {
      id: key,
      url: value.url,
    };
  });
}
