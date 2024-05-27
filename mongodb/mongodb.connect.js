const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect(
            "mongodb+srv://kermoohno:qwertyqwerty@cluster0.hz9iewh.mongodb.net/",
            { useNewUrlParser: true}
        );
    } catch (err) {
        console.error("Error connection to mongodb");
        console.error(err);
    }
}

module.exports = {connect}