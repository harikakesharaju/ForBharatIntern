// import express from "express";
// import mongoose from 'mongoose'
// import router from "./routes/user-routes";
// import blogrouter from "./routes/blog-routes";
// import cors from 'cors'cf 
// app.use(cors());

// const app = express();
// app.use(express.json());

// app.use("/api/user",router);
// app.use("/api/blog",blogrouter);
// mongoose.connect('mongodb+srv://admin:GFB5RCgy9UgCasuD@cluster0.hnsujvn.mongodb.net/blob?retryWrites=true&w=majority').
// then(()=>app.listen(5000)).then(()=>console.log("connectde")).catch((e)=>console.log(e));


//GFB5RCgy9UgCasuD



import express from "express";
import mongoose from 'mongoose'
import router from "./routes/user-routes";
import blogrouter from "./routes/blog-routes";
import cors from 'cors'

const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

app.use(express.json());

app.use("/api/user", router);
app.use("/api/blog", blogrouter);

mongoose.connect('mongodb+srv://admin:GFB5RCgy9UgCasuD@cluster0.hnsujvn.mongodb.net/blob?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });
