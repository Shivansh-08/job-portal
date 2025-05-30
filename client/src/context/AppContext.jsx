import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser,useAuth } from "@clerk/clerk-react";

const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const {user} =useUser()
    const {getToken}=useAuth()
    
    const [searchFilter, setSearchFilter] = useState({
        title: " ",
        location: " "
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
    const [companyToken, setCompanyToken] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [userData,setUserData]= useState(null);
    const [userApplications,setUserApplications]=useState([])

    // Function to fetch job data
    const fetchJobs = async () => {
        try {
            const {data} =await axios.get(backendUrl+'/api/jobs')

            if(data.success){
                setJobs(data.jobs)
                console.log(data.jobs)
            }else{
                console.log("fetchJobs - API returned error:", data.message);
                toast.error(data.message)
            }
        } catch (error) {
             console.log("fetchJobs - Axios error:", error.message);
             toast.error(error.message)
        }
       
    };

    // Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company', {
                headers: { token: companyToken }
            });

            if (data.success) {
                setCompanyData(data.company);
            } else {
                console.log("fetchCompanyData - API returned error:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.log("fetchCompanyData - Axios error:", error.message);
            toast.error(error.message);
        }
    };
    
    const fetchUserData=async()=>{
        try {
             const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/users/user',
            {headers:{Authorization:`Bearer ${token}`}} )
            
            if(data.success){
                setUserData(data.user)
            }else{
                console.log("fetchUserData - API returned error:", data.message);
                // Don't show error toast for "user not found" messages (common for new users)
                if (!data.message.toLowerCase().includes('user not found') && 
                    !data.message.toLowerCase().includes('no user found')) {
                    toast.error(data.message)
                }
            }
        
        } catch (error) {
            console.log("fetchUserData - Axios error:", error.message);
            // Don't show error toast for 404 errors (user not found - common for new users)
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || error.message)
            }
            
        }
      }

      //function to fetch user applied jobs

      const fetchUserApplications = async()=>{
        try {
            const token= await getToken()

            const {data} = await axios.get(backendUrl + '/api/users/applications',
                {headers:{Authorization:`Bearer ${token}`}}
            )

            if(data.success){
                setUserApplications(data.applications)
            }else{
                console.log("fetchUserApplications - API returned error:", data.message);
                // Don't show error toast for "no jobs found" or "no applications found" messages (common for new users)
                if (!data.message.includes('No Job Applications found for this user')){
                    toast.error(data.message)
                    
                    
                }
            }
        } catch (error) {
            console.log("fetchUserApplications - Axios error:", error.message);
            // Don't show error toast for 404 errors (no applications found - common for new users)
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || error.message)
            }
            
        }
      }

      
    
    useEffect(() => {
        fetchJobs();

        const storedCompanyToken = localStorage.getItem('companyToken');

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken);
        }
    }, []);

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
            // Note: 'data' variable doesn't exist here - removed console.log
        }
    }, [companyToken]);


    useEffect(()=>{
        if(user){
            // Add a small delay for new users to prevent race conditions
            const userCreatedRecently = user.createdAt && 
                new Date() - new Date(user.createdAt) < 300000; // Less than 5 minutes ago
            
            if (userCreatedRecently) {
                // Small delay for new users
                setTimeout(() => {
                    fetchUserData()
                    fetchUserApplications()
                }, 1000);
            } else {
                // Immediate fetch for existing users
                fetchUserData()
                fetchUserApplications()
            }
        }
    },[user] )

   

    const value = {
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
        jobs,
        setJobs,
        showRecruiterLogin,
        setShowRecruiterLogin,
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        backendUrl,
        userData,
        setUserData,
        userApplications,
        setUserApplications,
        fetchUserData,
        fetchUserApplications
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

// Export both as named exports to keep existing imports working
export { AppContext, AppContextProvider };