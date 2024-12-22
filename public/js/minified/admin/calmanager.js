document.addEventListener("DOMContentLoaded",(function(){document.getElementById("showAddEventForm").addEventListener("click",(function(){document.getElementById("addEventFormContainer").classList.remove("hidden"),document.getElementById("deleteEventFormContainer").classList.add("hidden"),document.getElementById("allEventsContainer").classList.add("hidden"),document.getElementById("eventsGrid").innerHTML=""})),document.getElementById("showDeleteEventForm").addEventListener("click",(function(){document.getElementById("deleteEventFormContainer").classList.remove("hidden"),document.getElementById("addEventFormContainer").classList.add("hidden"),document.getElementById("allEventsContainer").classList.add("hidden"),document.getElementById("eventsGrid").innerHTML=""})),document.getElementById("showAllEvents").addEventListener("click",(function(){document.getElementById("addEventFormContainer").classList.add("hidden"),document.getElementById("deleteEventFormContainer").classList.add("hidden"),document.getElementById("allEventsContainer").classList.remove("hidden"),document.getElementById("eventsGrid").innerHTML="",fetch("/manageAllEvents",{method:"GET"}).then((e=>e.json())).then((e=>{var t=document.getElementById("eventsGrid");t.innerHTML="",e.forEach((function(e){var n=function(e){var t=function(e){switch(e){case"Twitch":return"fab fa-twitch";case"YouTube":return"fab fa-youtube";case"Multistream":return"fas fa-video";default:return"fas fa-calendar-alt"}}(e.type);return`\n      <a class="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700">\n        <div class="flex items-center">\n          <i class="${t} mr-3 text-gray-300"></i>\n          <div>\n            <p class="font-bold text-gray-100">${e.type}</p>\n            <p class="text-gray-300">${e.description}</p>\n            <p class="text-gray-300 text-sm">${e.date} - ${e.time} - ID: ${e.id}</p>\n          </div>\n        </div>\n      </a>\n    `}(e);t.insertAdjacentHTML("beforeend",n)}))})).catch((e=>{console.error("Error al obtener los eventos:",e)}))})),document.getElementById("submitAddEventForm").addEventListener("click",(function(){var e=new URLSearchParams(new FormData(document.getElementById("addEventForm"))).toString();fetch("/addEvent",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e}).then((e=>e.json())).then((e=>{console.log("Evento añadido exitosamente:",e),alert("Evento añadido exitosamente")})).catch((e=>{console.error("Error al añadir el evento:",e),alert("Error al añadir el evento")}))})),document.getElementById("submitDeleteEventForm").addEventListener("click",(function(){var e=new URLSearchParams(new FormData(document.getElementById("deleteEventForm"))).toString();fetch("/removeEvent",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e}).then((e=>e.json())).then((e=>{console.log("Evento eliminado exitosamente:",e),alert("Evento eliminado exitosamente")})).catch((e=>{console.error("Error al eliminar el evento:",e),alert("Error al eliminar el evento")}))}))}));