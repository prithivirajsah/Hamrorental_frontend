import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Gauge, Users, Wind, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const reviewSectionRef = useRef(null);
  const [reviewEligibilityLoading, setReviewEligibilityLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewReminder, setReviewReminder] = useState(null);
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
    if (!showBookingForm) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showBookingForm]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!car?.id || !user?.id || !api.isAuthenticated()) {
        setCanReview(false);
        setReviewReminder(null);
        return;
      }

      setReviewEligibilityLoading(true);
      try {
        const reminders = await api.getReviewReminders({ limit: 20 });
        const matchedReminder = (Array.isArray(reminders) ? reminders : []).find(
          (item) => Number(item.post_id ?? item.postId) === Number(car.id),
        );

        setReviewReminder(matchedReminder || null);
        setCanReview(Boolean(matchedReminder));

        if (matchedReminder) {
          reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const focusTimer = window.setTimeout(() => {
            const reviewTextarea = document.getElementById('vehicle-review-textarea');
            reviewTextarea?.focus();
          }, 350);

          return () => {
            window.clearTimeout(focusTimer);
          };
        }
      } catch {
        setCanReview(false);
        setReviewReminder(null);
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
      setBookingForm({
        pickup_location: '',
        return_location: '',
        start_date: '',
        end_date: '',
        note: '',
      });
      setShowBookingForm(false);
      toast.info('You will be prompted to review this rental once it is marked completed.');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      const messageFromServer = error?.response?.data?.message;
      const normalizedMessage = String(
        Array.isArray(detail)
          ? detail.map((item) => item.msg || String(item)).join(', ')
          : (detail || messageFromServer || ''),
      ).toLowerCase();

      if (
        normalizedMessage.includes('cannot book your own vehicle')
        || (normalizedMessage.includes('book') && normalizedMessage.includes('own') && normalizedMessage.includes('vehicle'))
      ) {
        toast.error('You cannot book your own vehicle.');
      } else
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
        toast.error(detail || messageFromServer || 'Failed to create booking. Please login and try again.');
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
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">Loading vehicle details...</div>
        ) : !car ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            Vehicle not found.
          </div>
        ) : (
          <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-50 via-white to-indigo-50" />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7">
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="relative overflow-hidden rounded-xl bg-white">
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? detailImages.length - 1 : prev - 1))}
                      disabled={!hasMultipleImages}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center shadow-sm ${hasMultipleImages ? 'opacity-100 hover:bg-white' : 'opacity-40 cursor-not-allowed'}`}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev + 1) % detailImages.length)}
                      disabled={!hasMultipleImages}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center shadow-sm ${hasMultipleImages ? 'opacity-100 hover:bg-white' : 'opacity-40 cursor-not-allowed'}`}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>

                    <img
                      src={detailImages[activeImageIndex] || car.image}
                      alt={car.name}
                      className="w-full h-[280px] sm:h-[360px] object-cover"
                    />
                  </div>

                  {detailImages.length > 1 ? (
                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {detailImages.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          className={`overflow-hidden rounded-lg border transition ${index === activeImageIndex ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300'}`}
                          aria-label={`Show image ${index + 1}`}
                        >
                          <img src={image} alt={`${car.name} ${index + 1}`} className="h-14 w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Gauge className="w-4 h-4" />
                      Transmission
                    </div>
                    <p className="font-semibold text-gray-900">{car.transmission || 'Automatic'}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Users className="w-4 h-4" />
                      Fuel
                    </div>
                    <p className="font-semibold text-gray-900">{car.fuel || 'PB 95'}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Wind className="w-4 h-4" />
                      Comfort
                    </div>
                    <p className="font-semibold text-gray-900">Air Conditioner</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-6">
                  <p className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">{car.category}</p>
                  <h1 className="text-3xl font-bold text-gray-900 mt-3">{car.name}</h1>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {car.price}
                    <span className="text-sm text-gray-500 font-normal ml-1">per day</span>
                  </p>

                  {car.location ? (
                    <p className="text-sm text-gray-600 mt-4">Location: <span className="font-medium text-gray-900">{car.location}</span></p>
                  ) : null}

                  {hasGuestRating ? (
                    <div className="mt-4 flex items-center justify-between gap-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Guest Rating</p>
                        <RatingDisplay value={ratingValue} showValue valueClassName="font-semibold text-amber-800" />
                      </div>
                      <p className="text-sm text-amber-800 font-medium">{ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}</p>
                    </div>
                  ) : null}

                  {car.description ? (
                    <p className="text-gray-700 mt-4 leading-relaxed">{car.description}</p>
                  ) : null}

                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-gray-900">Booking</h2>
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Choose an option</span>
                    </div>

                    <p className="text-sm text-gray-500">Booking form opens in a popup.</p>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-4 transition-colors"
                      >
                        Book Now
                      </button>
                      <Link
                        to="/hire-a-driver"
                        className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-semibold py-2.5 px-4 transition-colors hover:bg-indigo-100"
                      >
                        Hire a Driver
                      </Link>
                    </div>
                  </div>

                  {reviewEligibilityLoading ? (
                    <div className="mt-6 border border-gray-200 rounded-xl p-5 text-sm text-gray-500">
                      Checking review status...
                    </div>
                  ) : canReview ? (
                    <div ref={reviewSectionRef} className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Completed rental</p>
                          <h2 className="text-lg font-semibold text-gray-900 mt-1">Rate This Vehicle</h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {reviewReminder
                              ? 'Your trip is completed. Please share your experience with other renters.'
                              : 'You can leave a review once this rental is completed.'}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-amber-700 shadow-sm">
                          Review ready
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                        <RatingInput value={userRating} onChange={setUserRating} size="lg" className="mb-4" />

                        <textarea
                          value={reviewText}
                          onChange={(event) => {
                            setReviewText(event.target.value);
                          }}
                          id="vehicle-review-textarea"
                          className="w-full rounded-xl border border-gray-300 px-3 py-3 min-h-28 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                          placeholder="Write a short review (optional)"
                        />

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleSubmitReview}
                            disabled={!userRating}
                            className="rounded-xl bg-amber-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Submit Rating
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
                      You can review this vehicle once your rental is marked completed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {car && showBookingForm ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
            role="dialog"
            aria-modal="true"
            aria-label="Booking form"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
              onClick={() => setShowBookingForm(false)}
              aria-label="Close booking form"
            />

            <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-[#F3F2F2] p-4 shadow-2xl sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Booking</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Hide Booking Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="h-10 w-10 rounded-lg border border-gray-300 bg-white text-gray-600 hover:text-gray-900"
                    aria-label="Close"
                  >
                    <X className="mx-auto h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Selected Vehicle</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{car.name || 'Vehicle'}</p>
                <p className="text-sm text-gray-700">
                  {car.price || 'Price unavailable'}
                  {car.location ? ` • ${car.location}` : ''}
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl bg-[#F3F2F2] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Pickup Location</label>
                  <input
                    value={bookingForm.pickup_location}
                    onChange={(event) => onBookingFieldChange('pickup_location', event.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    placeholder="e.g. Kathmandu"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Return Location</label>
                  <input
                    value={bookingForm.return_location}
                    onChange={(event) => onBookingFieldChange('return_location', event.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
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
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    min={bookingForm.start_date || today}
                    value={bookingForm.end_date}
                    onChange={(event) => onBookingFieldChange('end_date', event.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Note (optional)</label>
                  <textarea
                    value={bookingForm.note}
                    onChange={(event) => onBookingFieldChange('note', event.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20 bg-white"
                    placeholder="Any additional request"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={handleBookNow}
                    disabled={bookingLoading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-6 rounded-lg disabled:opacity-60"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}