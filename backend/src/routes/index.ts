import { Router } from 'express';
import authRoutes from './auth.routes';
import educationRoutes from './education.routes';
import photographyRoutes from './photography.routes';
import videoRoutes from './video.routes';
import hobbyRoutes from './hobby.routes';
import artRoutes from './art.routes';
import petRoutes from './pet.routes';
import bookRoutes from './book.routes';
import achievementRoutes from './achievement.routes';
import commentRoutes from './comment.routes';
import messageRoutes from './message.routes';
import settingsRoutes from './settings.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/education', educationRoutes);
router.use('/photography', photographyRoutes);
router.use('/videos', videoRoutes);
router.use('/art', artRoutes);
router.use('/hobbies', hobbyRoutes);
router.use('/pets', petRoutes);
router.use('/books', bookRoutes);
router.use('/achievements', achievementRoutes);
router.use('/comments', commentRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);

export default router;
