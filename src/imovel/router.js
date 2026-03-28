import express from "express";
import ImovelController from "./controller.js";

const router = express.Router();

router.post("/imoveis", (req, res) => ImovelController.createImovel(req, res));
router.get("/imoveis/:id", (req, res) => ImovelController.findImovelById(req, res));
router.get("/imoveis", (req, res) => ImovelController.findAllImovel(req, res));
router.get("/imoveis/proximos", (req, res) => ImovelController.getImoveisProximos(req, res));

export default router;