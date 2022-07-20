const Router = require('express');
const {
        listarNotificaciones , 
        recibirCompletadas,
        validarBusqueda
      } = require ('../controllers/integrador')

      const router = new Router();

router.post('/listarNotificaciones',listarNotificaciones)

router.post('/recibir',recibirCompletadas)

router.post('/busqueda',validarBusqueda)



module.exports = router;

