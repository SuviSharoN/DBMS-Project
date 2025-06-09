// Timetable Component: Displays class schedules for different batches and departments
// Features: Interactive batch selection, period-wise class display, and visual distinction for theory/lab classes

// src/Components/TimeTable.jsx
import React, { useState, useEffect } from 'react';

// --- Mock Data & Definitions ---
// NOTE: Replace this with actual data fetching in a real application.
const TIMETABLE_DATA = {
  "CSE Batch N (Year 2 - Sem 4)": { // Example: 3rd Year
    Monday: [ { start: "8:30", end: "10:15", subject: "Advanced Algorithms", code: "CS301", type: 'theory', location: 'R101' }, { start: "10:30", end: "12:15", subject: "Operating Systems II", code: "CS305", type: 'theory', location: 'R102' }, { start: "1:10", end: "2:55", subject: "Adv. Algorithms Lab", code: "CS301L", type: 'lab', location: 'Lab A' }, { start: "3:10", end: "4:55", subject: "Compiler Design", code: "CS451", type: 'theory', location: 'R101' }, ],
    Tuesday: [ { start: "8:30", end: "10:15", subject: "Quantum Physics", code: "PH501", type: 'theory', location: 'R205' }, { start: "10:30", end: "12:15", subject: "OS II Lab", code: "CS305L", type: 'lab', location: 'Lab B' }, { start: "1:10", end: "2:55", subject: "Linear Algebra", code: "MA410", type: 'theory', location: 'R103' }, { start: "3:10", end: "4:00", subject: "Technical Comm.", code: "HU201", type: 'theory', location: 'R105' }, ],
    Wednesday: [ { start: "8:30", end: "9:20", subject: "Advanced Algorithms", code: "CS301", type: 'theory', location: 'R101' }, { start: "9:25", end: "11:20", subject: "Compiler Design Lab", code: "CS451L", type: 'lab', location: 'Lab C' }, { start: "11:25", end: "12:15", subject: "Operating Systems II", code: "CS305", type: 'theory', location: 'R102' }, { start: "1:10", end: "2:55", subject: "Quantum Physics", code: "PH501", type: 'theory', location: 'R205' }, { start: "3:10", end: "4:55", subject: "Linear Algebra", code: "MA410", type: 'theory', location: 'R103' }, ],
    Thursday: [ { start: "8:30", end: "10:15", subject: "Compiler Design", code: "CS451", type: 'theory', location: 'R101' }, { start: "10:30", end: "11:20", subject: "Advanced Algorithms", code: "CS301", type: 'theory', location: 'R101' }, { start: "11:25", end: "12:15", subject: "Quantum Physics", code: "PH501", type: 'theory', location: 'R205' }, { start: "1:10", end: "2:00", subject: "Operating Systems II", code: "CS305", type: 'theory', location: 'R102' }, { start: "2:05", end: "2:55", subject: "Technical Comm.", code: "HU201", type: 'theory', location: 'R105' }, ],
    Friday: [ { start: "8:30", end: "10:15", subject: "Quantum Physics Lab", code: "PH501L", type: 'lab', location: 'Lab D' }, { start: "10:30", end: "12:15", subject: "Linear Algebra Lab", code: "MA410L", type: 'lab', location: 'Lab E' }, { start: "1:10", end: "2:00", subject: "Quantum Physics", code: "PH501", type: 'theory', location: 'R205' }, ],
  },
  "CSE Batch P (Year 2 - Sem 4)": { // Example: 2nd Year
    Monday: [ { start: "8:30", end: "10:15", subject: "Data Structures", code: "CS201", type: 'theory', location: 'R201' }, { start: "10:30", end: "11:20", subject: "Discrete Maths", code: "MA202", type: 'theory', location: 'R202' }, { start: "11:25", end: "12:15", subject: "Digital Logic", code: "EE201", type: 'theory', location: 'R203' }, { start: "1:10", end: "2:55", subject: "Data Structures Lab", code: "CS201L", type: 'lab', location: 'Lab F' }, { start: "3:10", end: "4:55", subject: "OOP with Java", code: "CS205", type: 'theory', location: 'R201' }, ],
    Tuesday: [ { start: "8:30", end: "10:15", subject: "OOP with Java", code: "CS205", type: 'theory', location: 'R201' }, { start: "10:30", end: "12:15", subject: "Digital Logic Lab", code: "EE201L", type: 'lab', location: 'Lab G' }, { start: "1:10", end: "2:00", subject: "Discrete Maths", code: "MA202", type: 'theory', location: 'R202' }, { start: "2:05", end: "2:55", subject: "Data Structures", code: "CS201", type: 'theory', location: 'R201' }, { start: "3:10", end: "4:55", subject: "Environmental Sci.", code: "CY201", type: 'theory', location: 'R204' }, ],
    Wednesday: [ { start: "8:30", end: "10:15", subject: "Digital Logic", code: "EE201", type: 'theory', location: 'R203' }, { start: "10:30", end: "12:15", subject: "OOP with Java Lab", code: "CS205L", type: 'lab', location: 'Lab H' }, { start: "1:10", end: "2:00", subject: "Data Structures", code: "CS201", type: 'theory', location: 'R201' }, { start: "2:05", end: "2:55", subject: "Discrete Maths", code: "MA202", type: 'theory', location: 'R202' }, ],
    Thursday: [ { start: "8:30", end: "9:20", subject: "Environmental Sci.", code: "CY201", type: 'theory', location: 'R204' }, { start: "9:25", end: "10:15", subject: "OOP with Java", code: "CS205", type: 'theory', location: 'R201' }, { start: "10:30", end: "12:15", subject: "Data Structures", code: "CS201", type: 'theory', location: 'R201' }, { start: "1:10", end: "2:55", subject: "Discrete Maths", code: "MA202", type: 'theory', location: 'R202' }, ],
    Friday: [ { start: "8:30", end: "10:15", subject: "Digital Logic", code: "EE201", type: 'theory', location: 'R203' }, { start: "10:30", end: "11:20", subject: "Environmental Sci.", code: "CY201", type: 'theory', location: 'R204' }, { start: "11:25", end: "12:15", subject: "OOP with Java", code: "CS205", type: 'theory', location: 'R201' }, ],
  },
  "CSE Batch Q (Year 1 - Sem 4)": { // Example: 1st Year
    Monday: [ { start: "8:30", end: "10:15", subject: "Programming in C", code: "CS101", type: 'theory', location: 'R301' }, { start: "10:30", end: "12:15", subject: "Physics I", code: "PH101", type: 'theory', location: 'R302' }, { start: "1:10", end: "2:55", subject: "Workshop Practice", code: "ME101L", type: 'lab', location: 'Workshop A' }, { start: "3:10", end: "4:55", subject: "Calculus & Matrices", code: "MA101", type: 'theory', location: 'R303' }, ],
    Tuesday: [ { start: "8:30", end: "10:15", subject: "Calculus & Matrices", code: "MA101", type: 'theory', location: 'R303' }, { start: "10:30", end: "12:15", subject: "Physics I Lab", code: "PH101L", type: 'lab', location: 'Physics Lab' }, { start: "1:10", end: "2:00", subject: "Programming in C", code: "CS101", type: 'theory', location: 'R301' }, { start: "2:05", end: "2:55", subject: "English I", code: "HS101", type: 'theory', location: 'R304' }, { start: "3:10", end: "4:55", subject: "Basic Electrical Engg", code: "EE101", type: 'theory', location: 'R305' }, ],
    Wednesday: [ { start: "8:30", end: "10:15", subject: "Basic Electrical Engg", code: "EE101", type: 'theory', location: 'R305' }, { start: "10:30", end: "12:15", subject: "C Programming Lab", code: "CS101L", type: 'lab', location: 'Lab I' }, { start: "1:10", end: "2:00", subject: "Physics I", code: "PH101", type: 'theory', location: 'R302' }, { start: "2:05", end: "2:55", subject: "Calculus & Matrices", code: "MA101", type: 'theory', location: 'R303' }, ],
    Thursday: [ { start: "8:30", end: "9:20", subject: "English I", code: "HS101", type: 'theory', location: 'R304' }, { start: "9:25", end: "10:15", subject: "Programming in C", code: "CS101", type: 'theory', location: 'R301' }, { start: "10:30", end: "12:15", subject: "Basic Electrical Lab", code: "EE101L", type: 'lab', location: 'Elec. Lab' }, { start: "1:10", end: "2:55", subject: "Physics I", code: "PH101", type: 'theory', location: 'R302' }, ],
    Friday: [ { start: "8:30", end: "10:15", subject: "Calculus & Matrices", code: "MA101", type: 'theory', location: 'R303' }, { start: "10:30", end: "11:20", subject: "Basic Electrical Engg", code: "EE101", type: 'theory', location: 'R305' }, { start: "11:25", end: "12:15", subject: "English I", code: "HS101", type: 'theory', location: 'R304' }, ],
  },
};

// Defines the visual rows and timing structure of the table
const TIME_SLOTS = [
  { start: "8:30", end: "9:20", type: 'period', label: 'Period 1' },
  { start: "9:25", end: "10:15", type: 'period', label: 'Period 2' },
  { start: "10:15", end: "10:30", type: 'break', label: 'Break' },
  { start: "10:30", end: "11:20", type: 'period', label: 'Period 3' },
  { start: "11:25", end: "12:15", type: 'period', label: 'Period 4' },
  { start: "12:15", end: "1:10", type: 'lunch', label: 'Lunch' },
  { start: "1:10", end: "2:00", type: 'period', label: 'Period 5' },
  { start: "2:05", end: "2:55", type: 'period', label: 'Period 6' },
  { start: "2:55", end: "3:10", type: 'break', label: 'Break' },
  { start: "3:10", end: "4:00", type: 'period', label: 'Period 7' },
  { start: "4:05", end: "4:55", type: 'period', label: 'Period 8' },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// --- ---

// --- Helper Functions ---

const timeToMinutes = (timeStr) => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const findClassForSlot = (batchData, day, timeSlotStart) => {
  if (!batchData || !batchData[day]) return null;
  return batchData[day].find(cls => cls.start === timeSlotStart);
};

const isSlotCoveredByPreviousClass = (batchData, day, currentTimeSlot) => {
    if (!batchData || !batchData[day] || currentTimeSlot.type !== 'period') return false;
    const currentSlotStartMinutes = timeToMinutes(currentTimeSlot.start);
    for (const cls of batchData[day]) {
        const classStartMinutes = timeToMinutes(cls.start);
        const classEndMinutes = timeToMinutes(cls.end);
        if (classStartMinutes < currentSlotStartMinutes && classEndMinutes > currentSlotStartMinutes) {
            return true;
        }
    }
    return false;
};

const calculateRowSpan = (scheduledClass) => {
    if (!scheduledClass) return 1;
    const classStartMinutes = timeToMinutes(scheduledClass.start);
    const classEndMinutes = timeToMinutes(scheduledClass.end);
    let spannedSlots = 0;
    for (const slot of TIME_SLOTS) {
        if (slot.type === 'period') {
            const slotStartMinutes = timeToMinutes(slot.start);
            if (classStartMinutes <= slotStartMinutes && classEndMinutes > slotStartMinutes) {
                spannedSlots++;
            }
        }
    }
    return Math.max(1, spannedSlots);
};

// --- TimeTable Component ---
function TimeTable() {
  const batchNames = Object.keys(TIMETABLE_DATA);
  const [selectedBatch, setSelectedBatch] = useState(batchNames[0]);
  const [currentTimetable, setCurrentTimetable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setCurrentTimetable(TIMETABLE_DATA[selectedBatch]);
      setIsLoading(false);
    }, 250); // Slightly faster transition
    return () => clearTimeout(timer);
  }, [selectedBatch]);

  return (
    // This component assumes it's rendered within your Layout component
    <div className="container mx-auto p-3 md:p-6 max-w-full xl:max-w-7xl">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        CSE Department Timetable
      </h3>

      {/* Batch Selection */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {batchNames.map(batchName => (
          <button
            key={batchName}
            onClick={() => setSelectedBatch(batchName)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
              selectedBatch === batchName
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg ring-2 ring-offset-2 ring-cyan-400'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            {batchName.replace("CSE Batch ", "")} {/* Show only N/P/Q */}
          </button>
        ))}
      </div>

      {/* Timetable Table */}
      {isLoading ? (
        <div className="text-center p-10 text-gray-600">Loading timetable...</div>
      ) : !currentTimetable ? (
         <div className="text-center p-10 text-red-500 font-semibold">Timetable data not available for {selectedBatch}.</div>
      ) : (
        <div className="overflow-x-auto bg-white p-2 rounded-xl shadow-xl border border-gray-200">
          <table className="min-w-full  border-separate border-spacing-0 table-fixed rounded-lg overflow-hidden">
            {/* Header */}
            <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 border-b border-gray-600 w-24 md:w-28 text-sm font-semibold">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="p-2 border-b border-l border-gray-600 text-sm font-semibold">{day}</th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="text-gray-800">
              {TIME_SLOTS.map((slot,slotIndex) => {
                // --- Render Break/Lunch Row ---
                if (slot.type === 'break' || slot.type === 'lunch') {
                  return (
                    <tr key={slot.start + slot.type} className="bg-gray-100 h-9">
                      <td className="px-1 py-0.5 border-b border-r border-gray-300 font-bold text-[10px] md:text-xs text-gray-500 align-middle">
                        {slot.start}<br/>{slot.end}
                      </td>
                      <td
                        colSpan={DAYS.length}
                        className="p-1 border-b border-gray-300 font-bold text-gray-600 align-middle text-xs md:text-sm tracking-wider"
                      >
                        {slot.label.toUpperCase()}
                      </td>
                    </tr>
                  );
                }
                // --- Render Class Period Row ---
                else {
                  return (
                    <tr key={slot.start} className="h-20 even:bg-white odd:bg-blue-50/30">
                      {/* Time Cell */}
                      <td className="px-1 py-0.5 border-b border-r border-gray-300 font-bold text-[10px] md:text-xs text-gray-500 align-middle">
                         {slot.start}<br/>{slot.end}
                      </td>
                      {/* Day Cells */}
                      {DAYS.map(day => {
                        if (isSlotCoveredByPreviousClass(currentTimetable, day, slot)) {
                            return null; // Cell covered by rowspan
                        }
                        const scheduledClass = findClassForSlot(currentTimetable, day, slot.start);

                        if (scheduledClass) {
                          const rowSpan = calculateRowSpan(scheduledClass);
                          const isLab = scheduledClass.type === 'lab';
                          return (
                            <td
                              key={day + slot.start}
                              rowSpan={rowSpan}
                              className={`p-1.5 md:p-2 border-b border-l border-gray-300 align-middle text-[10px] md:text-xs transition-colors duration-150 relative group ${ // Added group for hover effects
                                isLab
                                  ? 'bg-yellow-100/70 hover:bg-yellow-200/80'
                                  : 'hover:bg-blue-100/80' // Use parent row bg otherwise
                              }`}
                            >
                              <div className={`font-semibold ${isLab ? 'text-yellow-900' : 'text-blue-900'} leading-tight mb-0.5`}>{scheduledClass.subject}</div>
                              <div className="text-gray-700 leading-tight">{scheduledClass.code}</div>
                              {scheduledClass.location && <div className="text-indigo-700 text-[9px] md:text-[11px] italic leading-tight mt-0.5">{scheduledClass.location}</div>}
                              {isLab && <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">LAB</div>}
                            </td>
                          );
                        } else {
                          // --- Render Empty Cell (Free Slot) ---
                          return (
                            <td key={day + slot.start} className="p-2 border-b border-l border-gray-300 bg-opacity-50"> {/* Subtle background */}
                                {/* Optional: Add a visual indicator for free slot */}
                                {/* <span className="text-gray-300 text-xs">Free</span> */}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TimeTable;