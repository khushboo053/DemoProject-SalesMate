const Category = require("../models").Category;
require("dotenv").config();

exports.getCreateCategory = async (req, res) => {
  try {
    res.render('categories/createCategory', {
      path: '/createCategory'
    })
  } catch (e) {
    res.status(500).send(e)    
    console.log(e);
  }
}

exports.postCreateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({
      name,
    });

    // res.status(200).send(category);
    res.redirect('/categories');
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const category = await Category.findAll({});
    console.log(category);

    // res.status(200).send(categories);
    res.render("categories/category", {
      path: "/categories",
      categories: category,
      user: req.user
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getCatgeoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.status(200).send(category);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id)

    res.render('categories/editCategory', {
      path: '/editCategory',
      category
    })
  } catch (e) {
    res.status(500).send(e)
    console.log(e);
  }
}

exports.postUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const [categoryCount] = await Category.update(
      {
        name,
      },
      { where: { id } }
    );

    if (categoryCount === 0) {
        return res.status(404).send('Category not found')
    }
    // res.status(200).send('Category Updated successfully')
    res.redirect("/categories");

  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.deleteCategory = async (req, res) => {
    try {
       const { id } = req.params;
       const category = await Category.destroy({
        where: { id }
       }) 

       if (!category) {
        return res.status(404).send('Category not found')
       }
      //  res.status(200).send('Category Deleted Successfully')
      res.redirect('/categories')
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}