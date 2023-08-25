import joi from "joi"
import bcrypt from "bcrypt"
import User from "../models/users.js";
import getAuthToken from "../utils/getAuthToken.js";

export const register = async (req,res) => {
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().min(3).max(200).required().email(),
        password: joi.string().min(6).max(1024).required(),
        confirmPassword: joi.string().valid(joi.ref('password')).required().strict()
    });

    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const {name, email,  password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);
    if(password !== confirmPassword) return res.status(400).send("password doesnt match");

    const existingUser = await User.findOne({email})
    if(existingUser) return res.status(400).send("User with this email already exists");

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name : name,
            email : email,
            password :hashedPassword,
        });

        await user.save();
        const token = getAuthToken(user);
        res.send(token);
    } catch (error) {
        console.error("Error registering the user", error);
        res.status(400).send("Internal Server Error");
    }
}

export const login = async (req,res) => {
    const schema = joi.object({
        email: joi.string().min(3).max(200).required().email(),
        password: joi.string().min(6).max(1024).required(),
    });

    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const {email, password} = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser) return res.status(400).send("User with this email Does not exist please register First");

    const checkPassword = await bcrypt.compare(password,existingUser.password);
    if(!checkPassword) return res.status(400).send("Envalid Email or The Password");

    const token = getAuthToken(existingUser);
    res.send(token);
}