const KEY = "medbi-football-live-favorites-v1";
export function getFavorites(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
export function toggleFavorite(id){const list=getFavorites();const key=String(id);const next=list.includes(key)?list.filter(x=>x!==key):[...list,key];localStorage.setItem(KEY,JSON.stringify(next));return next}
