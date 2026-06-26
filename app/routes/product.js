import { Router } from "express";
import auth from "../middlewares/auth.js";
import { productGate } from "../middlewares/productGate.js";
import { productRules } from "../validators/product.js";
import { validate } from "../middlewares/validate.js";
import {
  index,
  create,
  update,
  remove,
} from "../controllers/product.js";

const router = Router();

router.get("/", auth, index);
router.post("/", auth, productRules, validate, create);
router.put("/:id", auth, productGate, productRules, validate, update);
router.delete("/:id", auth, productGate, remove);

export default router;
