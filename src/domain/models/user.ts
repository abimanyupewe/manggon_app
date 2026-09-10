/**
 * Domain Models for Tenant User & Property
 * Based on MOBILE_API_CONTRACT.md
 */

export interface BankAccountInfo {
  bank: string;
  account_number: string;
  account_holder: string;
}

export interface TenantProperty {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  facilities: string[];
  bank_account_info: BankAccountInfo | null;
}

export interface TenantRoom {
  id: number;
  room_number: string;
  floor: number;
  price: number;
  facilities: string[];
}

export interface TenantProfileDetail {
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  identity_card_number: string | null;
  entry_date: string | null;
  exit_date: string | null;
}

export interface TenantUser {
  id: number;
  name: string;
  username: string;
  email: string | null;
  phone_number: string | null;
  role: 'tenant';
  must_change_password: boolean;
  is_active: boolean;
  property: TenantProperty | null;
  room: TenantRoom | null;
  profile: TenantProfileDetail | null;
}

export interface UpdateProfileRequest {
  phone_number?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
}
