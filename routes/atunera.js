const Router = require('express');
const {listarTipoProcesos , obtenerIntegracionesPorTipoProceso,listarCamposEnviar,listarOperacionFase} = require ('../controllers/atunera')
const router = new Router();

router.get('/listarTipoProcesos',listarTipoProcesos)

router.get('/listarIntegracionesByProceso/:id',obtenerIntegracionesPorTipoProceso)

router.get('/listarOperacionFase/:id',listarOperacionFase);


module.exports = router;

