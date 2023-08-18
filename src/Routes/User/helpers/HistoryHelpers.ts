import { Response } from "express";
import { myRequest } from "../../../types/jwt";
import { History, User } from "../../../database/Sequelize";

export const getHistory = (req:myRequest<{userId? : string},{}> , res:Response)=>{
    const {userId} = req.query
    if(userId === undefined){
        return res.status(401).json({msg : 'l\'id de l\'utilisateur est requis'})
    }
    const id = parseInt(userId)
    User.findByPk(id , {include : History}).then(user => {
        if(user === null){
            return res.status(404).json({msg : 'aucun utilisateur trouve'})
        }
        let tempUser = {...user.toJSON(), id : -1, password : ''}
        return res.json({msg : 'succes', user : tempUser})
    }).catch(err => {
        return res.status(400).json({msg : 'quelque chose a mal tourne : '+err?.message})
    })
}