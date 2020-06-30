const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count(); //contar o total de registro

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id') 
        .limit(50)
        .offset((page - 1) * 5 ) //vai pular os 5 primeiros registro
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async find(request, response) {
        const { id } = request.params;

        const [count] = await connection('incidents').count().where('id', id); //contar o total de registros

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id') 
        .where('incidents.id', id)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]);

        if (count['count(*)'] == '0') {
            
        return response.status(200).json({ error: 'Incident not found!'})
         } 
         
        else      
            return response.json(incidents);
    },

    
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;
        // request.headers; - Guarda dados do usuario, tudo que caracteriza a autenticação
        
        const [id] = await connection('incidents').insert ({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },
    async delete(request, response){
        const  {id} = request.params;
        const ong_id = request.headers.authorization;
        const [count] = await connection('incidents').count().where('id', id);

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (count['count(*)'] == '0') {
            return response.status(200).json({ success: 'Incident not found!'})
        } 

        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.'})
        }

        await connection('incidents').where('id', id).delete();    

        return response.status(200).json({ success: 'Incident deleted!'});
        
    }
};