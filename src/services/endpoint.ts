export const Endpoint = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';

  return {
    baseUrl: BASE_URL,

    auth: {
      signUp: `${BASE_URL}/auth/sign-up`,
      login: `${BASE_URL}/auth/login`,
      requestLoginOtp: `${BASE_URL}/auth/login/request-otp`,
      verifyLoginOtp: `${BASE_URL}/auth/login/verify-otp`,
      requestForgotPasswordOtp: `${BASE_URL}/auth/forgot-password/request-otp`,
      verifyForgotPasswordOtp: `${BASE_URL}/auth/forgot-password/verify-otp`,
      checkAdmin: `${BASE_URL}/auth/check-admin`,
      changePassword: `${BASE_URL}/auth/change-password`
    },

    profile: {
      getProfile: `${BASE_URL}/profile`,
      updateProfile: `${BASE_URL}/profile`,
      uploadAvatar: `${BASE_URL}/profile/avatar`,
      changePassword: `${BASE_URL}/profile/change-password`,
    },

    category: {
      create: `${BASE_URL}/category`,
      list: `${BASE_URL}/category`,
      menu: `${BASE_URL}/category/menu`,
      detail: (id: string) => `${BASE_URL}/category/${id}`,
      update: (id: string) => `${BASE_URL}/category/${id}`,
      delete: (id: string) => `${BASE_URL}/category/${id}`,
      products: (id: string) => `${BASE_URL}/category/${id}/products`,
    },

    subCategory: {
      create: `${BASE_URL}/sub-category`,
      list: `${BASE_URL}/sub-category`,
      detail: (id: string) => `${BASE_URL}/sub-category/${id}`,
      update: (id: string) => `${BASE_URL}/sub-category/${id}`,
      delete: (id: string) => `${BASE_URL}/sub-category/${id}`,
      products: (id: string) => `${BASE_URL}/sub-category/${id}/products`,
      byCategory: (categoryId: string) => `${BASE_URL}/sub-category/by-category/${categoryId}`,
    },

    brand: {
      create: `${BASE_URL}/brand`,
      list: `${BASE_URL}/brand`,
      detail: (id: string) => `${BASE_URL}/brand/${id}`,
      update: (id: string) => `${BASE_URL}/brand/${id}`,
      delete: (id: string) => `${BASE_URL}/brand/${id}`,
      products: (id: string) => `${BASE_URL}/brand/${id}/products`,
    },

    productType: {
      create: `${BASE_URL}/product-types`,
      list: `${BASE_URL}/product-types`,
      detail: (id: string) => `${BASE_URL}/product-types/${id}`,
      update: (id: string) => `${BASE_URL}/product-types/${id}`,
      delete: (id: string) => `${BASE_URL}/product-types/${id}`,
      products: (id: string) => `${BASE_URL}/product-types/${id}/products`,
      bySubCategory: (subCategoryId: string) => `${BASE_URL}/product-types/by-sub-category/${subCategoryId}`,
    },

    product: {
      create: `${BASE_URL}/products`,
      list: `${BASE_URL}/products`,
      getProductHotSale: `${BASE_URL}/products/hot-sale`,
      getProductFeatured: `${BASE_URL}/products/featured`,
      getProductRelated: (id: string) => `${BASE_URL}/products/${id}/related`,
      detail: (id: string) => `${BASE_URL}/products/${id}`,
      update: (id: string) => `${BASE_URL}/products/${id}`,
      delete: (id: string) => `${BASE_URL}/products/${id}`,
      updateImages: (id: string) => `${BASE_URL}/products/${id}/images`,
      deleteImages: (id: string) => `${BASE_URL}/products/${id}/images`,
      updateDefaultImage: (id: string) => `${BASE_URL}/products/${id}/default-image`,
      setDefaultImage: (id: string) => `${BASE_URL}/products/${id}/set-default-image`,
    },

    supplier: {
      create: `${BASE_URL}/supplier`,
      list: `${BASE_URL}/supplier`,
      detail: (id: string) => `${BASE_URL}/supplier/${id}`,
      update: (id: string) => `${BASE_URL}/supplier/${id}`,
      delete: (id: string) => `${BASE_URL}/supplier/${id}`,
    },

    invoice: {
      list: `${BASE_URL}/invoices`,
      create: `${BASE_URL}/invoices`,
      detail: (id: string) => `${BASE_URL}/invoices/${id}`,
      update: (id: string) => `${BASE_URL}/invoices/${id}`,
      delete: (id: string) => `${BASE_URL}/invoices/${id}`,
    },

    cart: {
      getCart: `${BASE_URL}/cart`,
      addProductToCart: `${BASE_URL}/cart`,
      deleteCartItem: (id: string) => `${BASE_URL}/cart/${id}`,
      updateCartItem: (id: string) => `${BASE_URL}/cart/${id}`,
    },
    wishlist: {
      list: `${BASE_URL}/wishlists`,
      add: `${BASE_URL}/wishlists`,
      detail: (id: string) => `${BASE_URL}/wishlists/${id}`,
      delete: (id: string) => `${BASE_URL}/wishlists/${id}`,
      deleteByProduct: (productId: string) => `${BASE_URL}/wishlists/product/${productId}`,
    },

    discount: {
      list: `${BASE_URL}/discounts`,
      create: `${BASE_URL}/discounts`,
      detail: (id: string) => `${BASE_URL}/discounts/${id}`,
      update: (id: string) => `${BASE_URL}/discounts/${id}`,
      delete: (id: string) => `${BASE_URL}/discounts/${id}`,
      validate: `${BASE_URL}/discounts/validate`,
      incrementUsage: (id: string) => `${BASE_URL}/discounts/${id}/increment-usage`,
      getByCode: (code: string) => `${BASE_URL}/discounts/code/${code}`,
    },

    order: {
      list: `${BASE_URL}/orders`,
      create: `${BASE_URL}/orders`,
      vnpayReturnUrl: `${BASE_URL}/orders/verify-return-url`,
      myOrders: `${BASE_URL}/orders/me`,
      detail: (id: string) => `${BASE_URL}/orders/${id}`,
      OrderDetailByUserId: (orderId: string) => `${BASE_URL}/orders/me/${orderId}`,
      updateStatus: (id: string) => `${BASE_URL}/orders/${id}/status`,
      userCancel: (id: string) => `${BASE_URL}/orders/${id}/user-cancel`,
      repayment: (id: string) => `${BASE_URL}/orders/${id}/repayment`,
      adminCancel: (id: string) => `${BASE_URL}/orders/${id}/admin-cancel`,
      userConfirmDelivery: (id: string) => `${BASE_URL}/orders/${id}/user-confirm-delivery`,
      userChangePaymentMethod: (id: string) => `${BASE_URL}/orders/${id}/user-change-payment-method`,
    },

    user: {
      list: `${BASE_URL}/users`,
      detail: (id: string) => `${BASE_URL}/users/${id}`,
      updateRole: (id: string) => `${BASE_URL}/users/${id}/role`,
      updateBlock: (id: string) => `${BASE_URL}/users/${id}/block`,
      delete: (id: string) => `${BASE_URL}/users/${id}`,
      restore: (id: string) => `${BASE_URL}/users/${id}/restore`,
    },

    address: {
      list: `${BASE_URL}/addresses`,
      create: `${BASE_URL}/addresses`,
      detail: (id: string) => `${BASE_URL}/addresses/${id}`,
      update: (id: string) => `${BASE_URL}/addresses/${id}`,
      delete: (id: string) => `${BASE_URL}/addresses/${id}`,
      setDefault: (id: string) => `${BASE_URL}/addresses/${id}/default`,
    },

    notification: {
      createNotification: `${BASE_URL}/notifications`,
      getNotificationsUser: `${BASE_URL}/notifications`,
      markAsRead: (id: string) => `${BASE_URL}/notifications/${id}/mark-as-read`,
      markAllAsRead: `${BASE_URL}/notifications/mark-all-as-read`,
      deletedAllRead: `${BASE_URL}/notifications/read`,
      deleteOne: (id: string) => `${BASE_URL}/notifications/${id}`,
    },

    statistics: {
      sales: `${BASE_URL}/statistical/sales`,
      products: `${BASE_URL}/statistical/products`,
      users: `${BASE_URL}/statistical/users`,
      revenue: `${BASE_URL}/statistical/revenue`,
      stock: `${BASE_URL}/statistical/stock`,
      dashboard: `${BASE_URL}/statistical/dashboard`,
    },

    review: {
      create: `${BASE_URL}/reviews`,
      update: (id: string) => `${BASE_URL}/reviews/${id}`,
      delete: (id: string) => `${BASE_URL}/reviews/${id}`,
      adminUpdate: (id: string) => `${BASE_URL}/admin/reviews/${id}`,
      adminDelete: (id: string) => `${BASE_URL}/admin/reviews/${id}`,
    },

    productReturn: {
      create: (orderId: string) => `${BASE_URL}/product-returns/${orderId}`,
      getUserReturns: `${BASE_URL}/product-returns`,
      getAllReturns: `${BASE_URL}/product-returns/admin`,
      updateStatus: (returnId: string) => `${BASE_URL}/product-returns/${returnId}/status`,
      cancel: (returnId: string) => `${BASE_URL}/product-returns/${returnId}/cancel`,
    },
  };
};


export default Endpoint;
