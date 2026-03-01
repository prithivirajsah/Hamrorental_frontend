const PAGE_ROUTES = {
  AdminDashboard: '/admin',
  AdminVehicles: '/admin/vehicles',
  AdminBookings: '/admin/bookings',
  AdminDocuments: '/admin/documents',
  AdminUsers: '/admin/users',
  AddPost: '/admin/add-post',
};

export const createPageUrl = (pageName) => PAGE_ROUTES[pageName] || '/';
