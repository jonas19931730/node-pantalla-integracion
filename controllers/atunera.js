const {getTipoProcesos , getIntegracionesByProceso , getCamposByIntegracion,getOperacionFase} =require('../dao/integrador')


const listarTipoProcesos = async(req,res)=>{
    const result = await getTipoProcesos();
    res.json(result);
}

const obtenerIntegracionesPorTipoProceso= async(req,res)=>{
    const id = req.params.id;
    const result = await getIntegracionesByProceso(id);
    //console.log(result);
    res.json(result);
}

const listarOperacionFase = async (req,res)=>{
    const id = req.params.id;
    const result = await getOperacionFase(id);
    res.json(result);
}

const listarCamposEnviar = async(req,res)=>{
    const tipo_integracion = req.params.tipo_integracion;
    const result = await getCamposByIntegracion(tipo_integracion);
    res.json(result);

}

module.exports = {
    listarTipoProcesos,
    obtenerIntegracionesPorTipoProceso,
    listarCamposEnviar,
    listarOperacionFase
}