const KEY = "medbi-football-live-favorites-v1";
export function getFavorites(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
export function toggleFavorite(id){const list=getFavorites();const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];localStorage.setItem(KEY,JSON.stringify(next));return next}
