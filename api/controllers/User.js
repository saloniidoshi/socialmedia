const User = require("../models/User");
const { validator, jsonwebtoken: jwt, JWT_SECRET, bcrypt, SALT_ROUNDS } = require("../../constants");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// Function to validate password using regex
const validatePassword = (password) => {
    return validator.matches(password, passwordRegex);
};
const createUser = async (req, res) => {
    try {
        const { username, email, password, number, bio } = req.body;
        // Validate input fields
        if (!username || !email || !password || !number) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email format"
            });
        }
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ status: 400, message: "Password must be at least 8 characters long" });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({
                status: 400,
                message: "Password must contain at least one letter, one number, and one special character"
            });
        }
        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ status: 400, message: "Username already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        // Create new user object
        const newUser = new User({ username, email, password: hashedPassword, number, bio });
        // Save new user to the database
        await newUser.save();
        res.status(201).json({ status: 200, message: "User created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal server error", error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const findUser = await User.findOne({ username: username, isDeleted: false })
            if (findUser) {
                const passwordMatch = await bcrypt.compare(password, findUser.password);
                if (passwordMatch) {
                    const token = jwt.sign({ id: findUser._id, username: findUser.username }, JWT_SECRET, { expiresIn: '1h' });
                    const updatedUser = await User.findByIdAndUpdate(findUser._id, { $set: { authToken: token, loginTime: new Date() } });
                    res.status(200).json({
                        status: 200,
                        data: updatedUser,
                        message: "Logged in successfully"
                    });
                } else {
                    return res.status(400).json({
                        status: 400,
                        message: "Password is incorrect"
                    });
                }
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "User not found"
                });
            }
        } else {
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal server error", error: err.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        const userId = req.me.id
        if (userId) {
            const findUser = await User.findOne({ _id: userId, isDeleted: false })
            if (findUser) {
                const updatedUser = await User.findByIdAndUpdate(findUser._id, { $set: { authToken: null, loginTime: null } });
                res.status(200).json({
                    status: 200,
                    message: "Logged out successfully"
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "User not found"
                });
            }
        } else {
            return res.status(400).json({
                status: 400,
                message: "UserId not found"
            })
        }
    } catch (error) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal server error", error: err.message });
    }
}
module.exports = {
    createUser,
    loginUser,
    logoutUser
};
