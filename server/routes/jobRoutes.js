import express from 'express'
import { getJobById, getJobs } from '../controllers/jobController.js';

const router = express.Router();

//routes to get all job data
router.get('/',getJobs)

// routes to get a single job by id

router.get('/:id',getJobById)

export default router