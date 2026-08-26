import { StoryView, storyMetadata } from "@/views/StoryView";

export const metadata = storyMetadata("en");

export default function Page() {
  return <StoryView locale="en" />;
}
