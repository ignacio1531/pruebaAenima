export function createObject(type, atribs, ...children){
    return { type, atribs, children };
}

export function renderer(obj){
    const e = document.createElement(obj.type);
    if(obj.atribs){
      for(let k of Object.keys(obj.atribs)){
        e.setAttribute(k, obj.atribs[k]);
      }
    }
    if(obj.children)obj.children.forEach(child => {
      if(typeof child === "string"){
        return e.appendChild(document.createTextNode(child));
      } else {
        return e.appendChild(renderer(child));
      }
    });
    return e;
}

export function urlParse(){
  let parser = renderer(createObject("a",{href:location.href}));

  let data = {
    pathname : parser.pathname,
    hostname : parser.hostname,
  }

  parser.search.slice(1).split('&').forEach((e)=>{
    if(!e)return;
    let [key,value] = e.split('='); data[key] = value;
  });

  return data;
}