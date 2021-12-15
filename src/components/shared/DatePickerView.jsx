import React from 'react';
import DatePicker from 'react-datepicker';

const DatePickerView = (props) => {
  return (
    <DatePicker
      className={props.className}
      selected={props.selected}
      onChange={props.onChange}
      placeholderText={props.placeholderText}
      showTimeSelect={props.showTimeSelect}
      dateFormat={props.dateFormat}
      calendarIcon={null}
    />
  );
};

export default DatePickerView;
