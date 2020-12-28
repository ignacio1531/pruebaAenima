import {renderer, createObject} from './system.js';

const BASE_PATH = "/api";

export class Server {
    static GET(url, params = {}){
        url += '?';
        Object.keys(params).forEach(e=>{
            url+= `${e}=${params[e]}&`;
        });

        return requestChecker(
            fetch(BASE_PATH + url.slice(0, -1),),{
                method:'GET',
            }
        );
    }

    static POST(url, postData){
        let formdata = postData instanceof FormData ? postData : new FormData(renderer(createObject("form",{})));
        if(postData){
            Object.keys(postData).forEach(e=>{
                formdata.set(e, postData[e]);
            });
        }
        let query = fetch(BASE_PATH + url,
            {
                method:'POST',
                body: formdata
            }
        );
        return requestChecker(query);
    }
}

function requestChecker(request){
    return new Promise((resolve, reject)=>{
        request.then(r=>{
            if (!r.ok){
                reject(`Request Status: ${r.status}`);
            }
            resolve(r);
        })
    });
}