import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { userId } = req.query;
      const { data, error } = await supabase
        .from("user")
        .select("id, name, email, created, updated")
        .eq("id", userId);

      if (error) {
        return res.status(500).json({ error: "Error fetching user" });
      }

      return res.status(200).json(data[0]);

    case "PUT":
      const updates = req.body;
      const { data: updatedData, error: updateError } = await supabase
        .from("user")
        .update(updates)
        .eq("id", updates.id);

      if (updateError) {
        return res.status(500).json({ error: "Error updating user" });
      }

      return res.status(200).json(updatedData[0]);

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
