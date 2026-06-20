import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Allows container names (e.g. 'mongodb') to be injected dynamically
    const host = process.env.MONGO_HOST || 'localhost';
    const defaultUri = `mongodb://${host}:27017/nexusgenome`;
    const connUri = process.env.MONGO_URI || defaultUri;

    console.log(`[DB] Attempting connection to: ${connUri.replace(/\/\/.*@/, '//<credentials>@')}`);

    const conn = await mongoose.connect(connUri);

    console.log(`\x1b[32m[DB] MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[DB] Error during MongoDB connection: ${error.message}\x1b[0m`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
