import { CalendarView, calendarMetadata } from "@/views/CalendarView";

export const metadata = calendarMetadata("en");

export default function Page() {
  return <CalendarView locale="en" />;
}
