export async function GET() {
    try {
      const res = await fetch("http://localhost:5000/api/get-pricing");
  
      if (!res.ok) {
        throw new Error(`Failed to fetch pricing data: ${res.statusText}`);
      }
  
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch pricing data" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  