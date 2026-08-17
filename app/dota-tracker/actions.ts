"use server";

import { redirect } from "next/navigation";
import { classifySearchInput } from "@/lib/dota-tracker/format";
import { searchPlayers } from "@/lib/dota-tracker/opendota";

export async function searchPlayer(formData: FormData) {
  const query = String(formData.get("query") ?? "");
  const identifier = classifySearchInput(query);

  if (!identifier) {
    redirect("/dota-tracker?error=not-found");
  }

  if (identifier.type === "account-id") {
    redirect(`/dota-tracker/${identifier.accountId}`);
  }

  const result = await searchPlayers(identifier.name);
  if (!result.ok || result.data.length === 0) {
    redirect("/dota-tracker?error=not-found");
  }

  redirect(`/dota-tracker/${result.data[0].accountId}`);
}
