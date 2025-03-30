import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends MuiButtonProps {
  elevation?: number;
}

const StyledButton = styled(MuiButton)<ButtonProps>(({ theme, elevation = 0 }) => ({
  boxShadow: elevation ? theme.shadows[elevation] : 'none',
  '&:hover': {
    boxShadow: elevation ? theme.shadows[elevation + 1] : 'none',
  },
}));

export const Button = (props: ButtonProps) => {
  return <StyledButton {...props} />;
};

export default Button;