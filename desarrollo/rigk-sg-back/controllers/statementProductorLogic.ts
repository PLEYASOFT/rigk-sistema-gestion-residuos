import { Request, Response } from 'express';
import statementDao from '../dao/statementProductorDao';
import ratesDao from '../dao/ratesDao';
import dateFormat, { i18n } from 'dateformat';
i18n.dayNames = [
    "Do",
    "Lu",
    "Ma",
    "Mi",
    "Ju",
    "Vi",
    "Sa",
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];
i18n.monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dicc",
    "Enero",
    "Febrero",
    "Marzo",
    "Apbil",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];
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

    public async getDetailByIdHeader(req: Request, res: Response) {
        const { id_header } = req.params;
        try {
            const statement: any | boolean = await statementDao.getDetailByIdHeader(id_header);
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

    public async getAllStatementByYear(req: Request, res: Response) {
        const { year } = req.params;
        try {
            const statement: any | boolean = await statementDao.getAllStatementByYear(year);
            if (statement === false) {
                return res.status(200).json({
                    status: false,
                    data: {},
                    msg: "Año no encontrado"
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
    public async getProductor(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const data = await statementDao.getProductor(id);
            res.status(200).json({ status: true, data });
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
            const user_name = `${header.USER_FIRSTNAME} ${header.USER_LASTNAME}`;
            const date_registered = dateFormat(new Date(header.CREATED_AT), 'dd-mm-yyyy');
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
                path.resolve('files/templates', "plantillav3.docx"),
                "binary"
            );
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            const val1 = lrp == 0 ? "0.00" : (pr - lrp);
            const val2 = lrme == 0 ? "0.00" : (mer - lrme);
            const val3 = lrpl == 0 ? "0.00" : (plr - lrpl);
            const val4 = lnr == 0 ? "0.00" : ((pnr + menr + plnr + onr) - lnr);

            const val11 = (parseFloat(val1.toString()) + pr);
            const val22 = (parseFloat(val2.toString()) + mer);
            const val33 = (parseFloat(val3.toString()) + plr);
            const val44 = (parseFloat(val4.toString()) + (pnr + menr + plnr + onr));
            const eval1 = (parseFloat(val1.toString()) * ep);
            const eval2 = (parseFloat(val2.toString()) * eme);
            const eval3 = (parseFloat(val3.toString()) * epl);
            const eval4 = (parseFloat(val4.toString()) * enr);
            const eval11 = (parseFloat(eval1.toString()) + (ep * pr));
            const eval22 = (parseFloat(eval2.toString()) + (eme * mer));
            const eval33 = (parseFloat(eval3.toString()) + (plr * epl));
            const eval44 = (parseFloat(eval4.toString()) + ((pnr + menr + plnr + onr) * enr));
            const neto = ((parseFloat(eval11.toString()) + parseFloat(eval22.toString()) + parseFloat(eval33.toString()) + parseFloat(eval44.toString())) * uf);
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
                val1: parseFloat(val1.toString()).toFixed(2).replace(".", ","),
                val2: parseFloat(val2.toString()).toFixed(2).replace(".", ","),
                val3: parseFloat(val3.toString()).toFixed(2).replace(".", ","),
                val4: parseFloat(val4.toString()).toFixed(2).replace(".", ","),
                // C4
                val11: parseFloat(val11.toString()).toFixed(2).replace('.', ','),
                val22: parseFloat(val22.toString()).toFixed(2).replace('.', ','),
                val33: parseFloat(val33.toString()).toFixed(2).replace('.', ','),
                val44: parseFloat(val44.toString()).toFixed(2).replace('.', ','),

                valtt: (parseFloat(val11.toString()) + parseFloat(val22.toString()) + parseFloat(val33.toString()) + parseFloat(val44.toString())).toFixed(2).replace(".", ","),
                evaltt1: (pr + mer + plr + (pnr + menr + plnr + onr)).toFixed(2).replace(".", ","),
                evaltt2: ((ep * pr) + (eme * mer) + (plr * epl) + ((pnr + menr + plnr + onr) * enr)).toFixed(2).replace(".", ","),
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
                eval1: eval1.toFixed(2).replace(".", ","),
                eval2: eval2.toFixed(2).replace(".", ","),
                eval3: eval3.toFixed(2).replace(".", ","),
                eval4: eval4.toFixed(2).replace(".", ","),
                // C4
                eval11: eval11.toFixed(2).replace('.', ','),
                eval22: eval22.toFixed(2).replace('.', ','),
                eval33: eval33.toFixed(2).replace('.', ','),
                eval44: eval44.toFixed(2).replace('.', ','),
                evaltt: (parseFloat(eval11.toString()) + parseFloat(eval22.toString()) + parseFloat(eval33.toString()) + parseFloat(eval44.toString())).toFixed(2).replace(".", ","),
                // Resume
                neto: neto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
                iva: iva.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
                total: (neto + iva).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
                // DATA
                date: dateFormat(new Date(), 'dd "de" mmmm yyyy'),
                business_name: header.BUSINESS_NAME,
                year,
                llyear: parseInt(year) + 1,
                lyear: parseInt(year) - 1,
                user_name,
                date_registered
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