import React from 'react'
import { HiCalendar, HiCurrencyDollar, HiStar, HiUserGroup } from 'react-icons/hi'
import Title from '../../components/Title'

const Dashboard = () => {
  const statsData = [
    {
      title: 'Total Bookings',
      value: '30',
      icon: <HiCalendar className="text-3xl text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Revenue',
      value: '$2,450',
      icon: <HiCurrencyDollar className="text-3xl text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      title: 'Active Guests',
      value: '12',
      icon: <HiUserGroup className="text-3xl text-purple-500" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      title: 'Average Rating',
      value: '4.7',
      icon: <HiStar className="text-3xl text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700'
    }
  ]

  return (
    <div className="p-6">
      <Title
        align='left'
        font='outfit'
        title='Dashboard'
        subtitle='Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.'
      />

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8'>
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex-shrink-0">
              {stat.icon}
            </div>
            <div className='ml-4'>
              <p className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</p>
              <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(item => (
              <div key={item} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">Room {item}01</p>
                  <p className="text-sm text-gray-500">John Doe • Aug 20, 2023</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Confirmed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard