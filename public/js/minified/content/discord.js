document.addEventListener("DOMContentLoaded",(function(){function e(){(async function(){try{const e=await fetch("https://api.lanyard.rest/v1/users/419176939497193472"),t=await e.json();if(t.success)return t.data.discord_status;throw new Error("Failed to fetch Discord status")}catch(e){throw console.error("Error fetching Discord status:",e),e}})().then((e=>function(e){const t=function(e){switch(e){case"online":return"green";case"idle":return"yellow";case"dnd":return"red";case"offline":return"gray";default:return"blue"}}(e);document.getElementById("profileImage").style.borderColor=t;let n="";switch(e){case"online":n="conectado";break;case"idle":n="ausente";break;case"dnd":n="ocupado";break;case"offline":n="desconectado";break;default:n="desconocido"}document.getElementById("myDiscordStatus").textContent=n}(e))).catch((e=>console.error("Error updating Discord status:",e)))}e(),setInterval(e,3e4)}));