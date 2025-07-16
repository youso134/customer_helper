
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
  createTime: string
  editTime?: string
}
