const Supplier = require("../models").Supplier;
require("dotenv").config();

exports.postCreateSupplier = async (req, res) => {
  try {
    const { supplierName, email, location, contactDetails } = req.body;
    const supplier = await Supplier.create({
      supplierName,
      email,
      location,
      contactDetails,
    });

    res.status(200).send(supplier);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({});
    res.status(200).send(suppliers);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send(supplier);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.postUpdateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierName, email, location, contactDetails } = req.body;

    const [supplierCount] = await Supplier.update(
      {
        supplierName,
        email,
        location,
        contactDetails,
      },
      { where: { id } }
    );

    if (supplierCount === 0) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send("Supplier Updated successfully");
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

exports.postDeleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.destroy({
      where: { id },
    });

    if (!supplier) {
      return res.status(404).send("Supplier not found");
    }
    res.status(200).send("Supplier Deleted Successfully");
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};