import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading , user} = useAuth();
  console.log("user: ",user)

  if (!user){
    return <Navigate to="/login" replace />;
  }
  
  if(user && user.role !== 'ADMIN'){
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};