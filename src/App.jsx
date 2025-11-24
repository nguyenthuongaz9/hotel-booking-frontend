import { Route, Router, Routes, useLocation } from "react-router-dom";
import HotelReg from "./components/admin/HotelReg";
import Navbar from "./components/Navbar";
import AllRooms from "./pages/AllRooms";
import Home from "./pages/Home";
import AddRoom from "./pages/HotelOwner/AddRoom";
import Dashboard from "./pages/HotelOwner/Dashboard";
import Layout from "./pages/HotelOwner/Layout";
import ListRoom from "./pages/HotelOwner/ListRoom";
import MyBooking from "./pages/MyBooking";
import RoomDetail from "./pages/RoomDetail";
import Order from "./pages/Order";
import { Login } from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import UserManagement from "../src/pages/HotelOwner/UserManagement";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import Profile from "./pages/Profile";
import { EditRoom } from "./pages/HotelOwner/EditRoom";
import ReviewPage from "./pages/Review";
function App() {
  const isOwnerPath = useLocation().pathname.includes("owner");
  return (
    <div>
      <AuthProvider>
        {!isOwnerPath && <Navbar />}
        {false && <HotelReg />}
        <div className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBooking />{" "}
                </ProtectedRoute>
              }
            />
<Route
              path="/review/:id"
              element={
                <ProtectedRoute>
                <ReviewPage/>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
            <Route
              path="/owner"
              element={
                <AdminProtectedRoute>
                  <Layout />
                </AdminProtectedRoute>
              }
            >
              <Route
                index
                element={
                    <Dashboard />
                }
              />
              <Route
                path="add-room"
                element={
                    <AddRoom />
                }
              />
              <Route
                path="list-room"
                element={
                    <ListRoom />
                }
              />
              <Route
                path="rooms/edit/:id"
                element={
                    <EditRoom />
                }
              />
              <Route
                path="order"
                element={
                    <Order />
                }
              />
              <Route
                path="user"
                element={
                    <UserManagement />
                }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
      {/* footer*/}
    </div>
  );
}

export default App;
