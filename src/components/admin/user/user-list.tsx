'use client'

import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import UpdateUserRoleModal from '@/components/admin/user/update-user-role-modal'
import { Role, UpdateBlockStatusData, UserData, useFetchDeleteUser, useFetchRestoreUser, useFetchUpdateBlockStatus, useFetchUserList } from '@/hooks/apis/user'
import { QueryKey } from '@/models/QueryKey'
import BlockIcon from '@mui/icons-material/Block'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function UserList() {
  // States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch user data
  const { data: userResponse, isLoading } = useFetchUserList()

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    const users = userResponse?.data || []
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()
    return users.filter((user: UserData) => user.email.toLowerCase().includes(query) || user.phoneNumber.includes(query))
  }, [userResponse?.data, searchQuery])

  // Block/unblock user mutation
  const { mutate: updateBlockStatus, isPending: isBlockStatusPending } = useFetchUpdateBlockStatus({
    onSuccess: () => {
      toast.success(`${selectedUser?.isBlock ? 'Mở khóa' : 'Khóa'} người dùng thành công!`)
      handleCloseBlockDialog()
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật trạng thái người dùng thất bại')
    }
  })

  // Delete user mutation
  const { mutate: deleteUser, isPending: isDeleteUserPending } = useFetchDeleteUser({
    onSuccess: () => {
      toast.success('Xóa người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] })
      handleCloseDeleteDialog()
    },
    onError: error => {
      toast.error(error.message || 'Xóa người dùng thất bại')
    }
  })

  // Restore user mutation
  const { mutate: restoreUser, isPending: isRestoreUserPending } = useFetchRestoreUser({
    onSuccess: () => {
      toast.success('Khôi phục người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] })
      handleCloseRestoreDialog()
    },
    onError: error => {
      toast.error(error.message || 'Khôi phục người dùng thất bại')
    }
  })

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setPage(0) // Reset to first page when search changes
  }

  // Role update modal handlers
  const handleOpenRoleModal = (user: UserData) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
  }

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false)
    setSelectedUser(null)
  }

  // Block/unblock handlers
  const handleOpenBlockDialog = (user: UserData) => {
    setSelectedUser(user)
    setIsBlockDialogOpen(true)
  }

  const handleCloseBlockDialog = () => {
    setIsBlockDialogOpen(false)
    setSelectedUser(null)
  }

  const handleConfirmBlockToggle = () => {
    if (!selectedUser) return

    const data: UpdateBlockStatusData = {
      isBlock: !selectedUser.isBlock
    }

    updateBlockStatus({
      id: selectedUser.id,
      data
    })
  }

  // Delete handlers
  const handleOpenDeleteDialog = (user: UserData) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedUser) return
    deleteUser(selectedUser.id)
  }

  // Restore handlers
  const handleOpenRestoreDialog = (user: UserData) => {
    setSelectedUser(user)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedUser(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedUser) return
    restoreUser(selectedUser.id)
  }

  // Format date helper
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  // Get role color
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'error'
      case Role.STAFF:
        return 'warning'
      default:
        return 'primary'
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Quản lý người dùng</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size='small'
            placeholder='Tìm kiếm người dùng...'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='user table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Điện thoại</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                <TableRow
                  key={user.id}
                  sx={{
                    'backgroundColor': user.isDeleted ? 'rgba(244, 67, 54, 0.08)' : user.isBlock ? 'rgba(255, 152, 0, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: user.isDeleted ? 'rgba(244, 67, 54, 0.12)' : user.isBlock ? 'rgba(255, 152, 0, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.role === Role.ADMIN
                          ? 'Quản trị viên'
                          : user.role === Role.STAFF
                          ? 'Nhân viên'
                          : 'Khách hàng'
                      }
                      color={getRoleColor(user.role)}
                      size='small'
                      variant='outlined'
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.isDeleted
                          ? 'Đã xóa'
                          : user.isBlock
                          ? 'Đã khóa'
                          : 'Hoạt động'
                      }
                      color={user.isDeleted ? 'error' : user.isBlock ? 'warning' : 'success'}
                      size='small'
                      variant='outlined'
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate(new Date(user.createdAt))}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!user.isDeleted && (
                        <>
                          <Tooltip title='Quản lý vai trò'>
                            <Button
                              variant='contained'
                              color='primary'
                              size='small'
                              onClick={() => handleOpenRoleModal(user)}
                              startIcon={<ManageAccountsIcon />}
                            >
                              Vai trò
                            </Button>
                          </Tooltip>

                          <Tooltip title={user.isBlock ? 'Mở khóa người dùng' : 'Khóa người dùng'}>
                            <Button
                              variant='contained'
                              color={user.isBlock ? 'success' : 'warning'}
                              size='small'
                              onClick={() => handleOpenBlockDialog(user)}
                              startIcon={user.isBlock ? <LockOpenIcon /> : <BlockIcon />}
                            >
                              {user.isBlock ? 'Mở khóa' : 'Khóa'}
                            </Button>
                          </Tooltip>

                          <Tooltip title='Xóa người dùng'>
                            <Button
                              variant='contained'
                              color='error'
                              size='small'
                              onClick={() => handleOpenDeleteDialog(user)}
                            >
                              Xóa
                            </Button>
                          </Tooltip>
                        </>
                      )}

                      {user.isDeleted && (
                        <Tooltip title='Khôi phục người dùng'>
                          <Button
                            variant='contained'
                            color='success'
                            size='small'
                            onClick={() => handleOpenRestoreDialog(user)}
                            startIcon={<RestoreIcon />}
                          >
                            Khôi phục
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    {searchQuery ? 'Không tìm thấy người dùng phù hợp' : 'Không có người dùng nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Role update modal */}
      {selectedUser && (
        <UpdateUserRoleModal
          open={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          user={selectedUser}
        />
      )}

      {/* Block/unblock confirmation dialog */}
      <DeleteConfirmationDialog
        open={isBlockDialogOpen}
        onClose={handleCloseBlockDialog}
        onConfirm={handleConfirmBlockToggle}
        title={selectedUser?.isBlock ? 'Mở khóa người dùng' : 'Khóa người dùng'}
        message={
          selectedUser?.isBlock
            ? `Bạn có chắc chắn muốn mở khóa người dùng "${selectedUser?.email}"?`
            : `Bạn có chắc chắn muốn khóa người dùng "${selectedUser?.email}"? Người dùng sẽ không thể đăng nhập khi bị khóa.`
        }
        isDeleting={isBlockStatusPending}
        confirmButtonText={selectedUser?.isBlock ? 'Mở khóa' : 'Khóa'}
        confirmButtonColor={selectedUser?.isBlock ? 'success' : 'warning'}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa người dùng'
        message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.email}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleteUserPending}
      />

      {/* Restore confirmation dialog */}
      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục người dùng'
        message={`Bạn có chắc chắn muốn khôi phục người dùng "${selectedUser?.email}"?`}
        isDeleting={isRestoreUserPending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </Box>
  )
}
