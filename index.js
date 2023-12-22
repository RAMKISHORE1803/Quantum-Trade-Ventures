const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:12345@cluster0.sxoweqm.mongodb.net/users-app")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, '0.0.0.0', () => {
            console.log('Server is running on port 3000');
        });        
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

app.use(express.json());
app.use(express.static('public'));

const User = mongoose.model("users", {
    email: String,
    password: String,
});

app.get("/", (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(htmlPath);
});

app.get("/signin", (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'signin.html');
    res.sendFile(htmlPath);
});

app.get("/user", (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'user.html');
    res.sendFile(htmlPath);
});


app.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userExistsResult = await userExists(email, password);
        const userNameExistsResult = await userNameExists(email);

        if (userExistsResult) {
            res.json({ success: 1 });
        } else if (!userNameExistsResult) {
            console.log("Username does not exist");
            res.json({ success: -1 });
        } else {
            res.json({ success: 0 });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ success: 0, message: "Internal server error" });
    }
});

// ...

app.post("/signup", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userNameExistsResult = await userNameExists(email);

        if (userNameExistsResult) {
            res.json({ success: false });
        } else {
            const newUser = new User({
                email: email,
                password: password,
            });
            await newUser.save();
            res.json({ success: true });
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

async function userExists(email, password) {
    try{
        const user = await User.findOne({email: email, password: password});
        if(user){
            return true;
        } else{
            return false;
        }
    }catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
    }
} 
async function userNameExists(email) {
    try{
        const user = await User.findOne({email: email});
        if(user){
            return true;
        } else{
            return false;
        }
    }catch (error) {
        console.error("Error checking username existence:", error);
        throw error;
    }
} 