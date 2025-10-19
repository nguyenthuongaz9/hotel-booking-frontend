import { Route, Routes, useLocation } from "react-router-dom"
import HotelReg from "./components/admin/HotelReg"
import Navbar from "./components/Navbar"
import AllRooms from "./pages/AllRooms"
import Home from "./pages/Home"
import AddRoom from "./pages/HotelOwner/AddRoom"
import Dashboard from "./pages/HotelOwner/Dashboard"
import Layout from "./pages/HotelOwner/Layout"
import ListRoom from "./pages/HotelOwner/ListRoom"
import MyBooking from "./pages/MyBooking"
import RoomDetail from "./pages/RoomDetail"
import Order from "./pages/Order"
function App() {
  const isOwnerPath = useLocation().pathname.includes('owner')
  return (
    <div>
      {!isOwnerPath && <Navbar />}
      {false && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/my-bookings" element={<MyBooking />} />

          {/*  */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="order" element={<Order />} />
          </Route>
        </Routes>
      </div>
      {/* footer*/}
    </div>
  )
}

export default App
