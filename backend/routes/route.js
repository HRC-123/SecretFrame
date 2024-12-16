import express from 'express';
import { Encode ,Decode,Destroy,mailReciever,mailRecieverSecret} from '../controllers/controller.js';
import multer from "multer";

// Set up storage engine (you can customize this)
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/encode',upload.single('image'),Encode);
router.post("/mailReciever",upload.single('image'), mailReciever);
router.post("/mailRecieverSecret",upload.none(),mailRecieverSecret);
router.post("/decode", upload.single("image"), Decode);
router.post('/destroy',Destroy);


export default router;