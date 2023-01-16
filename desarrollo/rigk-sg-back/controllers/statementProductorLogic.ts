import { Request, Response } from 'express';
import statementDao from '../dao/statementProductorDao';
import ratesDao from '../dao/ratesDao';

import dateFormat from 'dateformat';

class StatementProductorLogic {
    public async getStatementsByUser(req: any, res: Response) {
        const user = req.uid;
        try {
            const { statements } = await statementDao.getDeclaretionsByUser(user);
            res.status(200).json({
                status: true,
                data: statements,
                msg: ""
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async getStatmentByYear(req: Request, res: Response) {
        const { year, business, draft } = req.params;
        try {
            const statement: any | boolean = await statementDao.getDeclaretionByYear(business, year, parseInt(draft));
            if (statement === false) {
                return res.status(200).json({
                    status: false,
                    data: {},
                    msg: "ID Empresa no válida"
                });
            }
            res.status(200).json({
                status: true,
                data: statement
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async verifyDraft(req: Request, res: Response) {
        const { business, year } = req.params;
        try {
            const haveDraft = await statementDao.haveDraft(business, year);
            res.status(200).json({ status: haveDraft });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async saveForm(req: any, res: Response) {
        try {
            const { header, detail } = req.body;
            header.created_by = req['uid'];
            const { id_header } = await statementDao.saveDeclaretion(header, detail);
            res.status(200).json({
                status: true,
                data: id_header
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async updateStateForm(req: Request, res: Response) {
        const { id, state } = req.params;
        try {
            await statementDao.changeStateHeader(Boolean(state), parseInt(id));
            res.status(200).json({ status: true });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async updateValuesForm(req: Request, res: Response) {
        const { id } = req.params;
        const { detail } = req.body;
        try {
            await statementDao.updateValueStatement(id, detail);
            res.status(200).json({ status: true });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async generatePDF(req: Request, res: Response) {
        const { id, year } = req.params;

        try {
            //table 2
            let pr = 0;
            let pnr = 0;
            let preu = 0;
            let ptt = 0;

            let mer = 0;
            let menr = 0;
            let mereu = 0;
            let mett = 0;

            let plr = 0;
            let plnr = 0;
            let plreu = 0;
            let pltt = 0;

            let mar = 0;
            let manr = 0;
            let mareu = 0;
            let matt = 0;

            let or = 0;
            let onr = 0;
            let oreu = 0;
            let ott = 0;

            let ttr = 0;
            let ttnr = 0;
            let ttreu = 0;
            let tt = 0;

            //table 1
            let ep = 0;
            let pomp = 0;
            let eppomp = 0;

            let eme = 0;
            let pomme = 0;
            let emepomme = 0;

            let epl = 0;
            let pompl = 0;
            let eplpompl = 0;

            let enr = 0;
            let pomnr = 0;

            const rates: any[] = await ratesDao.ratesID(year);
            

            ep = (rates.find(r => r.type == 1))?.price||0;
            eme = (rates.find(r => r.type == 2))?.price||0;
            epl = (rates.find(r => r.type == 3))?.price||0;
            enr = (rates.find(r => r.type == 4))?.price||0;

            const declaretion: any = await statementDao.getDeclaretionByYear(id, year, 0);
            const { detail, header } = declaretion;
            const last_detail: any = await statementDao.getDetailById(id, parseInt(year) - 1);
            const uf: any = await ratesDao.getUF((new Date(header.UPDATED_AT)).toISOString().split("T")[0]);

            let lrp = 0;
            let lrme = 0;
            let lrpl = 0;
            let lnr = 0;

            for (let i = 0; i < last_detail.length; i++) {
                const lde = last_detail[i];
                if (lde.RECYCLABILITY == 1) {
                    switch (lde.TYPE_RESIDUE) {
                        case 1:
                            lrp += lde.VALUE;
                            break;
                        case 2:
                            lrme += lde.VALUE;
                            break;
                        case 3:
                            lrpl += lde.VALUE;
                            break;
                        default:
                            lrp += lde.VALUE;
                            break;
                    }
                }
                if (lde.RECYCLABILITY == 2) {
                    lnr += lde.VALUE;
                }
            }

            for (let i = 0; i < detail.length; i++) {
                const t = detail[i];
                if (t.RECYCLABILITY == 1) {
                    switch (t.TYPE_RESIDUE) {
                        case 1:
                            pr += t.VALUE
                            break;
                        case 2:
                            mer += t.VALUE;
                            break;
                        case 3:
                            plr += t.VALUE;
                            break;
                        case 4:
                            mar += t.VALUE;
                            break;
                        case 5:
                            or += t.VALUE;
                            break;
                        default:
                            pr += t.VALUE;
                            break;
                    }
                }
                if (t.RECYCLABILITY == 2) {
                    switch (t.TYPE_RESIDUE) {
                        case 1:
                            pnr += t.VALUE
                            break;
                        case 2:
                            menr += t.VALUE;
                            break;
                        case 3:
                            plnr += t.VALUE;
                            break;
                        case 4:
                            manr += t.VALUE;
                            break;
                        case 5:
                            onr += t.VALUE;
                            break;
                        default:
                            pnr += t.VALUE;
                            break;
                    }
                }
                if (t.RECYCLABILITY == 3) {
                    switch (t.TYPE_RESIDUE) {
                        case 1:
                            preu += t.VALUE
                            break;
                        case 2:
                            mereu += t.VALUE;
                            break;
                        case 3:
                            plreu += t.VALUE;
                            break;
                        case 4:
                            mareu += t.VALUE;
                            break;
                        case 5:
                            oreu += t.VALUE;
                            break;
                        default:
                            preu += t.VALUE;
                            break;
                    }
                }
            }

            const diff_p  = parseFloat((((pr / lrp) == Infinity ? 0:(pr / lrp)-1)).toFixed(2));
            const diff_me = parseFloat((((mer / lrme) == Infinity ? 0:(mer / lrme)-1)).toFixed(2));
            const diff_pl = parseFloat((((plr / lrpl) == Infinity ? 0:(plr / lrpl)-1)).toFixed(2));
            const diff_nr = parseFloat(((((pnr + menr + plnr) / lnr)==Infinity ? 0:((pnr + menr + plnr) / lnr)-1)).toFixed(2));

            const PizZip = require("pizzip");
            const Docxtemplater = require("docxtemplater");
            const fs = require("fs");
            const path = require("path");

            const content = fs.readFileSync(
                path.resolve('files/templates', "plantillav1.docx"),
                "binary"
            );
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            // const fixed = ((((((ep * pr) * diff_p) || 0) + (ep * pr)) + ((((eme * mer) * diff_me) || 0) + (eme * mer)) + ((((plr * epl) * diff_pl) || 0)) + (plr * epl) + ((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0) + ((pnr + menr + plnr + manr + onr) * enr)) * uf).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            const neto = (((ep * pr) + (eme * mer) + (plr * epl) +((pnr + menr + plnr) * enr)) * uf).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            const fixed = (parseFloat(((((((ep * pr) * diff_p) || 0) + (ep * pr)))+((((eme * mer) * diff_me) || 0) + (eme * mer))+(((((plr * epl) * diff_pl) || 0)) + (plr * epl))+(((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0) + ((pnr + menr + plnr) * enr))) + neto) *uf ).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            // const total = ((((((ep * pr) * diff_p) || 0) + (ep * pr)) + ((((eme * mer) * diff_me) || 0) + (eme * mer)) + ((((plr * epl) * diff_pl) || 0)) + (plr * epl) + ((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0) + ((pnr + menr + plnr + manr + onr) * enr)) * uf * 1.19).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            const total = (parseFloat(((((((ep * pr) * diff_p) || 0) + (ep * pr)))+((((eme * mer) * diff_me) || 0) + (eme * mer))+(((((plr * epl) * diff_pl) || 0)) + (plr * epl))+(((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0) + ((pnr + menr + plnr) * enr))) + neto) *uf*1.19 ).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
            doc.render({
                neto,
                fixed,
                total,
                business_name: header.BUSINESS_NAME,
                year,
                lyear: parseInt(year) - 1,
                date: dateFormat(new Date(), 'dd-mm-yyyy'),
                pr,
                pnr,
                preu,
                ptt: (pr + pnr + preu).toFixed(2).replace(".",","),

                mer,
                menr,
                mereu,
                mett: (mer + menr + mereu).toFixed(2).replace(".",","),

                plr,
                plnr,
                plreu,
                pltt: (plr + plnr + plreu).toFixed(2).replace(".",","),

                mar,
                manr,
                mareu,
                matt: (mar + manr + mareu).toFixed(2).replace(".",","),

                or,
                onr,
                oreu,
                ott: (or + onr + oreu).toFixed(2).replace(".",","),

                ttr: (pr + mer + plr + mar + or).toFixed(2).replace(".",","),
                ttnr: (pnr + menr + plnr + manr + onr).toFixed(2).replace(".",","),
                ttreu: (preu + mereu + plreu + mareu + oreu).toFixed(2).replace(".",","),
                ttotal: ((pr + pnr + preu) + (mer + menr + mereu) + (plr + plnr + plreu) + (mar + manr + mareu) + (or + onr + oreu)).toFixed(2).replace(".",","),

                ep: ep.toString().replace(".",","),
                pomp: (pr).toFixed(2).replace(".",","),
                eppomp: (ep * pr).toFixed(2).replace(".",","),

                eme: eme.toString().replace(".",","),
                pomme: (mer).toFixed(2).replace(".",","),
                emepomme: (eme * mer).toFixed(2).replace(".",","),

                epl: epl.toString().replace(".",","),
                pompl: (plr).toFixed(2).replace(".",","),
                eplpompl: (plr * epl).toFixed(2).replace(".",","),

                enr: enr.toString().replace(".",","),
                pomnr: (pnr + menr + plnr).toFixed(2).replace(".",","),
                enrpomnr: ((pnr + menr + plnr) * enr).toFixed(2).replace(".",","),
                ett: "",
                pmptt: (pr + mer + plr+pnr+menr+plnr).toFixed(2).replace(".",","),
                eppomptt: ((ep * pr) + (eme * mer) + (plr * epl)+((pnr + menr + plnr) * enr)).toFixed(2).replace(".",","),

                dp: (((ep * pr) * diff_p) || 0).toFixed(2).replace(".",","),
                dme: (((eme * mer) * diff_me) || 0).toFixed(2).replace(".",","),
                dpl: ((((plr * epl) * diff_pl) || 0).toFixed(2).replace(".",",")),
                dnr: ((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0).toFixed(2).replace(".",","),
                dtt: (parseFloat((((ep * pr) * diff_p) || 0).toFixed(2)) + parseFloat((((eme * mer) * diff_me) || 0).toFixed(2)) + parseFloat(((((plr * epl) * diff_pl) || 0).toFixed(2))) + parseFloat((((pnr + menr + plnr + manr + onr) * enr) * diff_nr ||0).toFixed(2))).toFixed(2).replace(".",","),

                tp: (((((ep * pr) * diff_p) || 0) + (ep * pr))).toFixed(2).replace(".",","),
                tme: ((((eme * mer) * diff_me) || 0) + (eme * mer)).toFixed(2).replace(".",","),
                tpl: (((((plr * epl) * diff_pl) || 0)) + (plr * epl)).toFixed(2).replace(".",","),
                tnr: (((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0) + ((pnr + menr + plnr) * enr)).toFixed(2).replace(".",","),
                // tt: (((((ep * pr) * diff_p) || 0) + (ep * pr)) + ((((eme * mer) * diff_me) || 0) + (eme * mer)) + ((((plr * epl) * diff_pl) || 0)) + (plr * epl) + ((((pnr + menr + plnr + manr + onr) * enr) * diff_nr) || 0) + ((pnr + menr + plnr + manr + onr) * enr)).toFixed(2).replace(".",",")
                // tt: (((parseFloat((((ep * pr) * diff_p) || 0).toFixed(2)) + (ep * pr)))+(parseFloat((((eme * mer) * diff_p) || 0).toFixed(2)) + (eme * mer))+(parseFloat((((plr * epl) * diff_p) || 0).toFixed(2)) + (plr * epl))+(parseFloat((((pnr + menr + plnr + manr + onr) * enr) * diff_nr ||0).toFixed(2)) + ((pnr + menr + plnr) * enr))).toFixed(2).replace(".",","),
                tt: (parseFloat((parseFloat((((ep * pr) * diff_p) || 0).toFixed(2)) + parseFloat((((eme * mer) * diff_me) || 0).toFixed(2)) + parseFloat(((((plr * epl) * diff_pl) || 0).toFixed(2))) + parseFloat((((pnr + menr + plnr + manr + onr) * enr) * diff_nr ||0).toFixed(2))).toFixed(2)) + parseFloat(((ep * pr) + (eme * mer) + (plr * epl)+((pnr + menr + plnr) * enr)).toFixed(2))).toFixed(2).replace(".",",")

            });
            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });
            fs.writeFileSync(path.resolve('files/templates', `plantilla_${header.ID}.docx`), buf);
            convertWordToPDF(header.ID, res);
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
}
export const convertWordToPDF = async (id: any, res: Response) => {
    const path = require('path');
    const fs = require('fs').promises;
    const fs2 = require('fs');

    const libre = require('libreoffice-convert');
    libre.convertAsync = require('util').promisify(libre.convert);

    const ext = '.pdf'
    const inputPath = path.join(__dirname, `../../files/templates/plantilla_${id}.docx`);
    const outputPath = path.join(__dirname, `../../files/templates/${id}.pdf`);

    const docxBuf = await fs.readFile(inputPath);
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
    fs2.unlinkSync(inputPath);
    await fs.writeFile(outputPath, pdfBuf);
    return res.download(outputPath);
}

const statementProductorLogic = new StatementProductorLogic();
export default statementProductorLogic;