document.addEventListener("DOMContentLoaded",(function(){fetch("/json/projects.json").then((e=>e.json())).then((e=>{const n=document.getElementById("projects-container");e.forEach((e=>{const t=document.createElement("a");t.href=e.url,t.className="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700",t.innerHTML=`\n            <div class="flex items-center">\n              <i class="${e.icon} mr-3 text-gray-300"></i>\n              <div>\n                <p class="font-bold text-gray-100">${e.name}</p>\n                <p class="text-gray-400 font-agrandir">${e.description}</p>\n              </div>\n            </div>\n          `,n.appendChild(t)}));const t=document.createElement("a");t.href="https://github.com/AlexDeveloperUwU",t.className="block rounded-lg bg-gray-800 p-6 hover:bg-blue-700",t.innerHTML='\n          <div class="flex items-center">\n            <i class="fab fa-github mr-3 text-gray-300"></i>\n            <div>\n              <p class="font-bold text-gray-100">Otros proyectos</p>\n              <p class="text-gray-400 font-agrandir">Quieres ver otros proyectos que tengo? Si es así, pásate por mi GitHub! Tiene otros tantos proyectos no tan destacables pero que pueden llegar a ser de tu interés :D</p>\n            </div>\n          </div>\n        ',n.appendChild(t)})).catch((e=>console.error("Error loading projects:",e)))}));