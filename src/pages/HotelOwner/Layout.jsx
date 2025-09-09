import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/admin/Navbar'
import SideBar from '../../components/admin/SideBar'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className='flex h-full'>
        <SideBar />
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout