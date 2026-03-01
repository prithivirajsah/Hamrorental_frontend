import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Upload, Loader2 } from 'lucide-react';

const initialForm = {
  title: '',
  category: 'Car',
  location: '',
  pricePerDay: '',
  description: '',
  contactNumber: '',
  features: [],
  images: [],
};

export default function UserAddPost({ asModal = false, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    const trimmedFeature = newFeature.trim();
    if (!trimmedFeature || form.features.includes(trimmedFeature)) return;
    setForm((prev) => ({ ...prev, features: [...prev.features, trimmedFeature] }));
    setNewFeature('');
  };

  const removeFeature = (featureToRemove) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
    }));
  };

  const removeImage = (imageToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.alert('Post UI submitted successfully. Backend integration can be connected next.');
      setForm(initialForm);
      setNewFeature('');
      if (asModal && onClose) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Post</h1>
          <p className="text-sm text-gray-500 mt-1">Create your listing with the required details.</p>
        </div>
        {asModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center"
            aria-label="Close add post popup"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(value) => setField('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location *</Label>
              <Input
                className="mt-1"
                value={form.location}
                onChange={(event) => setField('location', event.target.value)}
                placeholder="e.g. Kathmandu"
                required
              />
            </div>

            <div>
              <Label>Price per Day (NPR) *</Label>
              <Input
                className="mt-1"
                type="number"
                min={0}
                step={1}
                value={form.pricePerDay}
                onChange={(event) => setField('pricePerDay', event.target.value)}
                placeholder="e.g. 5000"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Contact Number *</Label>
              <Input
                className="mt-1"
                value={form.contactNumber}
                onChange={(event) => setField('contactNumber', event.target.value)}
                placeholder="e.g. 98XXXXXXXX"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Description *</Label>
              <Textarea
                className="mt-1 min-h-28"
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                placeholder="Describe your vehicle, condition, and any extra details..."
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(event) => setNewFeature(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Add a feature (AC, GPS, Bluetooth...)"
            />
            <Button type="button" variant="outline" onClick={addFeature}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {form.images.map((image) => (
              <div key={image} className="relative group aspect-video rounded-xl overflow-hidden">
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

            <label className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors flex items-center justify-center cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">Upload one or more images for your post.</p>
        </div>

        <div className="flex justify-end gap-2">
          {asModal && onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Post'
            )}
          </Button>
        </div>
      </form>
    </>
  );

  if (asModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-50 p-6 sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">{formContent}</div>
    </div>
  );
}
