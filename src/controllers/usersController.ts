import {Request, Response} from "express";

export const usersIndex = (req: Request, res: Response) => {
    const pageTitle = "Users";

    res.render("pages/users/index", {
        title: pageTitle,
    });      
};