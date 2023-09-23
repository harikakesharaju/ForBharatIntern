import  express  from "express";
import { getalluser, login,signup } from "../controllers/user-controller";

const router=express.Router();

router.get("/",getalluser);
router.post("/signup",signup);
router.post("/login",login);
export default router;