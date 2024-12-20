import express from 'express';
import { Encode ,Decode,Destroy,mailReciever,mailRecieverSecret,UsersCount} from '../controllers/controller.js';
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/encode',upload.single('image'),Encode);
router.post("/mailReciever",upload.single('image'), mailReciever);
router.post("/mailRecieverSecret",upload.none(),mailRecieverSecret);
router.post("/decode", upload.single("image"), Decode);
router.post("/destroy", upload.single("image"), Destroy);
router.get('/count', UsersCount);

export default router;