import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../app.js";

const data = {
  users: [
    { id: 1, email: "jean@snack-etoile.fr", password_clair: "password123" },
    { id: 2, email: "marie@snack-soleil.fr", password_clair: "password123" },
  ],
  products: [
    { id: 1, name: "Portion de frites", quantity: 25, userId: 1 },
    { id: 2, name: "Coca-Cola", quantity: 48, userId: 1 },
    { id: 3, name: "Sprite", quantity: 30, userId: 1 },
    { id: 4, name: "Chips", quantity: 50, userId: 2 },
    { id: 5, name: "Glace vanille", quantity: 15, userId: 2 },
    { id: 6, name: "Glace fraise", quantity: 20, userId: 2 },
  ],
};

const seed = async () => {
  try {
    const { users, products } = data;

    for (const user of users) {
      const hash = await bcrypt.hash(user.password_clair, 10);
      await prisma.user.upsert({
        where: { email: user.email },
        update: { password: hash },
        create: { id: user.id, email: user.email, password: hash },
      });
    }

    for (const product of products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          quantity: product.quantity,
          userId: product.userId,
        },
        create: {
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          userId: product.userId,
        },
      });
    }

    console.log(
      `Seed completed: ${users.length} users, ${products.length} products`
    );
    await prisma.$disconnect();
  } catch (error) {
    console.error(error.message || "Error on seeding database");
    await prisma.$disconnect();
    process.exit(1);
  }
};

seed();
