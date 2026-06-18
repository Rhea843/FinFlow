import express from 'express'
import {getProfile, updateProfile, uploadProfilePic} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import upload from'../middleware/uploadMiddlewar.js';

const router = express.Router()

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/profile-pic', protect, upload.single('profilePic'), uploadProfilePic)

export default router;