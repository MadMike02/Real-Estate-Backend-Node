require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const os = require("os");
const cluster = require("cluster");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const PORT = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

const app = express();

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MDB connected"))
  .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes Middleware
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// Handling Server Clusters
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    // Create child nodes based on number of cores available in the CPU
    cluster.fork();
  }

  // In case a any Node fails/dies, create/fork a new Node
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  // Run the server on PORT
  app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));
}
