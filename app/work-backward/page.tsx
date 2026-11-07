import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { WorkBackward } from "@/components/work-backward/WorkBackward";
import { todos } from "@/lib/work-backward/todos";

export const metadata: Metadata = {
  title: "Work Backward",
  description: "Enter when you need to be somewhere and find out when to start each step.",
};

export default function WorkBackwardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader title="Work Backward" description="Enter when you need to be there and find out when to start." />
        <WorkBackward />
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
