import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
 
  const allowedTypes = ['image/jpeg', 'image/jpg',  'image/png', 'image/jpg', 'image/webp']

  if(allowedTypes.includes(file.mimetype)){
      cb(null, true)
  }else{
      cb(new Error('Only jpeg, jpg, png and webp images are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024} // 2mb max
})

export default upload;