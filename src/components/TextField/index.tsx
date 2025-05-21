import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputLabel-asterisk': {
    color: theme.palette.error.main,
  },
}));

export const TextField = (props: TextFieldProps) => {
  // If the field is required, ensure the label shows an asterisk
  const { required, label, ...rest } = props;

  return <StyledTextField required={required} label={label} {...rest} />;
};

export default TextField;