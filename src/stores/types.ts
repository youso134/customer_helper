
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
  did?: number,
	consumerId?: number,
	clientId?: number,
	content?: string,
  role?: string,
	sensitiveReason?: string | null,
	editTime?: string,
	createTime?: string,
  type?: 'C' | 'U'
}

export interface DialogueItem {
	did:number,
	consumerId:Number,
	clientId:Number,
	type:string,
	resume:string,
	highlight:string,
  createTime: string,
  editTime?: string
}
export interface Type {
	tid:number,
	type:string,
  createTime?: string,
  editTime?: string,
}

export interface Register {
  userName?:string,
  userAccount: string,
  userPassword?: string,
  confirmPassword?: string,
  gender?: 'male'|'female',
  phone?: '13800000000',
  email?: '123@qq.com';
}

export interface updated {
  uid?:number;
  userName?: string;    
  avatar?: string;     
  gender?: "male"|"female"|"other"; 
  phone?: number;     
  email?: string;
  userPassword: string;
  userNewPassword?: string;      
}
