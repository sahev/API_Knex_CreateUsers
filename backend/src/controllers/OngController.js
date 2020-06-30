const crypto = require('crypto');
const connection = require('../database/connection');


module.exports = {
    async index (request, response) {
    const ongs = await connection('ongs').select('*'); //selecionar todas as informações da tabela


    return response.json(ongs);
    },
    
    async create(request, response) {
        

    const {name, email, whatsapp, city, uf } = request.body;



    const id = crypto.randomBytes(4).toString('HEX'); //Vai gerar 4b de caracteres aleatórios

    await connection('ongs').insert({ //inserir informações na tabela
        id,
        name,
        email,
        whatsapp,
        city,
        uf
    }); 
   
    return response.json({ id });
    },

    async delete(request, response){
        const  {id} = request.params;
        //const ong_id = request.headers.authorization;
        const [count] = await connection('ongs').count().where('id', id);

        const incident = await connection('ongs')
            .where('id', id)
            .select('name')
            .first();
            

        if (count['count(*)'] == '0') {
            return response.status(200).json({ success: 'Incident not found!'})
        } 

    

        await connection('ongs').where('id', id).delete();    

        return response.status(200).json({ success: 'Incident deleted!'});
        
    }
    
};