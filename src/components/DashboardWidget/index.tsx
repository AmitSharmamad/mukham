import { Typography, Box } from '@mui/material';
import { Card } from '../Card';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  href?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  isPercentage?: boolean;
  isCurrency?: boolean;
}

export const DashboardWidget = ({ 
  title, 
  value, 
  subtitle, 
  href,
  valuePrefix,
  valueSuffix,
  isPercentage = false,
  isCurrency = false
}: DashboardWidgetProps) => {
  
  // Format the value based on type
  const formattedValue = (): string => {
    if (typeof value === 'string') return value;
    
    if (isPercentage) {
      return `${valuePrefix || ''}${value.toFixed(2)}${valueSuffix || '%'}`;
    }
    
    if (isCurrency) {
      return `${valuePrefix || '$'}${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}${valueSuffix || ''}`;
    }
    
    if (typeof value === 'number') {
      return `${valuePrefix || ''}${value.toLocaleString()}${valueSuffix || ''}`;
    }
    
    return 'N/A';
  };

  return (
    <Card
      href={href}
      sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        cursor: href ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': href ? {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 8px 16px rgba(0, 0, 0, 0.5)' 
            : '0 8px 16px rgba(0, 0, 0, 0.1)',
        } : {},
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mb: subtitle ? 1 : 0 }}>
          {formattedValue()}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default DashboardWidget;