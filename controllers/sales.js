const Sales = require("../models").sales;
const Product = require('../models').Product;
const { Op, fn, col, literal } = require("sequelize");
const { sequelize } = require('../models')
const puppeteer = require('puppeteer')
require("dotenv").config();

exports.getCreateSales = async (req, res) => {
  try {
    res.render('sales/createSales', {
      user: req.user,
      path: '/createSales',
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.postCreateSales = async (req, res) => {
  try {
    const { product_id, qty } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).send('Product not found')
    }

    const price = product.sellPrice;
    const total = qty*price;

    await Sales.create({
      product_id,
      qty,
      price,
      total
    })

    res.redirect('/sales')
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sales.findAll({
      include: [{
        model: Product,
        as: 'product'
      }]
    });
    // res.status(200).send(sales);
    res.render('sales/sales', {
      user: req.user,
      sales: sales,
      path: '/sales'
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getSalesById = async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await Sales.findByPk(id);

    if (!sales) {
      return res.status(404).send("Sales not found");
    }
    res.status(200).send(sales);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getUpdateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await Sales.findByPk(id);
    console.log('SALES-----------------------------', sales);

    res.render('sales/editSales', {
      path: '/editSales',
      sales
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
}

exports.postUpdateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, qty } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const price = product.sellPrice;
    const total = qty * price;

    const [salesCount] = await Sales.update(
      {
        product_id,
        qty,
        price,
        total
      },
      { where: { id } }
    );

    if (salesCount === 0) {
      return res.status(404).send("Sales not found");
    }
    // res.status(200).send("Sales Updated successfully");
    res.redirect('/sales')
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.deleteSales = async (req, res) => {
  try {
    const { id } = req.params;
    const sales = await Sales.destroy({
      where: { id },
    });

    if (!sales) {
      return res.status(404).send("Sales not found");
    }
    // res.status(200).send("Sales Deleted Successfully");
    res.redirect('/sales')
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD
  if (dateStr.match(regex) === null) {
    return false;
  }
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

exports.getReport = async (req, res) => {
  try {
    res.render('sales/dailySalesReport', {
      path: '/getReport',
    })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
}

exports.generateDailySalesReport = async (req, res) => {
  try {
    const { startDate, endDate, frequency } = req.body;

    // Validate the dates before using them
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).send("Invalid date format");
    }

    let dateFormat;
    switch(frequency) {
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
      case 'yearly':
        dateFormat = '%Y';
        break;
      case 'daily':
      default:
        dateFormat = '%Y-%m-%d';
        break;
    }

    const dailySales = await Sales.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(startDate),
          [Op.lte]: new Date(endDate),
        },
      },
      attributes: [
        [fn("DATE_FORMAT", col("Sales.createdAt"), dateFormat), "date"],
        [fn("SUM", col("Sales.total")), "totalSales"],
        [fn("SUM", col("qty")), "totalQuantity"],
        // [
        //   sequelize.literal(
        //     `SUM("product"."sellPrice" - "product"."buyPrice")`
        //   ),
        //   "totalProfit",
        // ],
      ],
      include: [
        {
          model: sequelize.models.Product,
          as: "product",
          attributes: ["name", "buyPrice", "sellPrice"],
        },
      ],
      group: [
        fn("DATE_FORMAT", col("Sales.createdAt"), dateFormat),
        "product.id",
      ],
      order: [[col("date"), "ASC"]],
    });
    console.log('DAILY SALES--------------------', dailySales);

    // Here you can choose to either send PDF or render a page
    // if (req.query.format === "pdf") {

    let totalProfit = 0;
    dailySales.forEach(sale => {
      const profitPerItem = sale.product.sellPrice - sale.product.buyPrice;
      // const totalQuantity 
      const profit = profitPerItem * sale.dataValues.totalQuantity;
      totalProfit += profit; 
    })

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(`
      <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      <h1>SALESMATE ${frequency} REPORT</h1>
      <h2>Sales Report from ${startDate} to ${endDate}</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product Name</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Total Quantity</th>
            <th>Total Sales</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          ${dailySales
            .map(
              (sale) => `
            <tr>
            <td>${sale.dataValues.date}</td>
            <td>${sale.product.name}</td>
            <td>${sale.product.buyPrice}</td>
            <td>${sale.product.sellPrice}</td>
            <td>${sale.dataValues.totalQuantity}</td>
            <td>${sale.dataValues.totalSales}</td>
            <td>${
              (sale.product.sellPrice - sale.product.buyPrice) *
              sale.dataValues.totalQuantity
            }</td>
          </tr>
          
          `
            )
            .join("")}
            <tr>
              <td colspan="6" style="text-align: right"><strong>Total Profit: </strong></td>
              <td><strong>${totalProfit.toFixed(2)}</strong></td>
            </tr>
        </tbody>
      </table>
   
        `);
        
        const pdf = await page.pdf({ format: "A4" });
        await browser.close();
        
        res.contentType("application/pdf");
        res.send(pdf);
      
    // Uncomment if you wish to render instead of sending PDF
    
  } catch (error) {
    // console.error("Error generating sales report:", error);
    res.status(500).send(error);
  }
};

exports.getSalesVisualize = async (req, res) => {
  try {
    res.render('sales/salesVisualize', {
      path: '/getSalesVisualize',
      user: req.user
    })
  } catch (e) {
    res.status(500).send(e)
    console.log(e);
  }
}

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString))
}

exports.postSalesVisualize = async (req, res) => {
  try {
    const { startDate, endDate, frequency } = req.body;
    // console.log(`DATES---------------${startDate}, ${endDate}, ${frequency}`);

    // Validate the dates before using them
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).send("Invalid date format");
    }

    let dateFormat;
    switch (frequency) {
      case "monthly":
        dateFormat = '%Y-%m';
        // dateTrunc = sequelize.fn(
        //   "DATE_TRUNC",
        //   "month",
        //   sequelize.col("Sales.createdAt")
        // );
        break;
      case "yearly":
        dateFormat = '%Y';
        break;
      case "daily":
      default:
        dateFormat = '%Y-%m-%d';
        break;
    }
    // console.log(dateFormat);

    const dailySales = await Sales.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(startDate),
          [Op.lte]: new Date(endDate),
        },
      },
      attributes: [
        // [dateTrunc, "date"],
        [fn("DATE_FORMAT", col("Sales.createdAt"), dateFormat ), "date"],
        [fn("SUM", col("Sales.total")), "totalSales"],
        [fn("SUM", col("qty")), "totalQuantity"],
      ],
      include: [
        {
          model: sequelize.models.Product,
          as: "product",
          attributes: ["name", "buyPrice", "sellPrice"],
        },
      ],
      // group: [dateTrunc, "product.id"],
      group: [
        [
          fn(
            "DATE_FORMAT",
            col("Sales.createdAt"),
            dateFormat
          ),
        ],
        "product.id",
      ],
      order: [[literal("date"), "ASC"]],
    });
    
    // const plainDailySales = dailySales.map((sale) => sale.get({ plain: true }));
    // Calculate total profit and prepare data for visualization

    const salesData = dailySales.map((sale) => {

      const profitPerItem = sale.product.sellPrice - sale.product.buyPrice;
      const profit = profitPerItem * sale.dataValues.totalQuantity;
      return {
        date: sale.dataValues.date,
        productName: sale.product.name,
        buyPrice: sale.product.buyPrice,
        sellPrice: sale.product.sellPrice,
        totalQuantity: sale.dataValues.totalQuantity,
        totalSales: sale.dataValues.totalSales,
        profit: profit,
      };
    });

    res.json(salesData);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).send(error);
  }
};

exports.productPerformance = async (req, res) => {
  try {
    const salesData = await Sales.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('total')), 'totalSales']
      ],
      group: ['product_id'],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name']
      }]
    });

    const chartData = salesData.map((sale) => ({
      productName: sale.product.name,
      totalSales: sale.dataValues.totalSales,
    }));

    res.render("sales/productPerformance", { 
      path: '/productPerformance',
      chartData 
    });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
}