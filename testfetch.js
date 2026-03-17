const BASE_URL = "https://api.sectors.app/v2";

async function apiFetch(endpoint, params = {}) {
  // Use a mock API key for testing
  const apiKey = "demo"; 

  const url = new URL(BASE_URL + endpoint);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, v);
    }
  }

  console.log("Fetching URL:", url.toString());

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  });

  if (res.status === 429) throw new Error("Rate limit exceeded. Please wait.");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `HTTP ${res.status}`);
  }
  return res.json();
}

async function runTest() {
    try {
        console.log("Testing COMPANY_OVERVIEW for BBCA...");
        const d = await apiFetch(`/company/report/BBCA/`, { sections: "overview" });
        console.log("COMPANY_NAME:", d.company_name);
        console.log("SECTOR:", d.overview.sector);
        console.log("Test OK");
    } catch(err) {
        console.error("Test Error:", err.message);
    }
}

runTest();
