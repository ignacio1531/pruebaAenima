import {renderer, createObject} from '../system.js';
import {changeUrl} from '../pageNav.js';
import {Server} from '../server.js';

let productos;
let productosContainer = renderer(createObject("div", {class:'catProductosContainer'}));

export default async function products(){
    let elem = renderer(createObject("div", {class:'productsPage'}));

    let addBtn = renderer(createObject("div", {class:'addBtn'}, "+"));

    addBtn.addEventListener("click", ()=>{changeUrl("/productos/add")});

    elem.appendChild(filtersContainer());
    elem.appendChild(productosContainer);
    elem.appendChild(addBtn);


    console.time("API/products GET");
    let request = await Server.GET("/products");
    productos = await request.json();
    console.timeEnd("API/products GET");

    getProducts();

    return elem;
}

async function getProducts(...filter){

    let contadorProductos = 0;

    if(productosContainer.children.length) productosContainer.innerHTML = "";

    productos.forEach(element => {

        let approved = true;

        if(filter){
            filter.forEach( fItem=>{
                let valor = !isNaN(element[fItem.fieldName]) ? parseInt(element[fItem.fieldName]) : element[fItem.fieldName];
                if(!fItem.condition(valor)){
                    approved = false;
                    return;
                };
            });
        }

        if(!approved) return;

        contadorProductos++;

        let item = renderer(createObject(
            "div",
            {class:'producto'},
            createObject("img",{src:`/assets/images/${element.imagen}`, class:'image'}),
            createObject("div", {class:'text'}, `${element.nombre} ${element.marca}`),
            createObject("div", {class:'precio'}, `$${element.precio}`)
        ));

        item.addEventListener("click", ()=>changeUrl(`/producto?id=${element.id}`));

        productosContainer.appendChild(item);
    });

    if(!contadorProductos) productosContainer.appendChild(renderer(createObject("h4",{}, "Ningun producto cumple los requisitos.")))
}

function filtersContainer(){

    let precioMaxFilter = renderer(createObject("div", {class:'filterItem'}, createObject("b",{}, "Precio maximo"),createObject("input",{class:'filterInput',type:'number', min:0, value:1000000})));
    let precioMinFilter = renderer(createObject("div", {class:'filterItem'}, createObject("b",{}, "Precio minimo"),createObject("input",{class:'filterInput',type:'number', min:0, value:0})));
    let buscarFilter = renderer(createObject("div", {class:'filterItem'}, createObject("b",{}, "Buscar"),createObject("input",{class:'filterInput',type:'text'})));


    let maxPrecioInput = precioMaxFilter.querySelector(".filterInput");
    let minPrecioInput = precioMinFilter.querySelector(".filterInput");
    let buscarInput = buscarFilter.querySelector(".filterInput");

    let inputOnChange = ()=>{
        getProducts(
            {
                fieldName:'precio', 
                condition:(x)=>(x <= maxPrecioInput.value && true) || false
            },
            {
                fieldName:'precio', 
                condition:(x)=>(x >= minPrecioInput.value && true) || false
            },
            {
                fieldName:'nombre',
                condition:(x)=>{
                    if(!buscarInput.value.length)return true;
                    if(!x.toLowerCase().includes(buscarInput.value)) return false;
                    return true;
                }
            }
        )
    }


    maxPrecioInput.addEventListener("input", inputOnChange);
    minPrecioInput.addEventListener("input", inputOnChange);
    buscarInput.addEventListener("input", inputOnChange);

    let elem = renderer(createObject("div",{class:'filterContainer'},));

    elem.appendChild(precioMaxFilter);
    elem.appendChild(precioMinFilter);
    elem.appendChild(buscarFilter);

    return elem;
}