import mongoose from "mongoose";

export async function connectToMongo(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log("✅ Conectado ao MongoDB com sucesso");
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB", err);
    process.exit(1);
  }
}
