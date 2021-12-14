import DatePicker from 'react-datepicker';

const DatePickerView = (props) => {
  return (
    <div className='datepicker-container'>
      <DatePicker 
        selected={props.selected}
        onChange={props.onChange}
        placeholderText={props.placeholderText}
        showTimeSelect={props.showTimeSelect}
        dateFormat={props.dateFormat}
      />
    </div>
  );
};

export default DatePickerView;