import {Request, Response} from "express";

export const employeesIndex = (req: Request, res: Response) => {
    const pageTitle = "Employees";

    res.render("pages/employees/index", {
        title: pageTitle,
    });      
};