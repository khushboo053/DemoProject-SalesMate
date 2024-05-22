const Product = require('../models').Product;
const User = require('../models').User;
const Category = require('../models').Category;
const Sales = require('../models').sales
const { sequelize } = require('../models')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({});

        res.render('users/users', {
            path: '/users',
            users: users
        })
    } catch (e) {
        res.status(500).send('Internal Server Error')
        console.log(e);
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id)

        if(!user) {
            return res.status(404).send('User not found')
        }

        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e)
        console.log(e);
    }
}

exports.getUpdateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);

        res.render('users/editUser', {
            path: '/editUser',
            user
        })
    } catch (e) {
        res.status(500).send(e)
        console.log(e);
    }
}

exports.postUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, role } = req.body;

        const [updatedCount] = await User.update({
            firstName, lastName, email, role
        }, { where: { id } })

        if (updatedCount === 0) {
            return res.status(404).send('User not found');
        }

        // res.status(200).send('User updated successfully')
        res.redirect('/users')
    } catch (e) {
        res.status(500).send("Internal Server Error");
        console.log(e);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.destroy({
            where: { id }
        })
        
        if (!user) {
            return res.status(404).send('User not found')
        }
        // res.status(200).send('User Deleted Successfully')
        res.redirect('/users')
    } catch (e) {
        res.status(500).send(e)
        console.log(e);
    }
}

exports.getHome = async (req, res) => {
    try {
        res.render('users/home', {
            path: '/'
        })
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

exports.dashboard = async (req, res) => {
    try {
        const productCount = await Product.count();
        const userCount = await User.count();
        const categoryCount = await Category.count();
        const salesTotal = await Sales.sum('total') || 0;

        const highestSellingProducts = await Sales.findAll({
            attributes: ['product_id', [sequelize.fn('sum', sequelize.col('Sales.total')), 'TotalSales']],
            include: [{ model: Product, as: 'product', attributes: ['name'] }],
            group: ['product_id'],
            order: [[sequelize.fn('sum', sequelize.col('Sales.total')), 'DESC']],
            limit: 5
        });
        console.log(highestSellingProducts);

        const latestSales = await Sales.findAll({
            include: [{model: Product, as: 'product', attributes: ['name']}],
            limit: 5,
            order: [['createdAt', 'DESC']]
        })

        const recentlyAddedProducts = await Product.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{model: Category, as: 'category', attributes: ['name']}]
        })

        res.render('users/dashboard', {
            productCount: productCount,
            userCount: userCount,
            categoryCount: categoryCount,
            salesTotal: salesTotal,
            highestSellingProducts,
            latestSales,
            recentlyAddedProducts,
            path: '/dashboard'
        })
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

exports.adminDashboard = async (req, res) => {
  try {
    const productCount = await Product.count();
    const userCount = await User.count();
    const categoryCount = await Category.count();
    const salesTotal = (await Sales.sum("total")) || 0;

    const highestSellingProducts = await Sales.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("sum", sequelize.col("Sales.total")), "TotalSales"],
      ],
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      group: ["product_id"],
      order: [[sequelize.fn("sum", sequelize.col("Sales.total")), "DESC"]],
      limit: 5,
    });
    console.log(highestSellingProducts);

    const latestSales = await Sales.findAll({
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const recentlyAddedProducts = await Product.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });

    res.render("users/adminDashboard", {
      productCount: productCount,
      userCount: userCount,
      categoryCount: categoryCount,
      salesTotal: salesTotal,
      highestSellingProducts,
      latestSales,
      recentlyAddedProducts,
      path: "/admin/dashboard",
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.supplierDashboard = async (req, res) => {
  try {
    const productCount = await Product.count();
    const userCount = await User.count();
    const categoryCount = await Category.count();
    const salesTotal = (await Sales.sum("total")) || 0;

    const highestSellingProducts = await Sales.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("sum", sequelize.col("Sales.total")), "TotalSales"],
      ],
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      group: ["product_id"],
      order: [[sequelize.fn("sum", sequelize.col("Sales.total")), "DESC"]],
      limit: 5,
    });
    console.log(highestSellingProducts);

    const latestSales = await Sales.findAll({
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const recentlyAddedProducts = await Product.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category, as: "category", attributes: ["name"] }],
    });

    res.render("users/supplierDashboard", {
      productCount: productCount,
      userCount: userCount,
      categoryCount: categoryCount,
      salesTotal: salesTotal,
      highestSellingProducts,
      latestSales,
      recentlyAddedProducts,
      path: "/supplier/dashboard",
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};