import { UpdateBlockStatusData, UpdateRoleData, UserData } from '@/hooks/apis/user';
import API from '@/services/axios';
import { Endpoint } from '@/services/endpoint';
import { BaseResponse } from '@/types/base-response';
export type { UpdateBlockStatusData, UpdateRoleData };

export enum Role {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export const fetchUserList = async (): Promise<BaseResponse<UserData[]>> => {
  const { data } = await API.get(Endpoint().user.list);
  return data;
};

export const fetchUserById = async (id: string): Promise<BaseResponse<UserData>> => {
  const { data } = await API.get(Endpoint().user.detail(id));
  return data;
};

export const fetchUpdateRole = async (id: string, updateRoleData: UpdateRoleData): Promise<BaseResponse<UserData>> => {
  const { data } = await API.patch(Endpoint().user.updateRole(id), updateRoleData);
  return data;
};

export const fetchUpdateBlockStatus = async (id: string, updateBlockData: UpdateBlockStatusData): Promise<BaseResponse<UserData>> => {
  const { data } = await API.patch(Endpoint().user.updateBlock(id), updateBlockData);
  return data;
};

export const fetchDeleteUser = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().user.delete(id));
  return data;
};

export const fetchRestoreUser = async (id: string): Promise<BaseResponse<UserData>> => {
  const { data } = await API.patch(Endpoint().user.restore(id));
  return data;
};

