import type { Metadata } from "next";
import { DailyFetchLoader } from "@/components/daily-fetch/DailyFetchLoader";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { todos } from "@/lib/daily-fetch/todos";

export const metadata: Metadata = {
  title: "Daily Fetch",
  description: "One throw a day. Land the ball as close to the dog as you can.",
};

export default function DailyFetchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader
          title="Daily Fetch"
          description="Everyone gets the same dog and wind each day. Land the ball as close as you can."
        />
        <DailyFetchLoader />
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
