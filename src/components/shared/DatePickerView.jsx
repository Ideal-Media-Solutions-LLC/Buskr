import DatePicker from 'react-datepicker';

const DatePickerView = (props) => {
  return (
    <div className='datepicker-container'>
      <DatePicker 
        className={props.className}
        selected={props.selected}
        onChange={props.onChange}
        placeholderText={props.placeholderText}
        showTimeSelect={props.showTimeSelect}
        dateFormat={props.dateFormat}
        calendarIcon={null}
      />
    </div>
  );
};

export default DatePickerView;