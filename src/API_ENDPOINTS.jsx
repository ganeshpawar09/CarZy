const BASE_URL = "http://127.0.0.1:8000"; 

export const API_ENDPOINTS = {
  SEND_OTP: `${BASE_URL}/api/v1/otp/send-otp`,
  VERIFY_OTP: `${BASE_URL}/api/v1/otp/verify-otp`,
  

  UPDATE_NAME: `${BASE_URL}/api/v1/user/update-name`,
  USER_VERIFICATION: `${BASE_URL}/api/v1/user/user-verification`,
  USER_VERIFICATION_CHECK: `${BASE_URL}/api/v1/user/user-verification-check`,
  TESTIMONIALS: `${BASE_URL}/api/v1/user/reviews`,




  CAR_VERIFICATION: `${BASE_URL}/api/v1/car-verification`,
  CAR_VERIFICATION_CHECK: `${BASE_URL}/api/v1/car-verification-check`,
  USER_CARS: `${BASE_URL}/api/v1/user-cars`,
  SEARCH_CARS: `${BASE_URL}/api/v1/search-cars`,
  CAR_DETAILS: `${BASE_URL}/api/v1/car-details`,


  PAYMENTS: `${BASE_URL}/api/v1/user/payments`,
  PENALTIES: `${BASE_URL}/api/v1/user/penalties`,
  REFUNDS: `${BASE_URL}/api/v1/user/refunds`,
  COUPONS: `${BASE_URL}/api/v1/user/coupons`,
  PAYOUTS: `${BASE_URL}/api/v1/user/payouts`,

  SYSTEM_REVIEW: `${BASE_URL}/api/v1/user/get-system_review/{user_id}`,
  SYSTEM_REVIEW_POST: `${BASE_URL}/api/v1/user/post-system-review`,

  COUPON_APPLY: `${BASE_URL}/api/v1/booking/coupon`,
 


  CHANGE_VISIBILITY: `${BASE_URL}/api/v1/change-visibility`,

  CAR_BOOKING: `${BASE_URL}/api/v1/booking/booking`,
  MY_BOOKING: `${BASE_URL}/api/v1/booking/my-bookings`,
  MY_CAR_BOOKING: `${BASE_URL}/api/v1/booking/my-car-bookings`,
  BOOKING_CANCEL: `${BASE_URL}/api/v1/booking/cancel`,
  MY_CAR_BOOKING_CANCEL: `${BASE_URL}/api/v1/booking/cancel-by-owner`,

  
  CAR_PICKUP: `${BASE_URL}/api/v1/booking/pickup`,
  CAR_DROP: `${BASE_URL}/api/v1/booking/drop`,


  CREATE_RAZORPAY_ORDER: `${BASE_URL}/api/v1/booking/create-razorpay-order`,
  VERIFY_PAYMENT: `${BASE_URL}/api/v1/booking/verify-payment`,

  CLAIM_REFUND: `${BASE_URL}/api/v1/user/claim-refund`,
  PAY_PENALTY: `${BASE_URL}/api/v1/user/pay-penalty`,

  CLAIM_PAYOUT: `${BASE_URL}/api/v1/user/claim-payout`,

 




  
};
