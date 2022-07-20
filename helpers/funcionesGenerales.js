
const sortObject = (obj) =>{

    const keys = Object.keys(obj);
    keys.sort();
    let nuevo = {};

    keys.forEach(key=>{
        nuevo[key] = obj[key];
    })
    return nuevo;
}



module.exports = {
    sortObject
}