import { supabase } from "./client";

export async function logout() {
  await supabase.auth.signOut();
}