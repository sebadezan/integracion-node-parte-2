var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuarios-model');
var md5 = require('md5');  

router.get('/', function (req, res, next) {
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(); 
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

router.post('/', async (req, res, next) => {
    try {
        var usuario = req.body.usuario;
        var contraseña = req.body.password;

        if (!usuario || !contraseña) {
            console.error('Usuario o contraseña no enviados');
            return res.render('admin/login', {
                layout: 'admin/layout',
                error: 'Usuario o contraseña no enviados'
            });
        }

        console.log('Datos del formulario:', req.body);

        var contraseñaCifrada = md5(contraseña);

        var data = await usuariosModel.getUserAndPassword(usuario, contraseñaCifrada);

        if (data) {
            req.session.id_usuario = data.id;
            req.session.nombre = data.usuario;
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/login', {
                layout: 'admin/layout',
                error: 'Usuario o contraseña incorrectos'
            });
        }
    } catch (error) {
        console.error('Error en la consulta de usuario:', error);
        res.render('admin/login', {
            layout: 'admin/layout',
            error: 'Error al realizar la consulta'
        });
    }
});

module.exports = router;
