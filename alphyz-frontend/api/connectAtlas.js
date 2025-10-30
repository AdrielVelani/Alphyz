import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  try {
    await mongoose.connect(uri);
    res.status(200).json({ message: "Conectado ao MongoDB Atlas com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
