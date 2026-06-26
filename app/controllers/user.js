import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "node:util";
import { prisma } from "../../app.js";

const signAsync = promisify(jwt.sign);

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash } });
    return res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already in use" });
    }
    return res
      .status(error.status || 500)
      .json(error.message || "Error on signup");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = await signAsync(
      { userId: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    return res.status(200).json({ token, userId: user.id });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(error.message || "Error on login");
  }
};
