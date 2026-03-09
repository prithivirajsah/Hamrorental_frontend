import React, { useEffect, useMemo, useState } from 'react';
import { SlArrowDown } from "react-icons/sl";
import api from '../../api';

export default function BookingForm() {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    post_id: '',
    pickup_location: '',
    return_location: '',
    start_date: '',
    end_date: '',
  });

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const data = await api.getPosts({ limit: 100 });
        if (mounted) {
          const normalized = Array.isArray(data) ? data : [];
          setPosts(normalized);
          if (normalized.length > 0) {
            const firstPost = normalized[0];
            setForm((prev) => ({
              ...prev,
              post_id: String(firstPost.id),
              pickup_location: firstPost.location || prev.pickup_location,
              return_location: firstPost.location || prev.return_location,
            }));
          }
        }
      } catch (loadError) {
        if (mounted) {
          setError('Failed to load vehicles. Please refresh and try again.');
        }
      } finally {
        if (mounted) {
          setIsLoadingPosts(false);
        }
      }
    };

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const placeOptions = useMemo(() => {
    const apiPlaces = posts
      .map((post) => String(post.location || '').trim())
      .filter(Boolean);
    const defaults = ['Kathmandu', 'Pokhara', 'Chitwan'];
    return [...new Set([...apiPlaces, ...defaults])];
  }, [posts]);

  const onChangeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onPostChange = (value) => {
    const selectedPost = posts.find((post) => String(post.id) === value);
    setForm((prev) => ({
      ...prev,
      post_id: value,
      pickup_location: selectedPost?.location || prev.pickup_location,
      return_location: selectedPost?.location || prev.return_location,
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.post_id || !form.pickup_location || !form.return_location || !form.start_date || !form.end_date) {
      setError('Please fill all required fields.');
      return;
    }

    if (form.end_date < form.start_date) {
      setError('Return date must be greater than or equal to rental date.');
      return;
    }

    if (!api.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    setIsSubmitting(true);
    try {
      const availability = await api.getBookingAvailability(
        Number(form.post_id),
        form.start_date,
        form.end_date,
      );

      if (!availability?.available) {
        setError('Selected dates are not available for this vehicle.');
        return;
      }

      const response = await api.createBooking({
        post_id: Number(form.post_id),
        pickup_location: form.pickup_location,
        return_location: form.return_location,
        start_date: form.start_date,
        end_date: form.end_date,
      });

      setSuccess(response?.message || 'Booking created successfully.');
      setForm((prev) => ({
        ...prev,
        start_date: '',
        end_date: '',
      }));
    } catch (submitError) {
      const detail = submitError?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg || String(item)).join(', '));
      } else {
        setError(detail || 'Failed to create booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-100 max-w-md mx-auto">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Book your car</h3>
      <div className="space-y-5">
        {/* Vehicle */}
        <div className="relative">
          <select
            value={form.post_id}
            onChange={(event) => onPostChange(event.target.value)}
            className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 cursor-pointer placeholder:text-gray-400"
          >
            <option value="" disabled hidden>{isLoadingPosts ? 'Loading vehicles...' : 'Select vehicle'}</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {(post.post_title || 'Vehicle')} - Rs. {post.price_per_day ?? 0}/day
              </option>
            ))}
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
            <SlArrowDown size={15} />
          </span>
        </div>

        {/* Place of Rental */}
        <div className="relative">
          <select
            value={form.pickup_location}
            onChange={(event) => onChangeField('pickup_location', event.target.value)}
            className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 cursor-pointer placeholder:text-gray-400"
          >
            <option value="" disabled hidden>Place of rental</option>
            {placeOptions.map((place) => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
            <SlArrowDown size={15} />
          </span>
        </div>

        {/* Place of Return */}
        <div className="relative">
          <select
            value={form.return_location}
            onChange={(event) => onChangeField('return_location', event.target.value)}
            className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 cursor-pointer placeholder:text-gray-400"
          >
            <option value="" disabled hidden>Place of return</option>
            {placeOptions.map((place) => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
            <SlArrowDown size={15} />
          </span>
        </div>

        {/* Rental Date */}
        <div className="relative">
          <input 
            type="date" 
            min={today}
            value={form.start_date}
            onChange={(event) => onChangeField('start_date', event.target.value)}
            className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            placeholder="Rental date"
          />
        </div>

        {/* Return Date */}
        <div className="relative">
          <input 
            type="date" 
            min={form.start_date || today}
            value={form.end_date}
            onChange={(event) => onChangeField('end_date', event.target.value)}
            className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            placeholder="Return date"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        {/* Book Now Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isLoadingPosts || posts.length === 0}
          className="w-full bg-[#FF9E0C] text-white font-bold text-xl py-4 rounded-2xl transition-colors mt-2 disabled:opacity-60"
        >
          {isSubmitting ? 'Booking...' : 'Book now'}
        </button>
      </div>
    </div>
  );
}
