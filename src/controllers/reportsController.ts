import { Request, Response } from 'express';
import { Reports } from '../models/Reports';

export const reportsIndex = (req: Request, res: Response) => {
  res.render('pages/reports/index', { title: 'Reports' });
};

export const generateReport = async (req: Request, res: Response) => {
  const { reportType, fromDate, toDate } = req.body;

  try {
    const data = await Reports.generate(reportType, fromDate, toDate);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error generating report.' });
  }
};
