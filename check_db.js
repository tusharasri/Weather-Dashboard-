require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:");
    for (const collection of collections) {
      console.log(`\n--- Collection: ${collection.name} ---`);
      const documents = await mongoose.connection.db
        .collection(collection.name)
        .find()
        .limit(5)
        .toArray();
      console.log(JSON.stringify(documents, null, 2));
    }

    await mongoose.disconnect();
    console.log("Disconnected from Database");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();
