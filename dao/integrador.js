const {getClienteAtunera , getClienteIntegrador} = require('../database/config')
const cliente = getClienteAtunera();
const clienteInt = getClienteIntegrador(); 

const  consultarJson= async (proceso,tipo_integracion,fecha,tipo_operacion_fase) =>{
    const consulta = "select s4_func_nwi_getjsondata as data FROM s4_func_nwi_getjsondata('"+proceso+"', '"+tipo_integracion+"', '"+fecha+"',"+tipo_operacion_fase+")";
    try{
        const result = await cliente.query(consulta);
        return result.rows;
     }
     catch(error){
         console.log("ERROR "+error)
         return "error"
     }
}

const getTipoProcesos = async()=>{
    const consulta = "select * from nwi_tipo_proceso";
    try{
        const result = await cliente.query(consulta);
        return result.rows;
     }
     catch(error){
         console.log("ERROR "+error)
         return "error"
     }
}

const getIntegracionesByProceso = async (tipo_proceso) =>{
        //const consulta = "select * from view_tipo_integracion vw where vw.idnwitipoproceso = "+tipo_proceso;
        const consulta = " SELECT nti.idnwitipointegracion, nti.codintegracion, nti.idnwitipoproceso, nti.descripcion, nws.idnwisociedad, nws.codsociedad, nwp.idnwiplanta, " 
                    +" nwp.codplanta, nwa.idnwiarea, nwa.codparea, nwc.idnnwicentro, nwc.codcentro, nti.prioridad "
                    +" FROM nwi_tipo_integracion nti"
                    +" INNER JOIN nwi_sociedad nws ON nti.idnwisociedad = nws.idnwisociedad"
                    +" INNER JOIN nwi_planta nwp ON nti.idnwiplanta = nwp.idnwiplanta"
                    +" INNER JOIN nwi_area nwa ON nti.idnwiarea = nwa.idnwiarea"
                    +" INNER JOIN nwi_centro nwc ON nti.idnwicentro = nwc.idnnwicentro WHERE nti.idnwitipoproceso = "+tipo_proceso;
        try{
            const result = await cliente.query(consulta);
            return result.rows;
        }
        catch(error){
            console.log("ERROR "+error)
            return "error"
        }
}

const getOperacionFase = async(tipo_integracion) =>{
    const consulta = "select idnwioperacionfasetipointegracion,descripcion from nwi_operacion_fase_tipo_integracion where idnwitipointegracion = "+tipo_integracion+" order by orden" ;
        try{
            const result = await cliente.query(consulta);
            return result.rows;
        }
        catch(error){
            console.log("ERROR "+error)
            return "error"
        }
}

const getCamposByIntegracion = async (tipo_integracion)=>{
    const consulta = "select descripcion,descripcion_usuario,vista_usuario,vista_enviar,discriminar_vacio from nwi_plantilla where idnwitipointegracion = "+tipo_integracion+" order by orden";
        try{
            const result = await cliente.query(consulta);
            return result.rows;
        }
        catch(error){
            console.log("ERROR "+error)
            return "error"
        }
}

const validarParametrosBusqueda = async(parametrosBusqueda)=>{
    const cadenaBusqueda = JSON.stringify(parametrosBusqueda)
    console.log(parametrosBusqueda)
    const consulta = "select id_control,idintegracion,ultima_posicion from nwi_cab_control where text(json_busqueda) = '"+cadenaBusqueda+"'";
    try{
        const result = await clienteInt.query(consulta);
        return result.rows[0];
    }
    catch(error){
        console.log("ERROR "+error)
        return "error"
    }
}

const getNotificacionesProcesando = async(idcontrol)=>{
    const consulta = "select json_envio_sap as json,posicion,ultima_posicion from nwi_posicion_detalle where id_control = "+idcontrol+" and estadoenviosap = 1 and "
                    +" estadorespuestasap is null";
    try{
        const result = await clienteInt.query(consulta);
        return result.rows;
    }
    catch(error){
        console.log("ERROR "+error)
        return "error"
    }
}

const getCompletados = async(idcontrol,estadoerror)=>{
    let consulta;
    if(estadoerror == 2){
        consulta = "select json_envio_sap as json,jsonrespuestasap as respuesta,posicion,ultima_posicion from nwi_posicion_detalle where id_control = "+idcontrol+" and estadoenviosap = 1 and"
                        +" estadorespuestasap = 1 and estadoerror = "+estadoerror;
    }
    else{
        consulta = "select json_envio_sap as json,jsonrespuestasap as respuesta,posicion,ultima_posicion from nwi_posicion_detalle where id_control = "+idcontrol+" and estadoenviosap = 1 and"
                        +" estadorespuestasap = 2 and estadoerror = "+estadoerror;
    }
    try{
        const result = await clienteInt.query(consulta);
        const final = result.rows;
        
        return final;
    }
    catch(error){
        console.log("ERROR "+error)
        return "error"
    }
}

const getMaximaPosicion = async(id_control)=>{
    const consulta = "select max(posicion) as ultima_posicion from nwi_posicion_detalle where id_control = "+id_control;
    try{
        const result = await clienteInt.query(consulta);
        return result.rows[0];
    }
    catch(error){
        console.log("ERROR "+error)
        return "error"
    }
}

const getPosicionByJsonControl = async(json,id_control)=>{
    
    const consulta = "select posicion from nwi_posicion_detalle where text(json_envio_sap) = '"+json+"' and id_control = "+id_control;
    try{
        const result = await clienteInt.query(consulta);
        return result.rows[0];
    }
    catch(error){
        console.log("ERROR "+error)
        return "error"
    }
}



module.exports = {
    consultarJson,
    getTipoProcesos,
    getIntegracionesByProceso,
    getCamposByIntegracion,
    validarParametrosBusqueda,
    getNotificacionesProcesando,
    getCompletados,
    getMaximaPosicion,
    getPosicionByJsonControl,
    getOperacionFase
}