import { Request, Response } from "express";
import { ClassRepository } from "../repositories/ClassRepository";

const classRepo = new ClassRepository();

export class ClassController {
    static async getAllClasses(req: Request, res: Response) {
        try {
            const classes = await classRepo.findAll();
            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar classes" });
        }
    }

    static async createClass(req: Request, res: Response) {
        const { name } = req.body;

        try {
            const classeExistente = await classRepo.findByName(name);

            if (classeExistente) {
                return res.status(400).json({ error: "Classe já existe" });
            }

            const id = await classRepo.create({ name });
            res.status(201).json({ id })
        } catch (error) {
            res.status(400).json({ error: "Classe já existe ou dado invalido" });
        }
    }
}