import { createObject, renderer } from "../system.js";
import { changeUrl } from '../pageNav.js';
import {Server} from '../server.js';

export default async function productoForm(){

    let request = await Server.GET("/products/marcas");
    let marcas = await request.json();
    let product;
    
    if(pageData.id){
        let request = await Server.GET("/products", {id:pageData.id});
        product = await request.json();
    }

    let elem = renderer(createObject("div",{class:'productoForm'}, createObject("form",{class:'form'},
        createObject("label", {for:'img', class:'imageBox'}, "img"),
        createObject("div",{},
            createObject("input", {id:'img', name:'imagen', type:'file', accept:'.jpg, .png, .gif'}),    
            createObject("label", {}, "nombre"),
            createObject("input", {required:'true', type:'text', name:'nombre'}),
            createObject("label", {}, "marca"),
            createObject("input", {required:'true', list:'dl', name:'marca'}, "marca"),
            createObject("datalist", {id:'dl'},
                ...marcas.map(item=>{
                    return createObject("option",{value:item.nombre})
                }),
            ),
            createObject("label", {}, "descripcion"),
            createObject("textarea", {name:'descripcion'}),
            createObject("label", {}, "precio"),
            createObject("input", {required:'true', name:'precio',type:'number', min:0}),
            createObject("input", {class:"submitBtn",type:'submit'}),
        )
    )));

    

    let formulario = elem.querySelector(".form");
    let submitBtn = formulario.querySelector(".submitBtn");
    let img = formulario.querySelector(".imageBox");

    let addFunc = async(e)=>{
        submitBtn.disabled = true;
        e.preventDefault();
        let formdata = new FormData(formulario);
        console.time("API/products/add POST");
        let send = await Server.POST("/products/add",formdata);
        let result = await send.text();
        console.timeEnd("API/products/add POST");
        if(result){
            submitBtn.style.background = "green";
            setTimeout(()=>{
                changeUrl("/productos");
            }, 1000);
        }
    }

    let editFunc = async(e)=>{
        submitBtn.disabled = true;
        e.preventDefault();
        let formdata = new FormData(formulario);
        formdata.set("id", product.id);
        console.time("API/products/update POST");
        let send = await Server.POST("/products/update", formdata);
        let result = await send.text();
        console.timeEnd("API/products/update POST");
        if(result){
            submitBtn.style.background = "green";
            setTimeout(()=>{
                changeUrl("/productos");
            }, 1000);
        }
    }

    formulario.addEventListener("submit", product ? editFunc : addFunc);


    formulario.imagen.addEventListener("change", async (e)=>{
        let url = await imgPreviewUrl(formulario.imagen);
        img.style.backgroundImage = `url("${url}")`;
        img.style.color = "transparent";
    });

    if(product){
        formulario.nombre.value = product.nombre;
        formulario.marca.value = product.marca;
        formulario.descripcion.value = product.descripcion;
        formulario.precio.value = product.precio;
        img.style.backgroundImage = `url("/assets/images/${product.imagen}")`;
        img.style.color = "transparent";
    }


    function imgPreviewUrl(input) {
        if (input.files && input.files[0]) {
          return new Promise((resolve)=>{
            let reader = new FileReader();
            reader.onload = function (e) {
              resolve(e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
          })
        }
    }

    return elem;
}