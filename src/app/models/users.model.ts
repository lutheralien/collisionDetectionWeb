export interface ILogin {
  email: string;
  password: string;
}

export interface ISendOtp {
  email: any;
}


export enum EUserRoles {
  "ADMIN" = "ADMIN",
  "SUPER-ADMIN" = "SUPER-ADMIN",
  "SELLER" = "SELLER"
}



export const RoleList: Array<{ [x: string]: string }> = [
  { mame: 'Super Admin', value: 'SUPER-ADMIN' },
  { name: 'Admin', value: 'ADMIN' },
];

export const PermissionList: Array<{ [x: string]: string }> = [
  { name: 'Create Project', value: 'CREATE-PROJECT' },
  { name: 'Edit Project', value: 'EDIT-PROJECT' },
  { name: 'Delete Project', value: 'DELETE-PROJECT' },
  { name: 'Create center', value: 'CREATE-CENTER' },
  { name: 'Delete center', value: 'DELETE-CENTER' },
  { name: 'Update center', value: 'UPDATE-CENTER' },
  { name: 'Add Trade', value: 'ADD-TRADE' },
  { name: 'Delete Trade', value: 'DELETE-TRADE' },
  { name: 'Edit Trade', value: 'EDIT-TRADE' },
  { name: 'Add Trade Modules', value: 'ADD-TRADE-MODULES' },
  { name: 'Edit Trade Modules', value: 'EDIT-TRADE-MODULES' },
  { name: 'Delete Trade Modules', value: 'DELETE-TRADE-MODULES' },
  { name: 'Create Batch', value: 'CREATE-BATCH' },
  { name: 'Delete Batch', value: 'DELETE-BATCH' },
  { name: 'Update Batch', value: 'UPDATE-BATCH' },
  { name: 'Add Beneficiary', value: 'ADD-BENEFICIARY' },
  { name: 'Edit Beneficiary', value: 'EDIT-BENEFICIARY' },
  { name: 'Delete Beneficiary', value: 'DELETE-BENEFICIARY' },
  { name: 'Add User', value: 'ADD-USER' },
  { name: 'Edit User', value: 'EDIT-USER' },
  { name: 'Delete User', value: 'DELETE-USER' },
  { name: 'Create Assessment', value: 'CREATE-ASSESSMENT' },
  { name: 'Edit Assessment', value: 'EDIT-ASSESSMENT' },
  { name: 'Delete Assessment', value: 'DELETE-ASSESSMENT' },
  { name: 'Add Attendance', value: 'ADD-ATTENDANCE' },
  { name: 'Edit Attendance', value: 'EDIT-ATTENDANCE' },
  { name: 'Delete Attendance', value: 'DELETE-ATTENDANCE' },
  { name: 'Add Activity', value: 'ADD-ACTIVITY' },
  { name: 'Edit Activity', value: 'EDIT-ACTIVITY' },
  { name: 'Delete Activity', value: 'DELETE-ACTIVITY' },
  { name: 'Send Sms', value: 'SEND-SMS' },
  { name: 'Create Sms Tempates', value: 'CREATE-SMS-TEMPLATE' },
  { name: 'Edit Sms Templates', value: 'EDIT-SMS-TEMPLATE' },
  { name: 'View Dashboard', value: 'VIEW-DASHBOARD' },
  { name: 'View Centers', value: 'VIEW-CENTERS' },
  { name: 'Edit Center', value: 'EDIT-CENTER' },
  { name: 'View Project', value: 'VIEW-PROJECT' },
  { name: 'View Trades', value: 'VIEW-TRADES' },
  { name: 'View Modules', value: 'VIEW-MODULES' },
  { name: 'View Batches', value: 'VIEW-BATCHES' },
  { name: 'View Beneficiaries', value: 'VIEW-BENEFICIARIES' },
  { name: 'View User Management', value: 'VIEW-USER-MANAGEMENT' },
  { name: 'View Attendance', value: 'VIEW-ATTENDANCE' },
  { name: 'View Activities', value: 'VIEW-ACTIVITIES' },
  { name: 'View Beneficiary Reports', value: 'VIEW-REPORTS' },
  { name: 'View Trainers Reports', value: 'VIEW-REPORTS' },
  { name: 'View Sms', value: 'VIEW-SMS' },
  { name: 'View Assessment', value: 'VIEW-ASSESSMENTS' },
  { name: 'View Profile', value: 'VIEW-PROFILE' },
];
