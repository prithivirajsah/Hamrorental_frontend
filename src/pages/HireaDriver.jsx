import Header from '../components/Header'
import Footer from '../components/Footer'

export default function HireaDriver() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Hire a Professional Driver</h1>
        <p className="text-lg text-gray-600 mb-8">
          Get experienced and licensed drivers for your transportation needs. Our professional drivers ensure your safety and comfort throughout your journey.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Driver Services */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Our Driver Services</h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">City Tours</h3>
              <p className="text-gray-600 mb-4">Explore the city with our knowledgeable local drivers who know all the best routes and attractions.</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-indigo-600">Rs. 1,500/day</span>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Long Distance Travel</h3>
              <p className="text-gray-600 mb-4">Safe and comfortable long-distance travel with experienced drivers for intercity journeys.</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-indigo-600">Rs. 2,000/day</span>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Book a Driver</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>City Tour</option>
                  <option>Long Distance Travel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <input type="text" placeholder="Enter pickup address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input type="text" placeholder="Enter destination address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                Book Driver
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
