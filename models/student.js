const mongoose = require("mongoose");
const { Schema } = mongoose;

const sutdentSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Student = mongoose.model("Student", sutdentSchema);

module.exports = Student;
