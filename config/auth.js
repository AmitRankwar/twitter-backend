import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path: "../config/.env"
});

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Corrected here
        console.log(token)
        if (!token) {
            return res.status(401).json({
                message: "User is not logged in",
                success: false
            });
        }
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decode.userId;
        req.user = userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
};

export default isAuthenticated;
