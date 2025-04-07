import {Request, Response} from "express";

export const reportsIndex = (req: Request, res: Response) => {
    const pageTitle = "Reports";

    res.render("pages/reports/index", {
        title: pageTitle,
    });      
};