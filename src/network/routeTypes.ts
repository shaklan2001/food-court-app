export type ApiType =
  "CREATE_USER" |
  "UPLOAD_STUDENT_ID" |
  "SIGN_IN_EMAIL" |
  "VALIDATE_TOKEN" |
  "REFRESH_TOKEN" |
  "GET_MENU" |
  "ADD_TO_CART" |
  "GET_CART" |
  "UPDATE_CART" |
  "CLEAR_CART" |
  "BILLING_PUSH" |
  "GET_ALL_COUPONS";
  

export type TransactionIntentType =
  "intent_create_user" |
  "intent_upload_student_id" |
  "intent_sign_in_email" |
  "intent_validate_token" |
  "intent_refresh_token" |
  "intent_get_menu" |
  "intent_add_to_cart" |
  "intent_get_cart" |
  "intent_update_cart" |
  "intent_clear_cart" |
  "intent_billing_push" |
  "intent_get_all_coupons";

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderPaise: number;
  maxDiscountPaise: number;
  createdAt: string;
  updatedAt: string;
}
