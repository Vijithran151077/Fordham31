const segments = [
  { segmentId: 1, startTime: '22:00', endTime: '01:00' },
  { segmentId: 2, startTime: '02:00', endTime: '10:00' }
];

const shiftDate = '2026-04-01';

const baseDate = shiftDate;
let currentDayOffset = 0;
let lastAbsoluteEndMinutes = -1;
const timeline = [];

segments.forEach((seg) => {
  const [startH, startM] = seg.startTime.split(':').map(Number);
  const [endH, endM] = seg.endTime.split(':').map(Number);

  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  // Detect day roll-over between segments
  if (lastAbsoluteEndMinutes !== -1) {
    if (startMinutes < (lastAbsoluteEndMinutes % 1440)) {
      currentDayOffset += 1;
    }
  }

  let absoluteStart = (currentDayOffset * 1440) + startMinutes;
  let absoluteEnd = (currentDayOffset * 1440) + endMinutes;
  let segStartDayOffset = currentDayOffset;

  if (absoluteEnd <= absoluteStart) {
    absoluteEnd += 1440;
    currentDayOffset += 1; // carry over for the next segment!
  }
  let segEndDayOffset = currentDayOffset;

  const startDay = new Date(`${baseDate}T00:00:00Z`);
  startDay.setUTCDate(startDay.getUTCDate() + segStartDayOffset);

  const endDay = new Date(`${baseDate}T00:00:00Z`);
  endDay.setUTCDate(endDay.getUTCDate() + segEndDayOffset);

  const startMs = startDay.getTime() + (startMinutes * 60000);
  const endMs = endDay.getTime() + (endMinutes * 60000);

  const durationHours = (endMs - startMs) / 3600000;

  timeline.push({
    ...seg,
    absoluteStart,
    absoluteEnd,
    duration: durationHours
  });

  lastAbsoluteEndMinutes = absoluteEnd;
});

timeline.sort((a, b) => a.absoluteStart - b.absoluteStart);

console.log("=== FINAL TIMELINE ===");
console.log(JSON.stringify(timeline, null, 2));
console.log("First Start:", timeline[0].startTime);
console.log("Last End:", timeline[timeline.length - 1].endTime);
