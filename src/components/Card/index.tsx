import { Card as MuiCard, CardProps as MuiCardProps, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CardProps extends MuiCardProps {
  elevation?: number;
}

const StyledCard = styled(MuiCard)<CardProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <StyledCard {...props}>
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default Card;