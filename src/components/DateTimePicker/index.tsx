import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

interface DateTimePickerProps {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  type?: 'date' | 'time';
  required?: boolean;
  fullWidth?: boolean;
}

export const DateTimePicker = ({
  label,
  value,
  onChange,
  type = 'date',
  required = false,
  fullWidth = false,
}: DateTimePickerProps) => {
  // Convert the string value to a Dayjs object
  const parseValue = (val: string | null): Dayjs | null => {
    if (!val) return null;
    
    // For time values, we need to create a valid date with the time
    if (type === 'time') {
      const [hours, minutes] = val.split(':');
      return dayjs().hour(Number(hours)).minute(Number(minutes));
    }
    
    return dayjs(val);
  };

  const dayjsValue = parseValue(value);

  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue) {
      onChange(null);
      return;
    }

    // Format the value based on the type
    const formattedValue = type === 'date' 
      ? newValue.format('YYYY-MM-DD')
      : newValue.format('HH:mm');
    
    onChange(formattedValue);
  };

  if (type === 'time') {
    return (
      <TimePicker
        label={label}
        value={dayjsValue}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            fullWidth={fullWidth}
          />
        )}
      />
    );
  }

  return (
    <DatePicker
      label={label}
      value={dayjsValue}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          fullWidth={fullWidth}
        />
      )}
    />
  );
};

export default DateTimePicker;