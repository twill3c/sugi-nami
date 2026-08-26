import { CalendarView, calendarMetadata } from "@/views/CalendarView";

export const metadata = calendarMetadata("ja");

export default function Page() {
  return <CalendarView locale="ja" />;
}
