import mongoose from "mongoose";

const Connection = async (URL) => {
    try {
        await mongoose.connect(URL);
        console.log("Sir, we are successfully connected to the database");

    } catch (error) {
        console.log("Sir, there was a error in connecting to database !!!", error);
    }
}

export default Connection;