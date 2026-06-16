import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader } from "./Loader";


const PublicOnlyRoute = ({children})=>{


 const {
   isAuthenticated,
   authChecked
 } = useSelector(
   state=>state.user
 );


 if(!authChecked){
   return <Loader/>
 }



 if(isAuthenticated){
   return <Navigate to="/dashboard" replace/>
 }


 return children;

};


export default PublicOnlyRoute;