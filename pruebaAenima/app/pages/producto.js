import {renderer, createObject} from '../system.js';
import {Server} from '../server.js';
import { changeUrl } from '../pageNav.js';

export default async function producto(){

    if(!pageData.id) return error();

    console.time("API/products GET");
    let request = await Server.GET("/products", {id:pageData.id});
    let producto = await request.json();
    console.timeEnd("API/products GET");

    if(!producto) return error();

    return createProduct(producto);
}


function createProduct(data){

    let modificarBtn = renderer(createObject("div", {class:'catBtn'}, "Modificar"));
    let borrarBtn = renderer(createObject("div", {class:'catBtn'}, "Borrar"));

    let confirm = false;

    borrarBtn.addEventListener("click", async()=>{
        if(!confirm){
            borrarBtn.style.background = "red";
            borrarBtn.innerText = "Confirmar";
            confirm = true;
        } else {
            console.time("API/products/remove GET");
            let request = await Server.GET(`/products/remove?id=${data.id}`);
            let result = await request.text();
            console.timeEnd("API/products/remove GET");
            if(result){
                setTimeout(()=>{changeUrl("/productos")}, 1000)
            }
        }
    });

    modificarBtn.addEventListener("click",()=>{
        changeUrl(`/productos/edit?id=${data.id}`)
    });

    let productInfo = renderer(createObject(
        "div",
        {class:'infoContainer'},
        createObject("div",{class:'nombre'}, `${data.nombre} ${data.marca}`),
        createObject(
            "div",
            {class:'details'},
            createObject("div",{}, `codigo: #${data.id}`),
            createObject("div",{}, `marca: ${data.marca}`),
            createObject("div",{}, `descripción: ${data.descripcion || "este producto no cuenta con una descripción"}`),
            createObject("div",{}, `precio: $${data.precio} ARS`),
        ),
        createObject("div", {class:'btnContainer'})
    ));

    let productContainer = renderer(createObject(
        "div",
        {class:'viewProductContainer'},
        createObject("img", {class:'image',src:`/assets/images/${data.imagen}`}),
    ));

    productContainer.appendChild(productInfo);
    productInfo.lastChild.appendChild(modificarBtn);
    productInfo.lastChild.appendChild(borrarBtn);

    return productContainer;
}

function error(){
    return renderer(createObject("h3", {}, "producto no encontrado"));
}