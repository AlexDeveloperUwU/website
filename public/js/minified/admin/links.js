$(document).ready((function(){$("#showCreateLinkForm").on("click",(function(){$("#createLinkFormContainer").removeClass("hidden"),$("#editLinkFormContainer").addClass("hidden"),$("#deleteLinkFormContainer").addClass("hidden"),$("#allLinksContainer").addClass("hidden")})),$("#showEditLinkForm").on("click",(function(){$("#createLinkFormContainer").addClass("hidden"),$("#editLinkFormContainer").removeClass("hidden"),$("#deleteLinkFormContainer").addClass("hidden"),$("#allLinksContainer").addClass("hidden")})),$("#showDeleteLinkForm").on("click",(function(){$("#createLinkFormContainer").addClass("hidden"),$("#editLinkFormContainer").addClass("hidden"),$("#deleteLinkFormContainer").removeClass("hidden"),$("#allLinksContainer").addClass("hidden")})),$("#showAllLinks").on("click",(function(){$("#createLinkFormContainer").addClass("hidden"),$("#editLinkFormContainer").addClass("hidden"),$("#deleteLinkFormContainer").addClass("hidden"),$("#allLinksContainer").removeClass("hidden"),$.ajax({url:"/allLinks",type:"GET",success:function(e){console.log(e);var n=$("#linksGrid");n.empty(),Array.isArray(e)&&e.length>0?e.forEach((function(e){var r=function(e,n){return`\n      <div class="link-card bg-gray-700 rounded-lg p-4 mb-4 shadow">\n        <h4 class="text-xl font-semibold text-gray-300 content-selectable">ID: ${e}</h4>\n        <p class="text-gray-300"><a href="${n}" target="_blank" class="content-selectable text-blue-400 hover:underline" title="${n}">${n}</a></p>\n      </div>\n    `}(e[0],e[1]);n.append(r)})):n.html("<p class='text-gray-300'>No hay enlaces disponibles.</p>")},error:function(e,n,r){console.error("Error al obtener los enlaces:",n,r)}})})),$("#submitCreateLinkForm").on("click",(function(){var e=$("#createLinkForm").serialize();$.ajax({url:"/addLink",type:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:e,success:function(e){console.log("Enlace creado exitosamente:",e.message),alert(e.message),$("#createLinkForm")[0].reset()},error:function(e,n,r){console.error("Error al crear el enlace:",n,r),alert("Error al crear el enlace: "+e.responseJSON.message)}})})),$("#submitEditLinkForm").on("click",(function(){var e=$("#editLinkForm").serialize();$.ajax({url:"/editLink",type:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:e,success:function(e){console.log("Enlace editado exitosamente:",e.message),alert(e.message),$("#editLinkForm")[0].reset()},error:function(e,n,r){console.error("Error al editar el enlace:",n,r),alert("Error al editar el enlace: "+e.responseJSON.message)}})})),$("#submitDeleteLinkForm").on("click",(function(){var e=$("#deleteLinkForm").serialize();$.ajax({url:"/removeLink",type:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:e,success:function(e){console.log("Enlace eliminado exitosamente:",e.message),alert(e.message),$("#deleteLinkForm")[0].reset()},error:function(e,n,r){console.error("Error al eliminar el enlace:",n,r),alert("Error al eliminar el enlace: "+e.responseJSON.message)}})}))}));