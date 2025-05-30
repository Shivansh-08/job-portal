import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [JobData, setJobData] = useState(null);
  const [isJobUnavailable, setIsJobUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false); // Add applying state
  const[isAlreadyApplied,setIsAlreadyApplied] = useState(false)
  const { jobs, backendUrl, userData, userApplications,fetchUserApplications } = useContext(AppContext);
  const { getToken } = useAuth();

  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);
      if (data.success) {
        if (!data.job.companyId || data.job.companyId.isDeleted) {
          setIsJobUnavailable(true);
          setJobData(null);
        } else {
          setJobData(data.job);
          setIsJobUnavailable(false);
        }
      } else {
        setIsJobUnavailable(true);
        setJobData(null);
        toast.error(data.message);
      }
    } catch (error) {
      setIsJobUnavailable(true);
      setJobData(null);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const applyHandler = async () => {
    try {
      console.log('Apply handler called'); // Debug log
      
      if (!userData) {
        return toast.error('Login to apply for jobs');
      }

      // Fixed: Check if resume is MISSING (not present)
      if (!userData.resume || userData.resume.trim() === '') {
         navigate('/applications')
        return toast.error('Upload resume to apply');
      }

      // Check if already applied
      const alreadyApplied = userApplications?.some(app => app.jobId === id);
      if (alreadyApplied) {
        return toast.error('You have already applied for this job');
      }

      setApplying(true);

      // Get auth token
      const token = await getToken();
      
      // Apply for the job
      const { data } = await axios.post(
        backendUrl + '/api/users/apply',
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Applied successfully!');
        fetchUserApplications()
        // Optionally refresh user applications or update state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast.error(error.response?.data?.message || 'Error applying for job');
    } finally {
      setApplying(false);
    }
  };

  const checkAlreadyApplied = ()=>{
     const hasApplied = userApplications.some(item=> item.jobId._id===JobData._id)

     setIsAlreadyApplied(hasApplied)


  }

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);
  
  useEffect(()=>{
    if(userApplications.length>0 && JobData){
      checkAlreadyApplied()
    }
  },[JobData,userApplications,id])


  const isJobAvailable = JobData && JobData.companyId && !JobData.companyId.isDeleted;

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
        <Footer />
      </>
    );
  }

  return isJobAvailable ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-40 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border-none"
                src={JobData.companyId?.image || '/default-company-logo.png'}
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {JobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId?.name || 'Company Name Not Available'}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button 
                onClick={applyHandler}
                disabled={applying}
                className="bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50"
              >
                {isAlreadyApplied? 'Already Applied' : 'Apply Now'}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>
              <button 
                onClick={applyHandler}
                disabled={applying}
                className="bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer mt-10 hover:bg-blue-700 disabled:opacity-50"
              >
                {isAlreadyApplied? 'Already Applied' : 'Apply Now'}
              </button>
            </div>
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More Jobs from {JobData.companyId?.name || 'This Company'}</h2>
              {JobData.companyId &&
                jobs
                  .filter(
                    (job) =>
                      job.companyId &&
                      job.companyId._id === JobData.companyId._id &&
                      job._id !== JobData._id
                  ).filter(job=>{
                    // set of applied jobs
                    const appliedJobsIds = new Set(userApplications.map(app=>app.jobId && app.jobId._id))

                    //return true if user has not applied
                    return !appliedJobsIds.has(job._id)
                  }
                  )
                  .slice(0, 4)
                  .map((job, index) => <JobCard key={index} job={job} />)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Job Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            This job posting is no longer available. It may have been removed or
            the company account has been deleted.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;