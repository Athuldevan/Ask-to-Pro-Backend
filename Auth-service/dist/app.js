import express from "express";
import cookiParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
const app = express();
app.use(express.json());
app.use(cookiParser());
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use("/api/v1/auth", authRouter);
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500 || 404;
    err.status = err.status || "error";
    err.data = err.data || null;
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
});
export default app;
//# sourceMappingURL=app.js.map