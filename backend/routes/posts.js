const express = require('express');
// 'const multer = require('multer');'
// const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const multerFile = require('../middlewares/file')
const postsController = require('../controllers/posts-controller');

// const MIME_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpg',
//     'image/jpg': 'jpg'
//   }
  
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const isValid = MIME_TYPE_MAP[file.mimetype];
//       let error = new Error("Invalid mime type")
//       if (isValid) {
//         error = null
//       }
//       cb(error, 'backend/images')
//     },
//     filename: (req, file, cb) => {
//       const name = file.originalname.toLowerCase().split(' ').join('-');
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, name + '-' + Date.now() + '.' + ext)
//       // cb(null, uuidv4());
//     }
//   })
  

// router.post('/api/posts', isAuth, multer({storage: storage}).single("image"), postsController.createPost);
router.post('/api/posts', isAuth, multerFile, postsController.createPost);

router.get('/api/posts', postsController.getPosts);

router.delete('/api/post/:postId', isAuth, postsController.deletePost);

router.get('/api/post/:postId', postsController.findPost);

// router.put('/api/edit/:postId', isAuth, multer({storage: storage}).single("image"), postsController.updatePost);
router.put('/api/edit/:postId', isAuth, multerFile, postsController.updatePost);


module.exports = router;
