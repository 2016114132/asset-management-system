import {Request, Response} from "express";

export const rolesIndex = (req: Request, res: Response) => {
    const pageTitle = "Roles";

    res.render("pages/roles/index", {
        title: pageTitle,
    });      
};