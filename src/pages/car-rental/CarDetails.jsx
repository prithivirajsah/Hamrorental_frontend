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
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    pickup_location: '',
    return_location: '',
    start_date: '',
    end_date: '',
    note: '',
  });

  const stateCar = location.state?.car || null;

  useEffect(() => {
    const loadVehicle = async () => {
      if (stateCar) {
        return;
      }

      setLoading(true);
      try {
        const matched = await api.getPostById(id);
        if (matched) {
          const normalizedCurrency = !matched.currency || matched.currency === '$' || String(matched.currency).toUpperCase() === 'USD' ? 'Rs.' : matched.currency;
          setVehicleFromApi({
            id: matched.id,
            name: matched.post_title || matched.name,
            price: `${normalizedCurrency} ${matched.price_per_day ?? matched.price ?? 0}`,
            transmission: matched.transmission || matched.category || 'Automatic',
            image: matched.image_urls?.[0] || matched.image_url || matched.image || fallbackImage,
            category: matched.category || 'Vehicle',
            fuel: matched.features?.[0] || matched.fuel || 'PB 95',
            features: Array.isArray(matched.features) ? matched.features : [],
            description: matched.description || '',
            location: matched.location || '',
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

  const onBookingFieldChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookNow = async () => {
    setBookingError('');
    setBookingMessage('');

    if (!bookingForm.pickup_location || !bookingForm.return_location || !bookingForm.start_date || !bookingForm.end_date) {
      setBookingError('Please fill all required booking fields.');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.createBooking({
        post_id: Number(id),
        pickup_location: bookingForm.pickup_location,
        return_location: bookingForm.return_location,
        start_date: bookingForm.start_date,
        end_date: bookingForm.end_date,
        note: bookingForm.note || undefined,
      });

      setBookingMessage(response?.message || 'Booking created successfully.');
      setBookingForm({
        pickup_location: '',
        return_location: '',
        start_date: '',
        end_date: '',
        note: '',
      });
      setShowBookingForm(false);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setBookingError(detail.map((item) => item.msg || String(item)).join(', '));
      } else {
        setBookingError(detail || 'Failed to create booking. Please login and try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

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

                {car.location ? (
                  <p className="text-sm text-gray-500 mb-4">Location: {car.location}</p>
                ) : null}

                {car.description ? (
                  <p className="text-gray-700 mb-6">{car.description}</p>
                ) : null}

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

                <button
                  onClick={() => setShowBookingForm((prev) => !prev)}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-7 rounded-lg transition-colors"
                >
                  {showBookingForm ? 'Hide Booking Form' : 'Book Now'}
                </button>

                {bookingMessage ? (
                  <p className="text-sm text-green-700 mt-4">{bookingMessage}</p>
                ) : null}
                {bookingError ? (
                  <p className="text-sm text-red-600 mt-4">{bookingError}</p>
                ) : null}

                {showBookingForm ? (
                  <div className="mt-6 border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Pickup Location</label>
                      <input
                        value={bookingForm.pickup_location}
                        onChange={(event) => onBookingFieldChange('pickup_location', event.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="e.g. Kathmandu"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Return Location</label>
                      <input
                        value={bookingForm.return_location}
                        onChange={(event) => onBookingFieldChange('return_location', event.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="e.g. Pokhara"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Start Date</label>
                      <input
                        type="date"
                        value={bookingForm.start_date}
                        onChange={(event) => onBookingFieldChange('start_date', event.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">End Date</label>
                      <input
                        type="date"
                        value={bookingForm.end_date}
                        onChange={(event) => onBookingFieldChange('end_date', event.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm text-gray-600">Note (optional)</label>
                      <textarea
                        value={bookingForm.note}
                        onChange={(event) => onBookingFieldChange('note', event.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20"
                        placeholder="Any additional request"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        onClick={handleBookNow}
                        disabled={bookingLoading}
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-60"
                      >
                        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}