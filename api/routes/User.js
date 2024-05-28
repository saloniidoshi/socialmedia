const {  jsonwebtoken: jwt ,express } = require("../../constants");
const router = express.Router();
const User = require('../models/User');
const UserController = require('../controllers/User');
const authPolicy = require("../middleware/auth");

router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', authPolicy, UserController.logoutUser);



module.exports = router;