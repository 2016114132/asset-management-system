import {Request, Response} from "express";

export const campusesIndex = (req: Request, res: Response) => {
    const pageTitle = "Campuses";

    res.render("pages/campuses/index", {
        title: pageTitle,
    });      
};