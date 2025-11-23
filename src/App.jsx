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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/*  */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Dashboard />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="add-room"
                element={
                  <ProtectedRoute>
                    <AddRoom />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="list-room"
                element={
                  <ProtectedRoute>
                    <ListRoom />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="order"
                element={
                  <ProtectedRoute>
                    <Order />{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="user"
                element={
                  <ProtectedRoute>
                    <UserManagement />{" "}
                  </ProtectedRoute>
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
