import express from 'express';
import { getCompanyData, loginCompany, postJob, registerCompany,getCompanyJobsApplicants,getCompanyPostedJobs,changeJobApplicationStatus,changeVisibility} from '../controllers/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

//register a new company

router.post('/register',upload.single('image'),registerCompany);

//company login
router.post('/login',loginCompany);

//get company data
router.get('/company',protectCompany, getCompanyData)

//post a new job
router.post('/post-job',protectCompany,postJob);

//get company jobs applicants data
router.get('/applicants',protectCompany, getCompanyJobsApplicants);

//get company job list
router.get('/list-jobs', protectCompany,getCompanyPostedJobs);

//change job application status
router.post('/change-status',protectCompany, changeJobApplicationStatus);

//change job visibility
router.post('/change-visibility', protectCompany,changeVisibility);






export default router;