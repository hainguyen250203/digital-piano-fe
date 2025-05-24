'use client';

import UserList from '@/components/admin/user/user-list';
import { Box } from '@mui/material';

export default function UsersPage() {
  return (
    <Box height='100vh' width='100%'>
      <UserList />
    </Box>
  )
} 