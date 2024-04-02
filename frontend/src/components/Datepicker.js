import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Datepicker() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="p-5">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect
        dateFormat="yyyy-MM-dd hh:mm aa" // Use lowercase 'hh' for 12-hour format and 'aa' for AM/PM indication
        timeFormat="HH:mm" // Use 'HH:mm' for 24-hour format, 'hh:mm aa' for 12-hour format with AM/PM indication
        timeIntervals={15}
        timeCaption="Time"
        className="form-control"
      />
    </div>
  );
}

export default Datepicker;
