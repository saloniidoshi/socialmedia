const {  jsonwebtoken: jwt ,express } = require("../../constants");
const router = express.Router();
const User = require('../models/User');
const UserController = require('../controllers/User');

router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);



module.exports = router;