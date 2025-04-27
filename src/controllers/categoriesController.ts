import { Request, Response } from 'express';
import { Category } from '../models/Category';

const title = 'Categories';

export const categoriesIndex = async (req: Request, res: Response) => {
    try {
      const categories = await Category.getAll();
  
      res.render('pages/categories/index', {
        title: 'Categories',
        categories: categories
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading categories.');
    }
  };

  export const categoriesCreateForm = (req: Request, res: Response) => {
    res.render('pages/categories/create', {
      title
    });
  };
  
  export const categoriesCreate = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
  
      if (!name || name.trim() === '') {
        req.flash('error', 'Name is required');
        return res.redirect(req.get('Referrer') || '/categories/create');
      }
      
      // Create an instance of the model
      const category = new Category({
        name, 
        description
      });

      // Save the instance
      const saved = await category.save();

      if(!saved){
        (req as any).flash('error', 'Unable to save category');
        return res.redirect(req.get('Referrer') || '/categories/create');
      }       

      req.flash('success', 'Category created successfully');
      res.redirect('/categories');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Error creating category.');
      res.redirect(req.get('Referrer') || '/categories/create');
    }
  };
  
  export const categoriesEditForm = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await Category.findById(id);
      if (!category) {
        req.flash('error', 'Category not found');
        return res.redirect('/categories');
      }
  
      res.render('pages/categories/edit', {
        category,
        title
      });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Error loading category.');
      res.redirect('/categories');
    }
  };
  
  export const categoriesUpdate = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, description } = req.body;
  
      if (!name || name.trim() === '') {
        req.flash('error', 'Name is required');
        return res.redirect(req.get('Referrer') || `/categories/edit/${id}`);
      }

      // Create an instance of the model
      const category = new Category({
        id,
        name, 
        description
      });

      // Save the instance
      const saved = await category.save();

      if(!saved){
        (req as any).flash('error', 'Unable to updated category');
        res.redirect(req.get('Referrer') || `/categories/edit/${req.params.id}`);
      }  

      req.flash('success', 'Category updated successfully');
      res.redirect('/categories');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Error updating category.');
      res.redirect(req.get('Referrer') || `/categories/edit/${req.params.id}`);
    }
  };
  
  export const categoriesDelete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
  
      const inUse = await Category.hasAssets(id);
      if (inUse) {
        req.flash('error', 'Cannot delete category: Assets are still assigned to it.');
        return res.redirect('/categories');
      }
  
      await Category.delete(id);
      req.flash('success', 'Category deleted successfully');
      res.redirect('/categories');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Error deleting category.');
      res.redirect('/categories');
    }
  };