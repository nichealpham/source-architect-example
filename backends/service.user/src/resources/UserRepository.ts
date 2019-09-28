import { MongoDb } from "sandrasoft";
import { Schema } from "mongoose";

const UserRepository = MongoDb.connect({
    hostname: "",
    dbname: "",
    username: "",
    password: "",
    modelname: "user",
    schema: new Schema({
        email: {
            type: String,
            unique: true,
            required: true,
            maxlength: 50,
            minlength: 8,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
    
        firstName: String,
        lastName: String,
        avatar: String,
    
        personalInfo: new Schema({
            country: String,
            city: String,
            address: String,
            phone: String,
            postalCode: Number,
        }, { _id: false }),
    
        businessInfo: new Schema({
            companyName: String,
            address: String,
            phone: String,
            occupation: String,
        }, { _id: false }),
    
        accessToken: {
            type: String,
            index: true,
            unique: true,
        },
        createdAt: Date,
    }),
});
export { UserRepository };