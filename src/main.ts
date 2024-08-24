import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import FileUpload from "express-fileupload";
import { errorMiddleware } from "./middleware/error.middleware";

import userRouter from "./route/user.route";
import productRouter from "./route/product.route";
import cartRouter from "./route/cart.route";
import transactionRouter from "./route/transaction.route";
import { setupSwagger } from "./util/swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static("./public"));
app.use(FileUpload());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/transactions", transactionRouter);

app.use(errorMiddleware);

setupSwagger(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on  http://localhost:${process.env.PORT}`);
});
