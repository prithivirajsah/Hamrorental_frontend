import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Plus, ArrowLeft, Loader2 } from 'lucide-react';

const DEFAULT_FORM = {
  post_title: '', category: 'sedan', price_per_day: '',
  description: '', features: [], location: '', contact_number: '',
  image_urls: [],
  image_files: [],
};

const PRESET_FEATURES = [
  'Automatic',
  'Air Conditioner',
  'GPS Navigation',
  'Bluetooth',
  'Rear Camera',
  'Parking Sensors',
  'Cruise Control',
  'ABS',
  'Airbags',
];

export default function AddPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const isEdit = !!editId;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: existingVehicle } = useQuery({
    queryKey: ['vehicle', editId],
    queryFn: () => api.getPostById(parseInt(editId)),
    enabled: !!editId,
  });

  useEffect(() => {
    if (existingVehicle?.id) {
      setForm({
        post_title: existingVehicle.post_title || '',
        category: existingVehicle.category || 'sedan',
        price_per_day: existingVehicle.price_per_day || '',
        location: existingVehicle.location || '',
        contact_number: existingVehicle.contact_number || '',
        description: existingVehicle.description || '',
        features: existingVehicle.features || [],
        image_urls: existingVehicle.image_urls || [],
      });
    }
  }, [existingVehicle?.id]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append('post_title', data.post_title);
      formData.append('category', data.category.toLowerCase());
      formData.append('price_per_day', parseFloat(data.price_per_day));
      formData.append('location', data.location);
      formData.append('contact_number', data.contact_number);
      formData.append('description', data.description);
      formData.append('features', JSON.stringify(data.features || []));

      const existingImageUrls = (data.image_urls || []).filter(
        (url) => typeof url === 'string' && !url.startsWith('data:')
      );
      formData.append('existing_image_urls', JSON.stringify(existingImageUrls));

      // Handle image uploads
      if (data.image_files && data.image_files.length > 0) {
        data.image_files.forEach(file => {
          formData.append('images', file);
        });
      }

      return isEdit ? api.updatePost(editId, formData) : api.createPost(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'admin'] });
      navigate(createPageUrl('AdminVehicles'));
    },
    onError: (error) => {
      console.error('Save error:', error);
      const detail = error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        alert('Error: ' + detail.map((item) => item.msg || item.toString()).join(', '));
      } else {
        alert('Error: ' + (detail || 'Failed to save vehicle'));
      }
    },
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const fileArray = [...(form.image_files || []), ...files];
      setForm(prev => ({ ...prev, image_files: fileArray }));

      // Show previews
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result;
          if (imageUrl) {
            setForm(prev => ({
              ...prev,
              image_urls: [...(prev.image_urls || []), imageUrl]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    const selectedUrl = form.image_urls?.[idx];
    const isDataUrl = typeof selectedUrl === 'string' && selectedUrl.startsWith('data:');
    let updatedImageFiles = [...(form.image_files || [])];

    if (isDataUrl) {
      const dataUrlIndex = (form.image_urls || [])
        .slice(0, idx + 1)
        .filter((url) => typeof url === 'string' && url.startsWith('data:')).length - 1;
      if (dataUrlIndex >= 0) {
        updatedImageFiles = updatedImageFiles.filter((_, fileIndex) => fileIndex !== dataUrlIndex);
      }
    }

    setForm(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== idx),
      image_files: updatedImageFiles,
    }));
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;

    const alreadyExists = (form.features || []).some(
      (feature) => feature.toLowerCase() === trimmed.toLowerCase(),
    );

    if (!alreadyExists) {
      setForm(prev => ({ ...prev, features: [...(prev.features || []), trimmed] }));
      setNewFeature('');
    }
  };

  const togglePresetFeature = (feature) => {
    const hasFeature = (form.features || []).includes(feature);
    if (hasFeature) {
      setForm(prev => ({ ...prev, features: prev.features.filter((item) => item !== feature) }));
    } else {
      setForm(prev => ({ ...prev, features: [...(prev.features || []), feature] }));
    }
  };

  const removeFeature = (idx) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.post_title.trim()) {
      alert('Please enter a vehicle name');
      return;
    }
    if (!form.price_per_day) {
      alert('Please enter price per day');
      return;
    }
    if (!form.location.trim()) {
      alert('Please enter location');
      return;
    }
    if (!form.contact_number.trim()) {
      alert('Please enter contact number');
      return;
    }
    if (!form.description.trim()) {
      alert('Please enter description');
      return;
    }

    saveMutation.mutate(form);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
          <p className="text-sm text-gray-500">Fill in the details for your vehicle listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Title/Name *</Label>
              <Input 
                className="mt-1" 
                value={form.post_title} 
                onChange={e => set('post_title', e.target.value)} 
                placeholder="e.g. Toyota Fortuner 2023" 
                required 
              />
            </div>
            <div>
              <Label>Contact Number *</Label>
              <Input 
                className="mt-1" 
                value={form.contact_number} 
                onChange={e => set('contact_number', e.target.value)} 
                placeholder="e.g. +977-9841234567" 
                required 
              />
            </div>
            <div>
              <Label>Location *</Label>
              <Input 
                className="mt-1" 
                value={form.location} 
                onChange={e => set('location', e.target.value)} 
                placeholder="e.g. Kathmandu, Nepal" 
                required 
              />
            </div>
            <div>
              <Label>Vehicle Category *</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['sedan', 'suv', 'pickup', 'cabriolet', 'minivan'].map(c => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Price per Day (NPR) *</Label>
              <Input 
                className="mt-1" 
                type="number" 
                value={form.price_per_day} 
                onChange={e => set('price_per_day', e.target.value)} 
                placeholder="100" 
                min={0} 
                step={1} 
                required 
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Vehicle Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(form.image_urls || []).map((img, i) => (
              <div key={i} className="relative group aspect-video">
                <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <label className="aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
                className="hidden" 
                disabled={uploading} 
              />
            </label>
          </div>
        </div>

        {/* Description & Features */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Description & Features</h2>
          <div className="space-y-4">
            <div>
              <Label>Description *</Label>
              <Textarea
                className="mt-1 h-24"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the vehicle, its condition, and highlights..."
                required
              />
            </div>
            <div>
              <Label>Features</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {PRESET_FEATURES.map((feature) => {
                  const isSelected = (form.features || []).includes(feature);
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
              <div className="flex gap-2 mt-1">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Add custom feature..."
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {(form.features || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-sm">
                      {f}
                      <button type="button" onClick={() => removeFeature(i)} className="text-indigo-400 hover:text-indigo-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={saveMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 px-8">
            {saveMutation.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              : (isEdit ? 'Update Vehicle' : 'Publish Vehicle')
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
