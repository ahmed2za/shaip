import { styled, alpha } from '@mui/material/styles';
import { TextField, Button, TextFieldProps, ButtonProps, Box, keyframes } from '@mui/material';

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const focusAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

export const ModernTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.95rem',
    
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
    },
    
    '&.Mui-focused': {
      animation: `${focusAnimation} 0.3s ease-in-out`,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  
  '& .MuiInputBase-input': {
    padding: '12px 16px',
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.text.primary, 0.1),
    transition: 'all 0.3s ease-in-out',
  },
  
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    transform: 'translate(14px, 13px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  
  '& .MuiInputBase-multiline': {
    padding: '12px',
  },
}));

export const ModernButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 24px',
  fontSize: '0.9rem',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
    animation: `${floatAnimation} 2s ease-in-out infinite`,
  },
  
  '&:active': {
    transform: 'translateY(1px)',
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    background: alpha(theme.palette.common.white, 0.2),
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s ease-out, height 0.3s ease-out',
  },
  
  '&:active::after': {
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  
  '&.Mui-disabled': {
    backgroundColor: alpha(theme.palette.action.disabled, 0.1),
    color: theme.palette.action.disabled,
  },
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  '& form': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    
    '& > *': {
      animation: `${focusAnimation} 0.5s ease-in-out`,
      animationFillMode: 'backwards',
    },
    
    '& > *:nth-of-type(1)': { animationDelay: '0.1s' },
    '& > *:nth-of-type(2)': { animationDelay: '0.2s' },
    '& > *:nth-of-type(3)': { animationDelay: '0.3s' },
    '& > *:nth-of-type(4)': { animationDelay: '0.4s' },
    '& > *:nth-of-type(5)': { animationDelay: '0.5s' },
  },
}));
