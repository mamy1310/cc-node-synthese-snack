import { prisma } from "../../app.js";

export const productGate = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = await prisma.product.findFirst({
      where: { id, userId: req.auth.userId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    next();
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "Error on checking product ownership");
  }
};
