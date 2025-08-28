import AppLayout from "@/components/Layout/AppLayout";
import TimeEntryForm from "@/components/TimeEntry/TimeEntryForm";

export default function TimeEntry() {
  return (
    <AppLayout currentPath="/timeentry">
      <div className="p-6">
        <TimeEntryForm />
      </div>
    </AppLayout>
  );
}