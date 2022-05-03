const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../middleware/login');
const produtoController = require('../controllers/produtosController')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req,file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
  
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
       cb(null, true)
    }else{
     cb(null, false)
    }
}

const upload = multer({ 
    storage: storage, 
limits:{
    fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter

})


router.get('/', produtoController.getProdutos);
router.post('/', User.login, upload.single('imagem'), produtoController.postProdutos);
router.get('/:id_produto', produtoController.ByIdProdutos);
router.patch('/', User.login, upload.single('imagem'),produtoController.patchProdutos);
router.delete('/', User.login, produtoController.deleteProdutos);

module.exports = router;