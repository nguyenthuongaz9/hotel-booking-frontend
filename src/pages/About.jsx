import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 py-10">Về Chúng Tôi</h1>
            <p className="text-xl opacity-90">
              Khám phá câu chuyện đằng sau dịch vụ đặt phòng khách sạn hàng đầu của chúng tôi
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-gray-600 mb-4 text-lg">
                Chúng tôi cam kết mang đến trải nghiệm đặt phòng khách sạn tuyệt vời nhất cho khách hàng. 
                Với công nghệ hiện đại và đội ngũ chuyên nghiệp, chúng tôi kết nối bạn với những khách sạn 
                chất lượng trên toàn thế giới.
              </p>
              <p className="text-gray-600 text-lg">
                Từ những chuyến công tác đến kỳ nghỉ gia đình, chúng tôi hiểu rằng mỗi chuyến đi đều có 
                một câu chuyện riêng. Sứ mệnh của chúng tôi là biến mỗi câu chuyện đó thành một trải nghiệm đáng nhớ.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">Hình ảnh về khách sạn đối tác</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Dịch Vụ Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Đặt Phòng Dễ Dàng</h3>
              <p className="text-gray-600">
                Quy trình đặt phòng đơn giản, nhanh chóng với giao diện thân thiện người dùng. 
                Chỉ vài cú nhấp chuột, bạn đã có thể sở hữu phòng khách sạn ưng ý.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Bảo Mật Thông Tin</h3>
              <p className="text-gray-600">
                Hệ thống bảo mật tiên tiến đảm bảo thông tin cá nhân và thanh toán của bạn luôn được an toàn. 
                Chúng tôi tuân thủ nghiêm ngặt các tiêu chuẩn bảo mật quốc tế.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Hỗ Trợ 24/7</h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ khách hàng luôn sẵn sàng 24/7 để giải đáp mọi thắc mắc và hỗ trợ bạn 
                trong suốt hành trình đặt phòng và lưu trú.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Khách Sạn Đối Tác</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Khách Hàng Hài Lòng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Thành Phố Trên Toàn Cầu</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Hỗ Trợ Khách Hàng</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Đội Ngũ Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4 flex items-center justify-center text-white text-lg">
                Hình ảnh
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Nguyễn Văn A</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 flex items-center justify-center text-white text-lg">
                Hình ảnh
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Trần Thị B</h3>
              <p className="text-gray-600">CTO</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4 flex items-center justify-center text-white text-lg">
                Hình ảnh
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Lê Văn C</h3>
              <p className="text-gray-600">Head of Marketing</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 flex items-center justify-center text-white text-lg">
                Hình ảnh
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Phạm Thị D</h3>
              <p className="text-gray-600">Customer Success Manager</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sẵn Sàng Đặt Phòng?</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Khám phá hàng ngàn khách sạn chất lượng với giá tốt nhất. Trải nghiệm dịch vụ đặt phòng 
              dễ dàng và tiện lợi ngay hôm nay.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
              Bắt Đầu Đặt Phòng
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;