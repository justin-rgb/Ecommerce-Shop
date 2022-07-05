import jwt from 'jsonwebtoken';


export const signToken = ( id: number, email: string ) => {

    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    return jwt.sign(
        { id, email }, // payload
        process.env.JWT_SECRET_SEED, // Seed
        { expiresIn: '30d' } // Opciones
    )

}



export const isValidToken = ( token: string ):Promise<number> => {
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    if( token.length <= 10 ){
        return Promise.reject('JWT no es valido')
    }


    return new Promise( (resolve, reject) => {

        try {
            jwt.verify( token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if ( err ) return reject('JWT no es válido');

                const { id } = payload as { id: number };

                resolve(id);

            })
        } catch (error) {
            reject('JWT no es válido');
        }


    })

}