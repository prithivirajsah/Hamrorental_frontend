import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Car, IndianRupee, MapPin, Plus, Upload, UserRound, X, Loader2 } from 'lucide-react';
import api from '@/api';
import config from '@/config/config';
import { toast } from 'react-toastify';

const blankForm = {
  title: '',
  category: 'sedan',
  location: '',
  pricePerDay: '',
  description: '',
  contactNumber: '',
  features: [],
  existingImageUrls: [],
  images: [],
  imageFiles: [],
};

const buildFormFromPost = (post) => ({
  title: post.post_title || '',
  category: post.category || 'sedan',
  location: post.location || '',
  pricePerDay: String(post.price_per_day || ''),
  description: post.description || '',
  contactNumber: post.contact_number || '',
  features: [...(post.features || [])],
  existingImageUrls: [...(post.image_urls || [])],
  images: [],
  imageFiles: [],
});

const presetFeatures = [
  'Automatic',
  'PB 95',
  'Air Conditioner',
  'GPS Navigation',
  'Bluetooth',
  'Rear Camera',
  'Parking Sensors',
  'Cruise Control',
  'ABS',
  'Airbags',
  'USB Charging',
  'Sunroof',
];

const categoryOptions = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'cabriolet', label: 'Cabriolet' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'suv', label: 'SUV' },
  { value: 'minivan', label: 'Minivan' },
];

export default function UserAddPost({ asModal = false, onClose, initialPost = null, onSuccess }) {
  const isEditing = Boolean(initialPost);
  const [form, setForm] = useState(() => initialPost ? buildFormFromPost(initialPost) : blankForm);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    const alreadyExists = form.features.some(
      (feature) => feature.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!trimmed || alreadyExists) return;

    setForm((prev) => ({
      ...prev,
      features: [...prev.features, trimmed],
    }));
    setNewFeature('');
  };

  const togglePresetFeature = (feature) => {
    if (form.features.includes(feature)) {
      removeFeature(feature);
      return;
    }

    setForm((prev) => ({
      ...prev,
      features: [...prev.features, feature],
    }));
  };

  const removeFeature = (item) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== item),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const removeImage = (item) => {
    if (item.startsWith('blob:')) {
      const imageIndex = form.images.findIndex((image) => image === item);
      URL.revokeObjectURL(item);
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((image) => image !== item),
        imageFiles: prev.imageFiles.filter((_, index) => index !== imageIndex),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        existingImageUrls: prev.existingImageUrls.filter((url) => url !== item),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('post_title', form.title.trim());
      payload.append('category', form.category);
      payload.append('price_per_day', String(form.pricePerDay));
      payload.append('location', form.location.trim());
      payload.append('contact_number', form.contactNumber.trim());
      payload.append('description', form.description.trim());
      payload.append('features', JSON.stringify(form.features));

      if (isEditing) {
        payload.append('existing_image_urls', JSON.stringify(form.existingImageUrls));
      }

      form.imageFiles.forEach((file) => {
        payload.append('images', file);
      });

      if (isEditing) {
        await api.updatePost(initialPost.id, payload);
        toast.success('Post updated successfully.');
      } else {
        await api.createPost(payload);
        toast.success('Post submitted successfully.');
      }

      form.images.forEach((image) => {
        if (image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });
      setForm(blankForm);
      setNewFeature('');
      if (onSuccess) onSuccess();
      if (asModal && onClose) onClose();
    } catch (error) {
      const backendError = error?.response?.data?.detail;
      let message = Array.isArray(backendError)
        ? backendError.map((item) => item.msg || item).join(', ')
        : backendError;

      if (!message && error?.response?.status === 401) {
        message = 'Please login again before publishing your post.';
      }

      if (!message && !error?.response) {
        message = `Cannot connect to API (${config.API_BASE_URL}). Please check backend server.`;
      }

      if (!message) {
        message = 'Failed to submit post. Please try again.';
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
          <p className="text-sm text-gray-500 mt-1">{isEditing ? 'Update your vehicle listing details.' : 'Publish your vehicle listing in a few quick steps.'}</p>
        </div>
        {asModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center"
            aria-label="Close add post popup"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Car className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Post Title *</Label>
              <Input
                className="mt-1"
                value={form.title}
                onChange={(event) => setField('title', event.target.value)}
                placeholder="e.g. Toyota Corolla 2022 for Rent"
                required
              />
            </div>

            <div>
              <Label>Price per Day (NPR) *</Label>
              <div className="relative mt-1">
                <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={form.pricePerDay}
                  onChange={(event) => setField('pricePerDay', event.target.value)}
                  placeholder="e.g. 5000"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Category *</Label>
              <select
                value={form.category}
                onChange={(event) => setField('category', event.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Location *</Label>
              <div className="relative mt-1">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={form.location}
                  onChange={(event) => setField('location', event.target.value)}
                  placeholder="e.g. Kathmandu"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Contact Number *</Label>
              <div className="relative mt-1">
                <UserRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={form.contactNumber}
                  onChange={(event) => setField('contactNumber', event.target.value)}
                  placeholder="e.g. 98XXXXXXXX"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label>Description *</Label>
              <Textarea
                className="mt-1 min-h-28"
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                placeholder="Describe condition, features, pickup process, and any extra details..."
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {presetFeatures.map((feature) => {
              const isSelected = form.features.includes(feature);
              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => togglePresetFeature(feature)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(event) => setNewFeature(event.target.value)}
              placeholder="Add custom feature..."
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.features.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm">
                  {item}
                  <button
                    type="button"
                    onClick={() => removeFeature(item)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.existingImageUrls.map((url) => (
              <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100">
                <img src={url.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${url}` : url} alt="Existing" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {form.images.map((image) => (
              <div key={image} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100">
                <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}

            <label className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors flex flex-col items-center justify-center cursor-pointer gap-1">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {asModal && onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 min-w-36" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              isEditing ? 'Update Post' : 'Publish Post'
            )}
          </Button>
        </div>
      </form>
    </>
  );

  if (asModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-50 p-6 sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{content}</div>
    </div>
  );
}
