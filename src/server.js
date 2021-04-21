import expres from "express";
import listenEndpoints from "express-list-endpoints";
import cors from "cors";
import attendeesRoute from "./Components/attendees/attendeesIndex.js";

const server = express();
const port = process.env.PORT;

const whiteList = [process.env.FE_URL_DEV, process.env.FE_URL_PROD];

const corsOption = {
  origin: (origin, next) => {
    if (whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Not allowed By CORS"));
    }
  },
};

server.use(cors(corsOption));
server.use(express.json());

//ROUTES
server.use("/attendees", attendeesRoute);

console.log(listEndpoints(server));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    // no need to configure it manually on Heroku
    console.log("Server running on cloud on port: ", port);
  } else {
    console.log("Server running locally on port: ", port);
  }
});
