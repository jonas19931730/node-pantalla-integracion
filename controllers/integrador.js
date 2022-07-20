const {sortObject} = require('../helpers/funcionesGenerales')
const {io} = require('socket.io-client');
const {
        consultarJson, 
        getCamposByIntegracion,
        validarParametrosBusqueda,
        getCompletados,
        getMaximaPosicion,
        getNotificacionesProcesando
    
      } = require('../dao/integrador')

const socket = io("http://172.17.17.17:8080");

const listarNotificaciones = async(req,res)=>{

    const {tipo_proceso, tipo_integracion ,fecha_produccion ,id_tipo_integracion , id_operacion_fase_integracion} = req.body;

    const control = await validarParametrosBusqueda({tipo_proceso, tipo_integracion ,fecha_produccion,id_operacion_fase_integracion});
    const data_busqueda = await consultarJson(tipo_proceso, tipo_integracion ,fecha_produccion,id_operacion_fase_integracion);
    const campos = await getCamposByIntegracion(id_tipo_integracion);
    
    let data = [];
    let error = "0";
    if(control){
        try{
            
            data = await procesoControlEnviados(control.id_control,data_busqueda);
        }
        catch(error){
            error = {
                mensaje:"Error en los datos"
            }
        }
    
    }
    else{
        try{
            data_busqueda.forEach((val,POSICION)=>{
            
                let json = JSON.parse(val.data);
                json.POSICION = POSICION+1;
                json.estado_busqueda=1;
                data.push(json);

            })
            
        }
        catch(mensaje_error){
            error = {
                mensaje:"Error en los datos"
            }
        }
    }
    const id_integracion = (control)?control.idintegracion:0;
    const id_control = (control)?control.id_control:0;
    const ultima_posicion = (control)?control.ultima_posicion:0;

    let result = {
        campos,
        data,
        id_integracion,
        id_control,
        ultima_posicion,
        error 
    }
    res.json(result);
}
// metodos privados
const procesoControlEnviados = async(idcontrol,data_busqueda)=>{
        
        const dataProcesando  =  await getNotificacionesProcesando(idcontrol);
        const dataEnviadoExito = await getCompletados(idcontrol,2); // sin error
        const dataEnviadoError = await getCompletados(idcontrol,1); // con error



        let maximaposicion = await getMaximaPosicion(idcontrol);
        let POSICION = maximaposicion.ultima_posicion+1;
        const data = [];
        for(let i=0;i<data_busqueda.length;i++){
            let val = data_busqueda[i];
                let jsonCadena;
                try{
                    jsonCadena = JSON.parse(val.data);

                }
                catch(error){
                    console.log(val.data);
                }
                let estado = 1;
                let posicionFinal = null;
                let respuesta = null;
                let ultimo = 0;
                if(dataProcesando.length>0){
                    const val = dataProcesando.find((v)=>JSON.stringify(sortObject(v.json)) == JSON.stringify(sortObject(jsonCadena)));
                    if(val!=undefined){
                        estado = 2;
                        
                        ultimo = val.ultima_posicion;
                        posicionFinal = val.posicion;
                    }
                }
                
                if(dataEnviadoError.length>0){
                    const val = dataEnviadoError.find((v)=>JSON.stringify(sortObject(v.json)) == JSON.stringify(sortObject(jsonCadena)));
                    
                    if(val!=undefined){
                        estado = 4;
                        respuesta = val.respuesta.DETALLE;
                        ultimo = val.ultima_posicion;
                        posicionFinal = val.posicion;
                    }
                }
                if(dataEnviadoExito.length>0){
                    const val = dataEnviadoExito.find((v)=>JSON.stringify(sortObject(v.json)) == JSON.stringify(sortObject(jsonCadena)));
                    if(val!=undefined){
                        estado = 3;
                        respuesta = val.respuesta.DETALLE;
                        ultimo = val.ultima_posicion;
                        posicionFinal = val.posicion;
                    }
                }
                if(posicionFinal == null){
                    posicionFinal = POSICION++;
                }
                
                let json = JSON.parse(val.data);
              
               
                json.POSICION = posicionFinal;
                json.estado_busqueda = estado;
                json.ultima_posicion = ultimo;
                json.respuesta = respuesta;
                
                data.push(json);
        }
        
    return data;
}

const validarBusqueda = async(req,res)=>{
    //const {id_control} = req.body;

    const data = await getNotificacionesProcesando(62) ;

    res.json(data);

}

const recibirCompletadas = async(req,res)=>{
    const val = req.body;
    console.log(val);
    socket.emit('confirmar-datos',req.body)
    res.json({
        estado:"ok"
    })
}

module.exports = {
    listarNotificaciones,
    recibirCompletadas,
    validarBusqueda,    
}