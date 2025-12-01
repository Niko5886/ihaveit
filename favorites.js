function getFavoritesKey(){const u=localStorage.getItem('imamgo_current_user');if(!u)return'imamgo_favorites_guest';try{const parsed=JSON.parse(u);return `imamgo_favorites_${parsed.email||'user'}`;}catch{return'imamgo_favorites_user';}}
function getFavorites(){try{return JSON.parse(localStorage.getItem(getFavoritesKey())||'[]');}catch{return[];}}
function setFavorites(list){localStorage.setItem(getFavoritesKey(),JSON.stringify(list));}

function renderFavorites(){const listEl=document.getElementById('favoritesList');const empty=document.getElementById('emptyState');const favs=getFavorites();listEl.innerHTML='';if(!favs.length){empty.style.display='block';return;}empty.style.display='none';favs.forEach(item=>{const card=document.createElement('div');card.className='card';card.innerHTML=`<img src="${item.image}" alt="${item.title}">\n<div class='content'>\n  <div class='title'>${item.title}</div>\n  <div class='meta'>${item.price} • ${item.location}</div>\n  <div class='row'>\n    <small>${item.category}</small>\n    <button class='remove' data-id='${item.id}'>Премахни</button>\n  </div>\n</div>`;listEl.appendChild(card);});

listEl.querySelectorAll('.remove').forEach(btn=>{btn.addEventListener('click',()=>{const id=parseInt(btn.getAttribute('data-id'));const filtered=getFavorites().filter(i=>i.id!==id);setFavorites(filtered);renderFavorites();});});}

window.addEventListener('DOMContentLoaded',renderFavorites);