import AppLayout from "@/components/Layout/AppLayout";
import TimeAnalytics from "@/components/Analytics/TimeAnalytics";

export default function Analytics() {
  return (
    <AppLayout currentPath="/analytics">
      <div className="p-6">
        <TimeAnalytics />
      </div>
    </AppLayout>
  );
}