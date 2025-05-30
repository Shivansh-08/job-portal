import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Loading from "../components/Loading";
import { toast } from 'react-toastify';

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch job applications
  const fetchCompanyJobApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        backendUrl + '/api/company/applicants',
        { headers: { token: companyToken } }
      );

      if (data.success) {
        const applicationsData = data.applications || [];
        setApplicants(applicationsData.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Change application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplications();
        toast.success("Status Changed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  const validApplicants = applicants?.filter(item => item.jobId && item.userId) || [];

  if (loading && applicants === null) {
    return <Loading />;
  }

  if (validApplicants.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">No Applications Found</h2>
          <p className="text-gray-500 mt-2">There are currently no job applications to review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {validApplicants.map((applicant, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-center flex items-center">
                  <img
                    className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                    src={applicant.userId?.image || '/default-avatar.png'}
                    alt="User avatar"
                  />
                  <span>{applicant.userId?.name || 'Unknown User'}</span>
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                  {applicant.jobId?.title || 'Unknown Job'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                  {applicant.jobId?.location || 'Unknown Location'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {applicant.userId?.resume ? (
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex items-center gap-2"
                    >
                      Resume{" "}
                      <img src={assets.resume_download_icon} alt="Download" />
                    </a>
                  ) : (
                    <span className="text-gray-400">No Resume</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 relative">
                  {applicant.status === "Pending" ? (
                    <div className="relative inline-block text-left group">
                      <button className="text-gray-500 action-button cursor-pointer">
                        ...
                      </button>
                      <div
                        className="absolute right-0 md:left-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow 
                        invisible group-hover:visible opacity-0 group-hover:opacity-100 transition 
                        duration-200 z-10"
                      >
                        <button
                          onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}
                          className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>{applicant.status}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
