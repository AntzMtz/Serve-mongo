const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const msySqlstore = require('express-mysql-session');
const metoOver = require('method-override');

// const { database } = require('./keys')
const pasport = require('passport')

//inicializar
const app = express();
require('./database');


//Configuraciones
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(metoOver('_method'));
app.use(session({
    secret: 'AntzMtz',
    resave: false,
    saveUninitialized: false
}));
app.use(morgan('dev'));

//Variables Globales

//rutas
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));
//Publicos

//static files
app.use(express.static(path.join(__dirname, 'public')));
//Start servidor
app.listen(app.get('port'), () => {
    console.log("El servidor corre en el puerto: " + app.get('port'));

})