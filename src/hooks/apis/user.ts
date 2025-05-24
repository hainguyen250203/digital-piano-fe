import { QueryKey } from "@/models/QueryKey";
import { fetchDeleteUser, fetchRestoreUser, fetchUpdateBlockStatus, fetchUpdateRole, fetchUserList, Role } from "@/services/apis/user";
import { BaseResponse } from "@/types/base-response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Export Role enum for components
export { Role };

export interface UserData {
  id: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  role: Role;
  isBlock: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Use type alias instead of empty interface extension
export type UserListResponse = BaseResponse<UserData[]>;

export interface UpdateRoleData {
  role: Role;
}

export interface UpdateBlockStatusData {
  isBlock: boolean;
}

// Get all users
export const useFetchUserList = () => {
  return useQuery<UserListResponse, Error>({
    queryKey: [QueryKey.USER_LIST],
    queryFn: fetchUserList,
  });
};



// Update user role
export const useFetchUpdateRole = (options?: {
  onSuccess?: (data: BaseResponse<UserData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) => fetchUpdateRole(id, data),
    onSuccess: (data: BaseResponse<UserData>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error | BaseResponse<null>) => {
      if (options?.onError) {
        options.onError({
          message: 'message' in error ? error.message : 'Failed to update user role',
          errorCode: 'errorCode' in error ? error.errorCode as number : 500,
          data: null
        });
      }
    }
  });
};

// Update user block status
export const useFetchUpdateBlockStatus = (options?: {
  onSuccess?: (data: BaseResponse<UserData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlockStatusData }) => fetchUpdateBlockStatus(id, data),
    onSuccess: (data: BaseResponse<UserData>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error | BaseResponse<null>) => {
      if (options?.onError) {
        options.onError({
          message: 'message' in error ? error.message : 'Failed to update user block status',
          errorCode: 'errorCode' in error ? error.errorCode as number : 500,
          data: null
        });
      }
    }
  });
};

// Delete user
export const useFetchDeleteUser = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchDeleteUser(id),
    onSuccess: (data: BaseResponse<null>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error | BaseResponse<null>) => {
      if (options?.onError) {
        options.onError({
          message: 'message' in error ? error.message : 'Failed to delete user',
          errorCode: 'errorCode' in error ? error.errorCode as number : 500,
          data: null
        });
      }
    }
  });
};

// Restore user
export const useFetchRestoreUser = (options?: {
  onSuccess?: (data: BaseResponse<UserData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchRestoreUser(id),
    onSuccess: (data: BaseResponse<UserData>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error | BaseResponse<null>) => {
      if (options?.onError) {
        options.onError({
          message: 'message' in error ? error.message : 'Failed to restore user',
          errorCode: 'errorCode' in error ? error.errorCode as number : 500,
          data: null
        });
      }
    }
  });
};
