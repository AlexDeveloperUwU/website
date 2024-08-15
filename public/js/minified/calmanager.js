$(document).ready((function(){$("#showAddEventForm").on("click",(function(){$("#addEventFormContainer").removeClass("hidden"),$("#deleteEventFormContainer").addClass("hidden"),$("#allEventsContainer").addClass("hidden"),$("#eventsGrid").empty()})),$("#showDeleteEventForm").on("click",(function(){$("#deleteEventFormContainer").removeClass("hidden"),$("#addEventFormContainer").addClass("hidden"),$("#allEventsContainer").addClass("hidden"),$("#eventsGrid").empty()})),$("#showAllEvents").on("click",(function(){$("#addEventFormContainer").addClass("hidden"),$("#deleteEventFormContainer").addClass("hidden"),$("#allEventsContainer").removeClass("hidden"),$("#eventsGrid").empty(),$.ajax({url:"/manageAllEvents",type:"GET",success:function(e){var n=$("#eventsGrid");n.empty(),e.forEach((function(e){var t=function(e){var n=function(e){switch(e){case"Twitch":return"fab fa-twitch";case"YouTube":return"fab fa-youtube";case"Multistream":return"fas fa-video";default:return"fas fa-calendar-alt"}}(e.type);return`\n      <a class="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700">\n        <div class="flex items-center">\n          <i class="${n} mr-3 text-gray-300"></i>\n          <div>\n            <p class="font-bold text-gray-100">${e.type}</p>\n            <p class="text-gray-400">${e.description}</p>\n            <p class="text-gray-400 text-sm">${e.date} - ${e.time} - ID: ${e.id}</p>\n          </div>\n        </div>\n      </a>\n    `}(e);n.append(t)}))},error:function(e,n,t){console.error("Error al obtener los eventos:",n,t)}})})),$("#submitAddEventForm").on("click",(function(){var e=$("#userAddEvent").val(),n=$("#passwordAddEvent").val(),t=$("#addEventForm").serialize();$.ajax({url:"/addEvent",type:"POST",headers:{Authorization:"Basic "+btoa(e+":"+n),"Content-Type":"application/x-www-form-urlencoded"},data:t,success:function(e){console.log("Evento añadido exitosamente:",e)},error:function(e,n,t){console.error("Error al añadir el evento:",n,t)}})})),$("#submitDeleteEventForm").on("click",(function(){var e=$("#userDeleteEvent").val(),n=$("#passwordDeleteEvent").val(),t=$("#deleteEventForm").serialize();$.ajax({url:"/removeEvent",type:"POST",headers:{Authorization:"Basic "+btoa(e+":"+n),"Content-Type":"application/x-www-form-urlencoded"},data:t,success:function(e){console.log("Evento eliminado exitosamente:",e)},error:function(e,n,t){console.error("Error al eliminar el evento:",n,t)}})}))}));