import {Request, Response} from "express";

export const categoriesIndex = (req: Request, res: Response) => {
    const pageTitle = "Categories";

    res.render("pages/categories/index", {
        title: pageTitle,
    });      
};