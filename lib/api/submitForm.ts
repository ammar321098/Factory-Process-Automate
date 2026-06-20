export async function submitForm(formType: string, data: any) {
  try {
    const res = await fetch(`/api/${formType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || "Request failed" };
    }
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("submitForm error:", error);
    return { success: false, error: error.message || "Unexpected error" };
  }
}
