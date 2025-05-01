import { Typography } from '@mui/material';
import { Card } from '../Card';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  href?: string;
}

export const DashboardWidget = ({ title, value, subtitle, href }: DashboardWidgetProps) => {
  const content = (
    <Card
      href={href}
      sx={{ 
        p: 3,
        height: '100%',
        cursor: href ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': href ? {
          transform: 'translateY(-4px)',
        } : {},
      }}
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mb: subtitle ? 1 : 0 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Card>
  );

  return content;
};

export default DashboardWidget;