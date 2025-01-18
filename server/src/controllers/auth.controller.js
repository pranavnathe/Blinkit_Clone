import jwt from "jsonwebtoken";
import { Customer, DeliveryPartner } from "../models/user.model.js";

const generateToken = (user) => {
    const accessToken = jwt.sign(
        { userID: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
        { userID: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10d" }
    );

    return { accessToken, refreshToken };
};

export const loginCustomer = async (req, res) => {
    try {
        const { phone } = req.body;
        let customer = await Customer.findOne({ phone });

        if (!customer) {
            customer = new Customer({ phone, role: "Customer" });
        }

        await customer.save();

        const { accessToken, refreshToken } = generateToken(customer);

        return res.send({
            message: customer
                ? "Login successful"
                : "Customer created and logged in",
            accessToken,
            refreshToken,
            customer,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error });
    }
};

export const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({ email });

        if (!deliveryPartner) {
            return res
                .status(404)
                .send({ message: "Delivery Partner not found" });
        }

        const isMatch = password === deliveryPartner.password;

        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateToken(deliveryPartner);

        return res.send({
            message: "Login successful",
            accessToken,
            refreshToken,
            deliveryPartner,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res
                .status(403)
                .send({ message: "Access denied, token missing!" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        let user;

        if (decoded.role === "Customer") {
            user = await Customer.findById(decoded.userID);
        } else if (decoded.role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(decoded.userID);
        } else {
            return res.status(403).send({ message: "Invalid token" });
        }

        if (!user) {
            return res.status(404).send({ message: "Invalid refresh token" });
        }

        const { accessToken, refreshToken: newRefreshToken } =
            generateToken(user);

        return res.send({
            message: "Token Refreshed",
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error });
    }
};

export const fetchUser = async (req, res) => {
    try {
        const { userID, role } = req.user;
        let user;

        if (role === "Customer") {
            user = await Customer.findById(userID);
        } else if (role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(userID);
        } else {
            return res.status(403).send({ message: "Invalid Role" });
        }

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.send({ user, message: "User fetched" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Fetch user error", error });
    }
};
