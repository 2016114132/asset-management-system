import {Request, Response} from "express";

export const dashboardIndex = (req: Request, res: Response) => {
    const pageTitle = "Dashboard";

    res.render("pages/dashboard/index", {
        title: pageTitle,
    });      
};

