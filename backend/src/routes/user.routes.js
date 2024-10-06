import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser} from "../controllers/user.controller.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/register', (req, res, next) => {
    console.log('Register route hit');
    next();
}, registerUser);

router.post('/login', loginUser);

// Secured routes
router.post('/logout', verifyJWT, logoutUser);

router.route("/current-user").get(verifyJWT, getCurrentUser)



export default router