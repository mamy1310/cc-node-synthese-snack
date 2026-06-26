import { prisma } from "../../app.js";

const productLinks = (product) => ({
  ...product,
  _links: {
    self: { href: `/api/products/${product.id}`, method: "GET" },
    update: { href: `/api/products/${product.id}`, method: "PUT" },
    delete: { href: `/api/products/${product.id}`, method: "DELETE" },
  },
});

export const index = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.auth.userId },
      orderBy: { id: "asc" },
    });
    return res.status(200).json(products.map(productLinks));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "Error on fetching products");
  }
};

export const create = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const product = await prisma.product.create({
      data: { name, quantity, userId: req.auth.userId },
    });
    return res.status(201).json(productLinks(product));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "Error on creating product");
  }
};

export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, quantity } = req.body;
    const product = await prisma.product.update({
      where: { id, userId: req.auth.userId },
      data: { name, quantity },
    });
    return res.status(200).json(productLinks(product));
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(error.status || 500)
      .json(error.message || "Error on updating product");
  }
};

export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id, userId: req.auth.userId } });
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(error.status || 500)
      .json(error.message || "Error on deleting product");
  }
};
