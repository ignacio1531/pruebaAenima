window.onload = async ()=>{
    console.time("render");

    let {PageNav} = await import("./pageNav.js");
    document.body.appendChild(await PageNav());

    console.timeEnd("render");
}