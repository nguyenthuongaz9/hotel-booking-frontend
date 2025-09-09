import React, { useState } from 'react';
import Title from './Title';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubscribed(true);
            setIsLoading(false);
            setEmail('');
        }, 1500);
    };

    return (
        <section className="relative overflow-hidden">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Main content card */}
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8 lg:mb-12">
                            <Title 
                                title="Subscribe to Our Newsletter" 
                                subtitle="Stay updated with the latest news, exclusive offers, and insider deals delivered straight to your inbox." 
                            />
                        </div>

                        {/* Subscription Form */}
                        {!isSubscribed ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col lg:flex-row items-stretch gap-4 max-w-2xl mx-auto">
                                    {/* Email Input */}
                                    <div className="relative flex-1">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>

                                    {/* Subscribe Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || !email}
                                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Subscribing...
                                                </>
                                            ) : (
                                                <>
                                                    Subscribe
                                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                    </button>
                                </div>

                                {/* Benefits */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">Exclusive Deals</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">Weekly Updates</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">No Spam</span>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            /* Success State */
                            <div className="text-center space-y-6 max-w-md mx-auto">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                                    <p className="text-gray-300">You've successfully subscribed to our newsletter. Check your inbox for a confirmation email.</p>
                                </div>
                                <button
                                    onClick={() => setIsSubscribed(false)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
                                >
                                    Subscribe another email
                                </button>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-gray-400 text-sm text-center max-w-2xl mx-auto">
                                By subscribing, you agree to our{' '}
                                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline">
                                    Privacy Policy
                                </a>{' '}
                                and consent to receive updates. You can unsubscribe at any time.
                            </p>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-gray-800"></div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full border-2 border-gray-800"></div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-2 border-gray-800"></div>
                                </div>
                                <span className="text-sm">10k+ subscribers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-sm ml-1">Trusted by many</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Newsletter