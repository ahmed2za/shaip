import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useTranslation from '@/hooks/useTranslation';

export interface UserFormData {
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  phone?: string;
}

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: Partial<UserFormData>;
  isEditing?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      phone: '',
      ...initialData,
    },
  });

  React.useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    }
  }, [open, initialData, reset]);

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          {isEditing ? t('users.edit_user') : t('users.new_user')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('forms.required') }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('users.name')}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: t('forms.required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('forms.invalid_email'),
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('users.email')}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('users.phone')}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>{t('users.role')}</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: t('forms.required') }}
                  render={({ field }) => (
                    <Select {...field} label={t('users.role')}>
                      <MenuItem value="user">{t('users.roles.user')}</MenuItem>
                      <MenuItem value="moderator">
                        {t('users.roles.moderator')}
                      </MenuItem>
                      <MenuItem value="admin">{t('users.roles.admin')}</MenuItem>
                    </Select>
                  )}
                />
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>{t('users.status')}</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: t('forms.required') }}
                  render={({ field }) => (
                    <Select {...field} label={t('users.status')}>
                      <MenuItem value="active">
                        {t('users.statuses.active')}
                      </MenuItem>
                      <MenuItem value="suspended">
                        {t('users.statuses.suspended')}
                      </MenuItem>
                      <MenuItem value="pending">
                        {t('users.statuses.pending')}
                      </MenuItem>
                    </Select>
                  )}
                />
                {errors.status && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('actions.cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('actions.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
