import { FormControl, InputLabel, Select as MuiSelect, SelectProps as MuiSelectProps, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<MuiSelectProps, 'onChange'> {
  label?: string;
  options: SelectOption[];
  onChange?: (value: string | number) => void;
}

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  minWidth: 120,
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-asterisk': {
    color: theme.palette.error.main,
  },
}));

export const Select = ({ label, options, onChange, required, ...props }: SelectProps) => {
  return (
    <StyledFormControl fullWidth required={required}>
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <StyledSelect
        label={label}
        onChange={(e) => onChange?.(e.target.value as string | number)}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </StyledFormControl>
  );
};

export default Select;