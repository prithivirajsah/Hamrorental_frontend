import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminData } from '@/api/adminDataClient';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Plus, ArrowLeft, Loader2 } from 'lucide-react';

const DEFAULT_FORM = {
  name: '', brand: '', model: '', year: new Date().getFullYear(),
  category: 'Sedan', fuel_type: 'Petrol', transmission: 'Automatic',
  seats: 5, color: '', price_per_day: '', price_per_hour: '',
  description: '', features: [], location: '', status: 'available',
  images: [],
};

export default function AddPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const isEdit = !!editId;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: existingVehicles } = useQuery({
    queryKey: ['vehicle', editId],
    queryFn: () => adminData.entities.Vehicle.filter({ id: editId }),
    enabled: !!editId,
  });

  useEffect(() => {
    if (existingVehicles?.[0]) {
      setForm({ ...DEFAULT_FORM, ...existingVehicles[0] });
    }
  }, [existingVehicles]);

  const saveMutation = useMutation({
    mutationFn: (data) => isEdit
      ? adminData.entities.Vehicle.update(editId, data)
      : adminData.entities.Vehicle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      navigate(createPageUrl('AdminVehicles'));
    },
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const { file_url } = await adminData.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, images: [...(prev.images || []), file_url] }));
    }
    setUploading(false);
  };

  const removeImage = (idx) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm(prev => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (idx) => setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...form,
      year: parseInt(form.year) || new Date().getFullYear(),
      seats: parseInt(form.seats) || 5,
      price_per_day: parseFloat(form.price_per_day) || 0,
      price_per_hour: form.price_per_hour ? parseFloat(form.price_per_hour) : undefined,
    });
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
              <Label>Vehicle Name *</Label>
              <Input className="mt-1" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Toyota Fortuner 2023" required />
            </div>
            <div>
              <Label>Brand *</Label>
              <Input className="mt-1" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Toyota" required />
            </div>
            <div>
              <Label>Model *</Label>
              <Input className="mt-1" value={form.model} onChange={e => set('model', e.target.value)} placeholder="e.g. Fortuner" required />
            </div>
            <div>
              <Label>Year</Label>
              <Input className="mt-1" type="number" value={form.year} onChange={e => set('year', e.target.value)} min={1990} max={2030} />
            </div>
            <div>
              <Label>Color</Label>
              <Input className="mt-1" value={form.color} onChange={e => set('color', e.target.value)} placeholder="e.g. Pearl White" />
            </div>
            <div>
              <Label>Location</Label>
              <Input className="mt-1" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Kathmandu, Nepal" />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Luxury', 'Electric'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={form.fuel_type} onValueChange={v => set('fuel_type', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transmission</Label>
              <Select value={form.transmission} onValueChange={v => set('transmission', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Number of Seats</Label>
              <Input className="mt-1" type="number" value={form.seats} onChange={e => set('seats', e.target.value)} min={1} max={20} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Price per Day (USD) *</Label>
              <Input className="mt-1" type="number" value={form.price_per_day} onChange={e => set('price_per_day', e.target.value)} placeholder="0.00" min={0} step={0.01} required />
            </div>
            <div>
              <Label>Price per Hour (USD) <span className="text-gray-400 font-normal">optional</span></Label>
              <Input className="mt-1" type="number" value={form.price_per_hour} onChange={e => set('price_per_hour', e.target.value)} placeholder="0.00" min={0} step={0.01} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Vehicle Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(form.images || []).map((img, i) => (
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
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Description & Features */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Description & Features</h2>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Textarea
                className="mt-1 h-24"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the vehicle, its condition, and highlights..."
              />
            </div>
            <div>
              <Label>Features</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="e.g. Air Conditioning, GPS, Bluetooth..."
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

        {/* Availability */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Availability</h2>
          <div className="max-w-xs">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => set('status', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
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
