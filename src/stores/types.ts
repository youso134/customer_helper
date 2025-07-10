
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
