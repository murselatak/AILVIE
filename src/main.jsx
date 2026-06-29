import React from"react";import ReactDOM from"react-dom/client";import App from"./App.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
// PWA: register service worker for offline support + installability
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("/sw.js").catch(()=>{});
  });
}
