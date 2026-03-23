import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Gauge, Users, Wind, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../api';
import config from '../../config/config';
import { RatingDisplay, RatingInput } from '../../components/ui/rating';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const fallbackImage =
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=450&fit=crop&auto=format';

function toAbsoluteImage(url) {
  if (!url) return fallbackImage;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBaseUrl = config.API_BASE_URL;
  return `${apiBaseUrl}${url}`;
}

function parseImages(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return [];

    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
    }

    return [raw];
  }

  return [];
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function getRangeDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;
  return Math.max(1, diff);
}

function formatDateForToast(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB');
}

export default function CarDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicleFromApi, setVehicleFromApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const bookingRequestInFlightRef = useRef(false);
  const [reviewEligibilityLoading, setReviewEligibilityLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    pickup_location: '',
    return_location: '',
    start_date: '',
    end_date: '',
    note: '',
  });

  const handleSubmitReview = async () => {
    if (!userRating) {
      toast.error('Please select a rating before submitting.');
      return;
    }

    if (!user?.id) {
      toast.error('Please login to submit a review.');
      return;
    }

    try {
      await api.createReview({
        post_id: Number(id),
        rating: userRating,
        content: reviewText || `Rated ${userRating} stars for ${car?.name || 'this vehicle'}.`,
      });

      window.dispatchEvent(new Event('hamro_reviews_api_updated'));

      toast.success('Thanks for your feedback!');
      setUserRating(0);
      setReviewText('');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail || 'Unable to submit review right now.');
    }
  };

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
          const sourceImages = (() => {
            const apiImages = parseImages(matched.image_urls);
            const localImages = parseImages(matched.images);
            const fallbackCandidates = [matched.image_url, matched.image]
              .map((item) => parseImages(item))
              .flat();
            if (apiImages.length > 0) return apiImages;
            if (localImages.length > 0) return localImages;
            return fallbackCandidates;
          })();

          const normalizedImages = sourceImages
            .map((item) => toAbsoluteImage(String(item).trim()))
            .filter(Boolean);

          const normalizedCurrency = !matched.currency || matched.currency === '$' || String(matched.currency).toUpperCase() === 'USD' ? 'Rs.' : matched.currency;
          setVehicleFromApi({
            id: matched.id,
            name: matched.post_title || matched.name,
            price: `${normalizedCurrency} ${matched.price_per_day ?? matched.price ?? 0}`,
            transmission: matched.transmission || matched.category || 'Automatic',
            image: normalizedImages[0] || fallbackImage,
            images: normalizedImages.length > 0 ? normalizedImages : [fallbackImage],
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
      const sourceImages = (() => {
        const apiImages = parseImages(stateCar.image_urls);
        const localImages = parseImages(stateCar.images);
        const fallbackCandidates = [stateCar.image]
          .map((item) => parseImages(item))
          .flat();
        if (apiImages.length > 0) return apiImages;
        if (localImages.length > 0) return localImages;
        return fallbackCandidates;
      })();

      const normalizedImages = sourceImages
        .map((item) => toAbsoluteImage(String(item).trim()))
        .filter(Boolean);

      return {
        ...stateCar,
        image: normalizedImages[0] || fallbackImage,
        images: normalizedImages.length > 0 ? normalizedImages : [fallbackImage],
        category: stateCar.category || 'Vehicle',
        fuel: stateCar.fuel || 'PB 95',
      };
    }
    return vehicleFromApi;
  }, [stateCar, vehicleFromApi]);

  const detailImages = Array.isArray(car?.images) && car.images.length > 0
    ? car.images
    : [car?.image || fallbackImage];
  const hasMultipleImages = detailImages.length > 1;
  
  const ratingValue = Number(car?.rating ?? car?.average_rating ?? car?.avg_rating ?? 0);
  const ratingCount = Number(car?.ratingCount ?? car?.rating_count ?? car?.reviewCount ?? car?.reviews_count ?? 0);
  const hasGuestRating = ratingCount > 0;
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (!car?.location) {
      return;
    }

    setBookingForm((prev) => ({
      ...prev,
      pickup_location: prev.pickup_location || car.location,
      return_location: prev.return_location || car.location,
    }));
  }, [car?.location]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [car?.id]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!car?.id || !user?.id || !api.isAuthenticated()) {
        setCanReview(false);
        return;
      }

      setReviewEligibilityLoading(true);
      try {
        const myBookings = await api.getMyBookings({ limit: 100 });
        const hasBookingForCar = (Array.isArray(myBookings) ? myBookings : []).some(
          (booking) => Number(booking.post_id ?? booking.postId) === Number(car.id)
            && ['pending', 'confirmed', 'completed'].includes(String(booking.status || '').toLowerCase()),
        );
        setCanReview(hasBookingForCar);
      } catch {
        setCanReview(false);
      } finally {
        setReviewEligibilityLoading(false);
      }
    };

    checkReviewEligibility();
  }, [car?.id, user?.id]);

  const onBookingFieldChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const findNextAvailableDateRange = async (postId, startDate, endDate) => {
    const totalDays = getRangeDays(startDate, endDate);
    let candidateStart = addDays(startDate, 1);

    for (let index = 0; index < 45; index += 1) {
      const candidateEnd = addDays(candidateStart, totalDays - 1);

      try {
        const availability = await api.getBookingAvailability(postId, candidateStart, candidateEnd);
        if (availability?.available) {
          return { start_date: candidateStart, end_date: candidateEnd };
        }
      } catch {
        // Keep searching nearby dates.
      }

      candidateStart = addDays(candidateStart, 1);
    }

    return null;
  };

  const handleBookNow = async () => {
    if (bookingRequestInFlightRef.current || bookingLoading) {
      return;
    }

    if (!bookingForm.pickup_location || !bookingForm.return_location || !bookingForm.start_date || !bookingForm.end_date) {
      toast.error('Please fill all required booking fields.');
      return;
    }

    if (!api.isAuthenticated()) {
      toast.error('Please login to continue with your booking.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (bookingForm.start_date < today) {
      toast.error('Start date cannot be in the past.');
      return;
    }

    if (bookingForm.end_date < bookingForm.start_date) {
      toast.error('End date must be greater than or equal to start date.');
      return;
    }

    bookingRequestInFlightRef.current = true;
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

      toast.success(response?.message || 'Booking created successfully.');
      setCanReview(true);
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
        toast.error(detail.map((item) => item.msg || String(item)).join(', '));
      } else if (error?.response?.status === 409) {
        const suggestion = await findNextAvailableDateRange(
          Number(id),
          bookingForm.start_date,
          bookingForm.end_date,
        );

        if (suggestion) {
          setBookingForm((prev) => ({
            ...prev,
            start_date: suggestion.start_date,
            end_date: suggestion.end_date,
          }));
          toast.info(`Selected dates are unavailable. Suggested: ${formatDateForToast(suggestion.start_date)} to ${formatDateForToast(suggestion.end_date)}.`);
        } else {
          toast.error('Selected dates are unavailable. Please choose another date range.');
        }
      } else {
        toast.error(detail || 'Failed to create booking. Please login and try again.');
      }
    } finally {
      setBookingLoading(false);
      bookingRequestInFlightRef.current = false;
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
                <div className="relative w-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? detailImages.length - 1 : prev - 1))}
                    disabled={!hasMultipleImages}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center ${hasMultipleImages ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % detailImages.length)}
                    disabled={!hasMultipleImages}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center ${hasMultipleImages ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>

                  <img src={detailImages[activeImageIndex] || car.image} alt={car.name} className="w-full max-h-80 object-contain" />
                </div>
              </div>

              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-2">{car.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{car.name}</h1>
                <p className="text-2xl font-bold text-indigo-600 mb-6">{car.price} <span className="text-sm text-gray-500 font-normal">per day</span></p>

                {hasGuestRating ? (
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Guest Rating</p>
                      <RatingDisplay value={ratingValue} showValue valueClassName="font-semibold text-amber-800" />
                    </div>
                    <p className="text-sm text-amber-800 font-medium">Based on {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}</p>
                  </div>
                ) : null}

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
                        min={today}
                        value={bookingForm.start_date}
                        onChange={(event) => onBookingFieldChange('start_date', event.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">End Date</label>
                      <input
                        type="date"
                        min={bookingForm.start_date || today}
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

                {reviewEligibilityLoading ? (
                  <div className="mt-8 border border-gray-200 rounded-xl p-5 text-sm text-gray-500">
                    Checking review eligibility...
                  </div>
                ) : canReview ? (
                  <div className="mt-8 border border-gray-200 rounded-xl p-5">
                    <h2 className="text-lg font-semibold text-gray-900">Rate This Vehicle</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Share your experience with other renters.</p>

                    <RatingInput value={userRating} onChange={setUserRating} size="lg" className="mb-4" />

                    <textarea
                      value={reviewText}
                      onChange={(event) => {
                        setReviewText(event.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-24"
                      placeholder="Write a short review (optional)"
                    />

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        disabled={!userRating}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Submit Rating
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
                    You can review this vehicle only after booking it.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}