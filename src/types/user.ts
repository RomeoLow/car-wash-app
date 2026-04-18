export type UserRole = 'admin' | 'worker' | 'customer';

export interface BaseUser {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
  displayName: string;
}

export interface CustomerProfile extends BaseUser {
  role: 'customer';
  vehicles: {
    plateNumber: string;
    model: string;
  }[];
  loyaltyPoints: number;
}