// ---- CONFIG ----
const SUPABASE_URL = "https://stzpkhkgnujduzjvhopo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0enBraGtnbnVqZHV6anZob3BvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc2ODkwNiwiZXhwIjoyMDc1MzQ0OTA2fQ.PXvnD9kR9pbB6YUzqJHQm6KyuDANFhFj3SFT8s49oh8";
const TABLE = "click_counts";
const TRACKER_ID = "btnDownload";

// ----------------

async function getClickCount() {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${TRACKER_ID}&select=count`;

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!response.ok) {
    console.error("Error fetching count:", response.status);
    return 0;
  }

  const data = await response.json();
  return data.length ? data[0].count : 0;
}

async function updateClickCount(newCount) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${TRACKER_ID}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ count: newCount })
  });

  return response.ok;
}

async function insertIfNotExists() {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({ id: TRACKER_ID, count: 1 })
  });

  return response.ok;
}

async function incrementClickCount() {
  let currentCount = await getClickCount();

  if (currentCount === 0) {
    // If record doesn't exist → create one
    const created = await insertIfNotExists();
    if (created) {
      console.log("Created new record: count = 1");
    }
    return;
  }

  const newCount = currentCount + 1;

  const updated = await updateClickCount(newCount);
  if (updated) {
    console.log(`Updated count to ${newCount}`);
  } else {
    console.error("Failed to update count");
  }
}

// 🔘 Attach click listener
document.getElementById("btnDownload").addEventListener("click", incrementClickCount);
