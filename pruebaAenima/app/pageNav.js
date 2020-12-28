import {renderer, createObject, urlParse} from './system.js';

const ROUTES_URL = "/app/routes.json";

let pageNavContainer;
let rutes;
let currentPage;
window.pageData = urlParse();

async function PageNav() {
    rutes = await getRutes();
    
    pageNavContainer = renderer(createObject("div", {class:'pageNavContainer'}));

    LoadPage();

    return pageNavContainer;
}

async function getRutes(){
    let request = await fetch(ROUTES_URL);
    let jsonResponse = await request.json();

    return jsonResponse;
}

async function LoadPage(){

    if(currentPage === pageData.pathname)return;

    if(pageNavContainer.children.length > 0)
        pageNavContainer.removeChild(pageNavContainer.firstChild);

    if(rutes[pageData.pathname]){
        let page = await import(rutes[pageData.pathname]);
        pageNavContainer.appendChild(await page.default());
    } else {
        let page = await import(rutes["default"]);
        pageNavContainer.appendChild(await page.default());
    }

    currentPage = pageData.pathname;
}

function changeUrl(url){;
    history.pushState(null,null, url);
    pageData = urlParse();
    LoadPage();
}


window.onpopstate = ()=>{
    window.pageData = urlParse();
    LoadPage();
}


export {PageNav, changeUrl}