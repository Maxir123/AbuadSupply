// createAdmin.js
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri = "mongodb://localhost:27017";
const dbName = "test";
const collectionName = "admins";

const adminData = {
  name: "Super Admin",
  email: "admin@abuadsupply.com",
  password: "YourAdminPassword123",
  role: "admin",
};

(async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const admins = db.collection(collectionName);

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Use upsert to avoid duplicate key error
    const result = await admins.updateOne(
      { email: adminData.email }, // filter
      {
        $setOnInsert: {
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
          role: adminData.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true } // insert if not exists
    );

    if (result.upsertedCount > 0) {
      console.log("Admin created successfully with ID:", result.upsertedId._id);
    } else {
      console.log("Admin already exists, no changes made.");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await client.close();
  }
})();