export interface IState {
  loading: boolean;
  user: any;
  admins: any;
  admin: any;
  programs: any;
  questions: any;
  question: any;
  orders: any,
  order: any,
  customers: any,
  plans: any,
  examinations: any,
  transactions: any,
  transaction: any,
  customer: any,
  token: string;
  refreshToken: string;
  roles: any[];
  permissions: Array<any>;
  adminPermissions: any;
  documents: Array<any>;
  isAuthenticated: boolean;
  courses: any;
}

export interface IOtpState {
  id: string;
  email: string;
  otp: string;
  expires: string;
}

export interface IDocument {
  name: string;
  data: string;
  type: string;
}
