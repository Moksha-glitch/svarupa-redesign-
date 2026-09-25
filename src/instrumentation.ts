export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prepareDatabase } = await import("@/lib/db");
    await prepareDatabase();
  }
}
