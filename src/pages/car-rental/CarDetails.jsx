import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Gauge, Users, Wind, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../api';

const fallbackImage =
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=450&fit=crop&auto=format';

export default function CarDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [vehicleFromApi, setVehicleFromApi] = useState(null);
  const [loading, setLoading] = useState(false);

  const stateCar = location.state?.car || null;

  useEffect(() => {
    const loadVehicle = async () => {
      if (stateCar) {
        return;
      }

      setLoading(true);
      try {
        const result = await api.getVehicles();
        const vehicles = Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result)
            ? result
            : [];

        const matched = vehicles.find((vehicle) => String(vehicle.id) === String(id));
        if (matched) {
          setVehicleFromApi({
            id: matched.id,
            name: matched.name,
            price: `${matched.currency || 'Rs.'} ${matched.price_per_day ?? matched.price ?? 0}`,
            transmission: matched.transmission || matched.category || 'Automatic',
            image: matched.image_url || matched.image || fallbackImage,
            category: matched.category || 'Vehicle',
            fuel: matched.fuel || 'PB 95',
          });
        }
      } catch (error) {
        console.error('Failed to load vehicle details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id, stateCar]);

  const car = useMemo(() => {
    if (stateCar) {
      return {
        ...stateCar,
        image: stateCar.image || fallbackImage,
        category: stateCar.category || 'Vehicle',
        fuel: stateCar.fuel || 'PB 95',
      };
    }
    return vehicleFromApi;
  }, [stateCar, vehicleFromApi]);

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to vehicles
        </Link>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100">Loading vehicle details...</div>
        ) : !car ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            Vehicle not found.
          </div>
        ) : (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
              <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                <img src={car.image} alt={car.name} className="w-full max-h-80 object-contain" />
              </div>

              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-2">{car.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{car.name}</h1>
                <p className="text-2xl font-bold text-indigo-600 mb-6">{car.price} <span className="text-sm text-gray-500 font-normal">per day</span></p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Gauge className="w-4 h-4" />
                      Transmission
                    </div>
                    <p className="font-semibold text-gray-900">{car.transmission || 'Automatic'}</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Users className="w-4 h-4" />
                      Fuel
                    </div>
                    <p className="font-semibold text-gray-900">{car.fuel || 'PB 95'}</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Wind className="w-4 h-4" />
                      Comfort
                    </div>
                    <p className="font-semibold text-gray-900">Air Conditioner</p>
                  </div>
                </div>

                <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-7 rounded-lg transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}