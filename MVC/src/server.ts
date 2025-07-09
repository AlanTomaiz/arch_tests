import app from "./app";
import { connectToMongo } from "./config/database";

async function start() {
  await connectToMongo(process.env.MONGO_URI!);

  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`🚀 User Service rodando na porta ${port}`)
  );
}

start();
