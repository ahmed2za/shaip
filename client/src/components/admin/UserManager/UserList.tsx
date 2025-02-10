import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { UserForm, UserFormData } from './UserForm';
import useTranslation from '@/hooks/useTranslation';
import axios from '@/utils/axios';
import { logger } from '@/utils/logger';
import { useNotification } from '@/hooks/useNotification';

interface User extends UserFormData {
  id: string;
  createdAt: string;
  lastLogin?: string;
}

export const UserList: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/users');
      setUsers(data);
    } catch (error) {
      logger.error('UserList', 'Failed to load users', error);
      showNotification('error', t('messages.error'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await axios.post('/api/users', data);
      showNotification('success', t('users.messages.created'));
      loadUsers();
    } catch (error) {
      logger.error('UserList', 'Failed to create user', error);
      showNotification('error', t('messages.error'));
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    try {
      await axios.put(`/api/users/${selectedUser.id}`, data);
      showNotification('success', t('users.messages.updated'));
      loadUsers();
    } catch (error) {
      logger.error('UserList', 'Failed to update user', error);
      showNotification('error', t('messages.error'));
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm(t('messages.confirm_delete'))) {
      try {
        await axios.delete(`/api/users/${id}`);
        showNotification('success', t('users.messages.deleted'));
        loadUsers();
      } catch (error) {
        logger.error('UserList', 'Failed to delete user', error);
        showNotification('error', t('messages.error'));
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await axios.patch(`/api/users/${user.id}/status`, { status: newStatus });
      showNotification('success', t('users.messages.status_updated'));
      loadUsers();
    } catch (error) {
      logger.error('UserList', 'Failed to update user status', error);
      showNotification('error', t('messages.error'));
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('users.name'), flex: 1 },
    { field: 'email', headerName: t('users.email'), flex: 1 },
    {
      field: 'role',
      headerName: t('users.role'),
      width: 120,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={t(`users.roles.${params.value}`)}
          color={
            params.value === 'admin'
              ? 'error'
              : params.value === 'moderator'
              ? 'warning'
              : 'default'
          }
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: t('users.status'),
      width: 120,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={t(`users.statuses.${params.value}`)}
          color={
            params.value === 'active'
              ? 'success'
              : params.value === 'suspended'
              ? 'error'
              : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('actions.title'),
      width: 150,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Box>
          <Tooltip title={t('actions.edit')}>
            <IconButton
              onClick={() => {
                setSelectedUser(params.row);
                setIsFormOpen(true);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              params.row.status === 'active'
                ? t('users.actions.suspend')
                : t('users.actions.activate')
            }
          >
            <IconButton
              onClick={() => handleToggleStatus(params.row)}
              size="small"
              color={params.row.status === 'active' ? 'error' : 'success'}
            >
              {params.row.status === 'active' ? (
                <BlockIcon />
              ) : (
                <CheckCircleIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton
              onClick={() => handleDeleteUser(params.row.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h1">
          {t('users.title')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
        >
          {t('users.new_user')}
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={users}
            columns={columns}
            loading={loading}
            autoHeight
            components={{ Toolbar: GridToolbar }}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
          />
        </CardContent>
      </Card>

      <UserForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        initialData={selectedUser || undefined}
        isEditing={!!selectedUser}
      />
    </>
  );
};

export default UserList;
