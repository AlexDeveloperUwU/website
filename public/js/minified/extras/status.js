document.addEventListener("DOMContentLoaded",(function(){async function e(){try{const e=await fetch("/json/sites.json"),t=await e.json(),n=document.getElementById("status-container");t.forEach((e=>{let t=document.getElementById(e.statusElement);if(!t){const s=document.createElement("div");s.className="block rounded-lg bg-gray-800 p-6",s.innerHTML=`\n                      <div class="flex items-center">\n                        <i class="fas fa-globe mr-3 text-gray-300"></i>\n                        <div>\n                          <p class="font-bold text-gray-100">${e.name}</p>\n                          <p id="${e.statusElement}" class="text-gray-300 font-agrandir">Verificando estado...</p>\n                        </div>\n                      </div>\n                    `,n.appendChild(s),t=document.getElementById(e.statusElement)}!async function(e,t){for(;t>0;)try{const t=Date.now();await fetch(e.url,{mode:"no-cors"});const n=Date.now()-t,s=document.getElementById(e.statusElement);return s.innerHTML=`Estado: Operativo. Ping: ${n} ms.`,s.classList.add("text-green-500"),void s.classList.remove("text-red-500")}catch{--t>0&&await new Promise((e=>setTimeout(e,1e3)))}const n=document.getElementById(e.statusElement);n.innerHTML="Estado: Offline. No se pudo establecer conexión.",n.classList.add("text-red-500"),n.classList.remove("text-green-500")}(e,3)}))}catch(e){console.error("Error loading the sites:",e),window.location.href="/error?code=500"}}async function t(){try{const e=await fetch("/serverStats"),t=await e.json(),n=document.getElementById("server-status-container");for(const[e,s]of Object.entries(t)){let t=document.getElementById(e);const a=`\n            <span class="text-green-500">CPU: ${s.CPU}%</span> |\n            <span class="text-green-500">RAM: ${s.RAM}%</span> |\n            <span class="text-green-500">Disco: ${s.Disk}%</span>\n          `;if(t)t.innerHTML=a;else{const t=document.createElement("div");t.className="block rounded-lg bg-gray-800 p-6",t.innerHTML=`\n              <div class="flex items-center">\n                <i class="fas fa-server mr-3 text-gray-300"></i>\n                <div>\n                  <p class="font-bold text-gray-100">${e}</p>\n                  <p id="${e}" class="font-agrandir">\n                    ${a}\n                  </p>\n                </div>\n              </div>\n            `,n.appendChild(t)}}}catch(e){console.error("Error loading server stats:",e)}}t(),e(),setInterval(e,6e4),setInterval(t,6e4)}));