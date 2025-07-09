import app from "./app";

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`User Service listening on port ${port}`));
