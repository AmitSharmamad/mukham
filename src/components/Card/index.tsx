import { Card as MuiCard, CardProps as MuiCardProps, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CardProps extends MuiCardProps {
  elevation?: number;
  href?: string;
}

const StyledCard = styled(MuiCard)<CardProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

export const Card = ({ children, href, ...props }: CardProps) => {
  // Configure the card props depending on whether it's being used as a link
  const cardProps = {
    ...props,
    component: href ? 'a' : props.component || 'div',
    ...(href && { href, sx: { textDecoration: 'none', ...props.sx } })
  };

  return (
    <StyledCard {...cardProps}>
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default Card;