const express = require('express'); //importando a variavel
const cors = require('./routes');
const routes = require('./routes');
var bodyParser = require('body-parser');
const app= express ();

app.use(bodyParser.json());
app.use(cors);
app.use(express.json());
app.use(routes);

// Rotas / recursos

/* Métodos HTTP:

GET: Buscar/listar uma informação do back-end
POST: Criar uma informação no back-end
PUT: Alterar uma informação no back-end
DELETE: Deletar uma informação no back-end

*/

/*Tipos de parâmetros:

Query: Parâmetros nomeados enviados na rota após ? (filtros, paginação)
Routes Params: Parâmetros utilizados para identificar recusos
Request Body: Corpo da requisição, utilizado para criar ou alterar recursos

*/
/* Driver: SELECT * FROM users
Query Builder: table('users').select('*').where()
*/


app.listen(3333);