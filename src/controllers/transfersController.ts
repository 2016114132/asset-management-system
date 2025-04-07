import {Request, Response} from "express";

export const transfersIndex = (req: Request, res: Response) => {
    const pageTitle = "Transfers";

    res.render("pages/transfers/index", {
        title: pageTitle,
    });      
};