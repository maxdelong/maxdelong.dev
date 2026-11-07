import type { Metadata } from "next";
import { CarCompare } from "@/components/car-cost/CarCompare";
import { PageHeader } from "@/components/PageHeader";
import { TodoCards } from "@/components/TodoCards";
import { todos } from "@/lib/car-cost/todos";

export const metadata: Metadata = {
  title: "True Cost of a Car",
  description: "Compare two cars by what they really cost per month and per mile.",
};

export default function CarCostPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeader
          title="True Cost of a Car"
          description="The monthly payment is only part of it. Compare what two cars really cost."
        />
        <CarCompare />
      </div>
      <TodoCards cards={todos} />
    </div>
  );
}
