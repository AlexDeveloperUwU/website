function showMainContent(){const t=document.querySelector("main"),e=document.getElementById("back-button");t.classList.remove("hidden"),t.classList.add("fade-in"),e&&(e.classList.remove("hidden"),e.classList.add("fade-in"))}function fadeOutMainContent(t){const e=document.querySelector("main"),n=document.getElementById("back-button");e.classList.remove("fade-in"),e.classList.add("fade-out"),n&&(n.classList.remove("fade-in"),n.classList.add("fade-out")),setTimeout((function(){e.classList.add("hidden"),n&&n.classList.add("hidden"),t()}),605)}window.addEventListener("load",(function(){setTimeout(showMainContent,600)})),document.addEventListener("DOMContentLoaded",(function(){document.addEventListener("click",(function(t){const e=t.target.closest('a[href*="/?view="]');if(e){t.preventDefault();const n=e.href;fadeOutMainContent((function(){window.location.href=n}))}}))}));