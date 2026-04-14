export function isStartBeforeEnd(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  return startTime < endTime;
}

export function isPastDate(date: string): boolean {
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate.getTime() < today.getTime();
}

export function generateTimeSlots(
  startHour: number,
  endHour: number,
  stepMinutes: number,
): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      if (hour === endHour && minute > 0) continue;

      const formHour = hour.toString().padStart(2, '0');
      const formMinute = minute.toString().padStart(2, '0');

      slots.push(`${formHour}:${formMinute}`);
    }
  }
  return slots;
}

export function durationInMinutes(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;

  return endTotalMinutes - startTotalMinutes;
}

