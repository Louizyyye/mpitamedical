import React from 'react';

const Calendar = ({ mode, selected, onSelect, className }) => {
  // Basic calendar implementation
  return (
    <div className={className}>
      <h2>Select a Date</h2>
      {/* Calendar UI goes here */}
      <button onClick={() => onSelect(new Date())}>Select Today</button>
    </div>
  );
};

export default Calendar;
