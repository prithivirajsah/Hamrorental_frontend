import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UserAddPost from '@/pages/UserAddPost';
import api from '@/api';

export default function DriverAddPost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const { data: initialPost = null, isLoading } = useQuery({
    queryKey: ['driver', 'post-edit', editId],
    queryFn: async () => {
      if (!editId) return null;
      return api.getPostById(editId);
    },
    enabled: Boolean(editId),
  });

  if (isLoading) {
    return <div className="p-8 text-gray-500">Loading car details...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <UserAddPost
        initialPost={initialPost}
        onSuccess={() => navigate('/driver/vehicles')}
      />
    </div>
  );
}
