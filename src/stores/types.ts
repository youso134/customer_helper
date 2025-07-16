
export interface User {
  uid?: number;
  userAccount: string;
  userPassword?: string;
  userName?: string;
  userRole?: string;
  editTime?: string;
  createTime?: string;
}

export interface Chat {
  cid?: number,
	consumerId?: number,
	clientId?: number,
	content?: string,
	highLight?: string,
	sensitiveWord?: string,
	position?: string,
	editTime?: string,
	createTime?: string,
	type?: string
}

export interface Register {
  uid?: number,
  userName?:string,
  userAccount: string,
  userPassword?: string,
  confirmPassword?: string,
  gender?: 'male'|'female',
  phone?: '',
  email?: '';
}

export interface updated {
  username?: string;  
  userRole?: string;   
  avatar?: string;     
  gender?: "male" | "female" |"unknown";
  phone?: string;     
  email?: string;      
}