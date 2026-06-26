import { body } from "express-validator";

export const productRules = [
  body("name")
    .isString()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 3, max: 40 })
    .withMessage("Name must be between 3 and 40 characters long"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be an integer greater than or equal to 0")
    .toInt(),
];
