import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Applications = () => {
      const navigate = useNavigate()

      const {user} = useUser()
      const {getToken} = useAuth()

    const[isEdit,setisEdit]=useState(false);
    const [resume,setResume] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const {backendUrl, userData,userApplications,fetchUserData,fetchUserApplications} = useContext(AppContext)

    const updateResume = async()=>{
       try {
         setIsUploadingResume(true);
         toast.info('Uploading resume...', {
           toastId: 'upload-progress',
           autoClose: false
         });

         const formData = new FormData()
         formData.append('resume',resume)
         const token = await getToken()
         const {data} = await axios.post(backendUrl+'/api/users/update-resume',
          formData,
          {headers:{Authorization:`Bearer ${token}`}}
         )

         // Dismiss the uploading toast
         toast.dismiss('upload-progress');

         if(data.success){
          toast.success(data.message)
          await fetchUserData()
         }else{
          toast.error(data.message)
         }
       } catch (error) {
        // Dismiss the uploading toast
        toast.dismiss('upload-progress');
        toast.error(error.message)
        
       }

       setIsUploadingResume(false);
       setisEdit(false)
       setResume(null)
    }

    // Modified useEffect to handle new users gracefully
    useEffect(()=>{
      if(user){
        // Check if user just signed up (you can modify this logic based on your user object)
        const userCreatedRecently = user.createdAt && 
          new Date() - new Date(user.createdAt) < 60000; // Less than 1 minute ago
        
        if(userCreatedRecently) {
          setIsNewUser(true);
          
          // Temporarily suppress toast errors for new users
          const originalToastError = toast.error;
          toast.error = (message) => {
            // Suppress specific error messages for new users
            if (message && (
              message.includes('No user found') || 
              message.includes('User not found') ||
              message.includes('No jobs found') ||
              message.includes('No applications found')
            )) {
              console.log('Suppressed error for new user:', message);
              return;
            }
            originalToastError(message);
          };
          
          // Restore original toast.error after 5 seconds
          setTimeout(() => {
            toast.error = originalToastError;
          }, 5000);
        }

        fetchUserData();
        fetchUserApplications();
      }
    },[user])


  return (
    <>
     <Navbar />
     <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10 '>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
           {
            isEdit || (userData && userData.resume === "")
            ?<>
             <label className='flex items-center' htmlFor="resumeUpload">
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 cursor-pointer'>{ resume ? resume.name :"Select resume"}</p>
                <input id='resumeUpload' onChange={e=>setResume(e.target.files[0])} accept='application/pdf' type="file" hidden  />
                <img className='cursor-pointer'src={assets.profile_upload_icon} alt=""/>
                <button 
                  onClick={updateResume}
                  disabled={isUploadingResume || !resume}
                  className={`ml-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                    isUploadingResume || !resume
                      ? 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 border border-green-400 text-green-600 hover:bg-green-200'
                  } flex items-center gap-2`}
                >
                  {isUploadingResume ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
             </label>
            </>
            :<div className='flex gap-2'>
              <a target='_blank' className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href={userData?.resume}>
                Resume
              </a>
              <button onClick={()=>setisEdit(true)} className='cursor-pointer text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>Edit</button>
            </div>
           } 
        </div>
        
        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
        
        {/* Check if userApplications exists and has length */}
        {userApplications && userApplications.length > 0 ? (
          <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b border-gray-200 text-left'>Company</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left'>Job Title</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b border-gray-200 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((job, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b border-gray-200'>
                    <img className='w-8 h-8' src={job.companyId?.image} alt="" />
                    {job.companyId?.name}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200'>{job.jobId?.title}</td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{job.jobId?.location}</td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b border-gray-200'>
                    <span className={`${job.status === 'Accepted' ? 'bg-green-100 text-green-900' : job.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'} px-4 py-1.5 rounded`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Empty state when no applications
          <div className='bg-white border border-gray-200 rounded-lg p-8 text-center'>
            <div className='mb-4'>
              <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {isNewUser ? 'Welcome! Ready to Start Your Job Search?' : 'No Applications Yet'}
            </h3>
            <p className='text-gray-500 mb-4'>
              {isNewUser 
                ? 'Great to have you here! Browse through our job listings and start applying to find your perfect match.'
                : 'You haven\'t applied to any jobs yet. Start browsing and applying to find your dream job!'
              }
            </p>
            <button onClick={()=>navigate('/')}className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
              Browse Jobs
            </button>
          </div>
        )}
        
      </div>
      <Footer />
    </>
  );
};

export default Applications;