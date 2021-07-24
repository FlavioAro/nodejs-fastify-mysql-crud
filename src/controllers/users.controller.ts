import { Users } from "../entity/Users"
import { getRepository } from "typeorm"

export const validator = {
    schema: {
        body: {
            type: 'object',
            required: ['userid' ,'username', 'email', 'name', 'hasNotification'],
            properties: {
                userid: { type: 'number' },
                username: { type: 'string' },
                email: { type: 'string' },
                name: { 
                    type: 'object',
                    required: ['firstname', 'lastname'],
                    properties: {
                        firstname: { type: 'string' },
                        lastname: { type: 'string' }
                    }
                },
                hasNotification: { type: 'boolean' }
            }
        }
    }
}

export const index = async (req: any, reply: any) => {
    const users = await getRepository(Users).find({ where:{ disabled: false, hidden: false }})
    return users ? reply.code(200).send(users) : reply.code(400).send(new Error('Nenhum usuário não encontrado'))
}

export const show = async (req: any, reply: any) => {
    const user = await getRepository(Users).findOne({ where:{ userid: req.params.userid, disabled: false, hidden: false }})
    return user ? reply.code(200).send(user) : reply.code(400).send(new Error('Usuário não encontrado'))
}

export const store = async (req: any, reply: any) => {
    const validate = await getRepository(Users).findOne({userid: req.body.userid})
    if(validate) {
        reply.code(400).send(new Error('Já existe um usuário cadastrado com o userid: '+req.body.userid))
    }else {
        const user = await getRepository(Users)
        .insert([
            { 
                userid: req.body.userid, 
                username: req.body.username,
                email: req.body.email,
                name: req.body.name,
                hasNotification: req.body.hasNotification,
                disabled: req.body.disabled,
                hidden: req.body.hidden
            }
        ])
    
        return user.raw[0].id ? reply.code(200).send({message: "Usuário cadastrado com sucesso"}) : reply.code(400).send(new Error('Erro ao cadastrar usuário'))
    }
}

export const update = async (req: any, reply: any) => {
    const update = await getRepository(Users).update({userid: req.params.userid}, 
            {
                username: req.body.username, 
                email: req.body.email,
                name: req.body.name,
                hasNotification: req.body.hasNotification,
                disabled: req.body.disabled,
                hidden: req.body.hidden
            })

    return update.affected ? reply.code(200).send({message: "Dados atualizados com sucesso"}) : reply.code(400).send(new Error('Usuário não encontrado'))
    
}

export const destroy = async (req: any, reply: any) => {
    const destroy = await getRepository(Users).delete({userid: req.params.userid})

    return destroy.affected ? reply.code(200).send({message: "Usuário apagado com sucesso"}) : reply.code(400).send(new Error('Usuário não encontrado'))
}