function showMainContent(){const n=document.querySelector("main");n.classList.remove("hidden"),n.classList.add("fade-in")}function fadeOutMainContent(n){const t=document.querySelector("main");t.classList.remove("fade-in"),t.classList.add("fade-out"),setTimeout((function(){t.classList.add("hidden"),n()}),605)}window.addEventListener("load",(function(){setTimeout(showMainContent,600)})),document.addEventListener("DOMContentLoaded",(function(){document.addEventListener("click",(function(n){const t=n.target.closest('a[href*="/?view="]');if(t){n.preventDefault();const e=t.href;fadeOutMainContent((function(){window.location.href=e}))}}))}));