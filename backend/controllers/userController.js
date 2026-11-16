const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
async function registerUser(req, res) {
    try {
        const { userName, email, password } = req.body;

        // Check required fields
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Check whether the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
}


// Login an existing user
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                userName:user.userName,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}

// Get all registered users
async function getUsers(req, res) {
    try {
        const users = await User.find()
            .select("userName email role createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users retrieved successfully",
            totalUsers: users.length,
            users
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve users",
            error: error.message
        });
    }
}



module.exports = {
    registerUser,
    loginUser,
    getUsers
};