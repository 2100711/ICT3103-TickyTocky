import { UserModel } from "../models/Users.js";

// TODO: This function should be deleted, only use register from auth.js
const createUser = async (req, res) => {
    console.log("creating user..", req.body);
    const { f_name, l_name, password, email } = req.body;
    try {
        // do mongo processing thing before returning

        const doc = await UserModel.create({
            email: email,
            f_name: f_name,
            l_name: l_name,
            encrypted_password: password,
        });

        console.log(doc instanceof UserModel);
        console.log("created user", doc.email);

        res.status(200).json({
            message: `hi ${f_name} ${l_name}`,
            email: doc.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const doc = await UserModel.find({});

        // console.log("get all users", doc);

        // res.status(200).json({
        //   message: `hi ${doc[0].f_name} ${doc[0].l_name}`,
        //   email: doc[0].email,
        // });
        const emails = doc.map((item) => item.email);
        res.status(200).json({
            success: true,
            message: "get all users",
            emails: emails,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

const getAllUsersEmails = async (req, res) => {
    try {
        const doc = await UserModel.find({}).select('email');
        const emails = doc.map(doc => doc.email);
        console.log(emails);

        // res.status(200).json({
        //   message: `hi ${doc[0].f_name} ${doc[0].l_name}`,
        //   email: doc[0].email,
        // });
        return doc;
        res.status(200).json({
            success: true,
            message: "get all users",
            emails: emails,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
};


const getUser = async (req, res) => {
    try {
        const { email } = req.params;

        console.log(email);

        const doc = await UserModel.findOne({ email: email });

        console.log("get one user", doc);

        res.status(200).json({
            user: doc,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

// TODO: This function should only be available to the user that owns the account
const updateUser = async (req, res) => {
    console.log("updating user..", req.body);
    // to figure out which items to allow in update
    const { f_name, l_name, password, email } = req.body;
    try {
        // do mongo processing thing before returning

        const query = { email: email };
        const doc = await UserModel.findOneAndUpdate(
            query, {
                $set: { fname: fname, lname: lname },
            }, {
                new: true,
            }
        );

        console.log("updated user", doc);

        res.status(200).json({
            message: doc,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

const deleteUser = async (req, res) => {
    console.log("deleting user..", req.body);
    const { email } = req.body;
    try {
        const doc = await UserModel.deleteOne({ email: email });
        console.log("deleted user", doc);

        res.status(200).json({
            message: "deleted!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

export { createUser, getAllUsersEmails, getUser, updateUser, deleteUser };