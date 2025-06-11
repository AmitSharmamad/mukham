import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
      // Handle both HH:mm and HH:mm:ss formats
      const timeParts = val.split(':');
      const hours = Number(timeParts[0]);
      const minutes = Number(timeParts[1]);
      const seconds = timeParts[2] ? Number(timeParts[2]) : 0;
      return dayjs().hour(hours).minute(minutes).second(seconds);
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
      : newValue.format('HH:mm:ss');
    
    onChange(formattedValue);
  };

  if (type === 'time') {
    return (
      <TimePicker
        label={label}
        value={dayjsValue}
        onChange={handleChange}
        slotProps={{
          textField: {
            required,
            fullWidth,
          }
        }}
      />
    );
  }

  return (
    <DatePicker
      label={label}
      value={dayjsValue}
      onChange={handleChange}
      slotProps={{
        textField: {
          required,
          fullWidth,
        }
      }}
    />
  );
};

export default DateTimePicker;