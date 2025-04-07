import {Request, Response} from "express";

export const assetsIndex = (req: Request, res: Response) => {
    const pageTitle = "Assets";

    res.render("pages/assets/index", {
        title: pageTitle,
    });      
};