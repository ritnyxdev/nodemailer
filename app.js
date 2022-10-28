const config = require("config");
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const PORT = config.get("port");
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
async function run(req, res) {
    try {
        app.listen(PORT, () => {
            console.log(`Server http://localhost:3000/ da run bo'ldi!`);
        });
    } catch (err) {
        console.log(err);
    }
}
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.get("user"),
        pass: config.get("password"),
    },
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.post("/send", (req, res) => {
    const data = req.body;
    const mailOptions = {
        from: config.get("user"),
        to: data.email,
        subject: data.subject,
        text: data.textarea,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
    res.sendFile(__dirname + "/views/ok.html")
});

run();
