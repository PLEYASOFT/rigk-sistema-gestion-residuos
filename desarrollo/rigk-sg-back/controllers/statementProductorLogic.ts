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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
            res.status(500).json({
                status: false,
                msg: "Algo salió mal"
            });
        }
    }
    public async generatePDF(req: Request, res: Response) {
        const { id, year } = req.params;
        try {
            //table 1
            let pr = 0;
            let pnr = 0;
            let mer = 0;
            let menr = 0;
            let plr = 0;
            let plnr = 0;
            let onr = 0;
            //table 2
            let ep = 0;
            let eme = 0;
            let epl = 0;
            let enr = 0;
            const rates: any[] = await ratesDao.ratesID(year);
            ep = (rates.find(r => r.type == 1))?.price || 0;
            eme = (rates.find(r => r.type == 2))?.price || 0;
            epl = (rates.find(r => r.type == 3))?.price || 0;
            enr = (rates.find(r => r.type == 4))?.price || 0;
            const declaretion: any = await statementDao.getDeclaretionByYear(id, year, 0);
            const { detail, header } = declaretion;
            const last_detail: any = await statementDao.getDetailById(id, (parseInt(year) - 1));
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
                            break;
                    }
                }
                if (lde.RECYCLABILITY == 2) {
                    switch (lde.TYPE_RESIDUE) {
                        case 1:
                            lnr += lde.VALUE;
                            break;
                        case 2:
                            lnr += lde.VALUE;
                            break;
                        case 3:
                            lnr += lde.VALUE;
                            break;
                        case 5:
                            lnr += lde.VALUE;
                            break;
                        default:
                            break;
                    }
                }
            }
            for (let i = 0; i < detail.length; i++) {
                const t = detail[i];
                if (t.RECYCLABILITY == 1) {
                    switch (t.TYPE_RESIDUE) {
                        case 1:
                            pr += t.VALUE;
                            break;
                        case 2:
                            mer += t.VALUE;
                            break;
                        case 3:
                            plr += t.VALUE;
                            break;
                        default:
                            break;
                    }
                }
                if (t.RECYCLABILITY == 2) {
                    switch (t.TYPE_RESIDUE) {
                        case 1:
                            pnr += t.VALUE;
                            break;
                        case 2:
                            menr += t.VALUE;
                            break;
                        case 3:
                            plnr += t.VALUE;
                            break;
                        case 5:
                            onr += t.VALUE;
                            break;
                        default:
                            break;
                    }
                }
            }
            const PizZip = require("pizzip");
            const Docxtemplater = require("docxtemplater");
            const fs = require("fs");
            const path = require("path");
            const content = fs.readFileSync(
                path.resolve('files/templates', "plantillav2.docx"),
                "binary"
            );
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            const val1 = lrp == 0 ? "0.00" : (pr - lrp).toFixed(2);
            const val2 = lrme == 0 ? "0.00" : (mer - lrme).toFixed(2);
            const val3 = lrpl == 0 ? "0.00" : (plr - lrpl).toFixed(2);
            const val4 = lnr == 0 ? "0.00" : ((pnr + menr + plnr + onr) - lnr).toFixed(2);
            const val11 = (parseFloat(val1) + pr).toFixed(2);
            const val22 = (parseFloat(val2) + mer).toFixed(2);
            const val33 = (parseFloat(val3) + plr).toFixed(2);
            const val44 = (parseFloat(val4) + (pnr + menr + plnr + onr)).toFixed(2);
            const eval1 = (parseFloat(val1) * ep).toFixed(2);
            const eval2 = (parseFloat(val2) * eme).toFixed(2);
            const eval3 = (parseFloat(val3) * epl).toFixed(2);
            const eval4 = (parseFloat(val4) * enr).toFixed(2);
            const eval11 = (parseFloat(eval1) + (ep * pr)).toFixed(2);
            const eval22 = (parseFloat(eval2) + (eme * mer)).toFixed(2);
            const eval33 = (parseFloat(eval3) + (plr * epl)).toFixed(2);
            const eval44 = (parseFloat(eval4) + ((pnr + menr + plnr + onr) * enr)).toFixed(2);
            const neto = ((parseFloat(eval11) + parseFloat(eval22) + parseFloat(eval33) + parseFloat(eval44)) * uf);
            const iva = neto * 0.19;
            doc.render({
                // Table 1
                // C1
                lrp: lrp.toFixed(2).replace(".", ","),
                lrme: lrme.toFixed(2).replace(".", ","),
                lrpl: lrpl.toFixed(2).replace(".", ","),
                lnr: lnr.toFixed(2).replace(".", ","),
                // C2
                pr: pr.toFixed(2).replace(".", ","),
                mer: mer.toFixed(2).replace(".", ","),
                plr: plr.toFixed(2).replace(".", ","),
                pomnr: (pnr + menr + plnr + onr).toFixed(2).replace(".", ","),
                // C3
                val1: val1.replace(".", ","),
                val2: val2.replace(".", ","),
                val3: val3.replace(".", ","),
                val4: val4.replace(".", ","),
                // C4
                val11: val11.replace('.', ','),
                val22: val22.replace('.', ','),
                val33: val33.replace('.', ','),
                val44: val44.replace('.', ','),
                valtt: (parseFloat(val11) + parseFloat(val22) + parseFloat(val33) + parseFloat(val44)).toFixed(2).replace(".", ","),
                // ----
                // Table 2
                // C1
                ep: ep.toString().replace(".", ","),
                eme: eme.toString().replace(".", ","),
                epl: epl.toString().replace(".", ","),
                enr: enr.toString().replace(".", ","),
                //C2
                eppomp: (ep * pr).toFixed(2).replace(".", ","),
                emepomme: (eme * mer).toFixed(2).replace(".", ","),
                eplpompl: (plr * epl).toFixed(2).replace(".", ","),
                enrpomnr: ((pnr + menr + plnr + onr) * enr).toFixed(2).replace(".", ","),
                // C3
                eval1: eval1.replace(".", ","),
                eval2: eval2.replace(".", ","),
                eval3: eval3.replace(".", ","),
                eval4: eval4.replace(".", ","),
                // C4
                eval11: eval11.replace('.', ','),
                eval22: eval22.replace('.', ','),
                eval33: eval33.replace('.', ','),
                eval44: eval44.replace('.', ','),
                evaltt: (parseFloat(eval11) + parseFloat(eval22) + parseFloat(eval33) + parseFloat(eval44)).toFixed(2).replace(".", ","),
                // Resume
                neto: neto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
                iva: iva.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
                total: (neto + iva).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
                // DATA
                date: dateFormat(new Date(), 'dd-mm-yyyy'),
                business_name: header.BUSINESS_NAME,
                year,
                llyear: parseInt(year) + 1,
                lyear: parseInt(year) - 1
            });
            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });
            fs.writeFileSync(path.resolve('files/templates', `plantilla_${header.ID}.docx`), buf);
            convertWordToPDF(header.ID, res);
        } catch (error) {
            console.log("error pos " + error);
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
    const ext = '.pdf';
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