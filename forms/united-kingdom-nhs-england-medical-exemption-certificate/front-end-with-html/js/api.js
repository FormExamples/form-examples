/**
 * API client with sample-data fallback.
 * If the backend is unreachable, returns the bundled sample list.
 */

  

  export const fetchApplications = async function () {
    try {
      const res = await fetch("/api/applications", { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return { items: json, source: "api" };
    } catch (err) {
      return { items: F.SAMPLE_APPLICATIONS, source: "sample", error: String(err) };
    }
  };
