import {Request, Response} from "express";

export const requestsIndex = (req: Request, res: Response) => {
    const pageTitle = "Asset Requests";

    res.render("pages/requests/index", {
        title: pageTitle,
    });      
};