import { Request, Response } from "express";
import establishmentDao from '../dao/establishmentDao';


class EstablishmentLogic {
    
    async addEstablishment(req: Request, res: Response) {
        const name = req.body.name;
        const region = req.body.region;
        
        try{   
            const result = await establishmentDao.addEstablishment(name,region);
            res.status(200).json({status:true, msg:'Has creado un establecimiento', data: {}})
            }
        catch(err){
            console.log(err)
            res.status(500).json({status:false, msg:'Ocurrió un error', data: {}});
        }
    }

    async getAllEstablishment(req: any, res: Response) {

        try {
            const establishment = await establishmentDao.getAllEstablishment();
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
    
    async deleteEstablishment(req: any, res: Response) {

        const id = req.params.id;
        try {
            const establishment = await establishmentDao.deleteEstablishment(id);
            res.status(200).json({ status: establishment, data: {}, msg: '' });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Algo salió mal"
            });
        }
    }
}

const establishmentLogic = new EstablishmentLogic();
export default establishmentLogic;