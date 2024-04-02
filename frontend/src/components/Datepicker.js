import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone"; // Import Moment.js with timezone support

function Datepicker({ onChange, value }) {
  // Function to handle date change
  const handleDateChange = (date) => {
    // Convert the selected date to MST timezone
    const mstDate = moment(date).tz("America/Denver").toDate();
    // Call the parent component's onChange function with the adjusted date
    onChange(mstDate);
  };

  return (
    <div className="p-5">
      <DatePicker
        selected={value}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="yyyy-MM-dd hh:mm aa" // Use lowercase 'hh' for 12-hour format and 'aa' for AM/PM indication
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        className="form-control"
      />
    </div>
  );
}

export default Datepicker;
