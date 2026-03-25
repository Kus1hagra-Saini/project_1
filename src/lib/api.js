export async function createItem(payload) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL in .env");

  let res;
  try {
    res = await fetch(`${baseUrl}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(`Network error while calling ${baseUrl}/items. Check API Gateway URL, stage path, and CORS (allow http://localhost:5173).`);
  }
  if (!res.ok) { const e = await res.text(); throw new Error(`Create item failed: ${res.status} ${e}`); }
  return res.json();
}

export async function listItems(ownerId) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL in .env");

  const query = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : "";
  let res;
  try {
    res = await fetch(`${baseUrl}/items${query}`, { method: "GET", headers: { "Content-Type": "application/json" } });
  } catch {
    throw new Error(`Network error while calling ${baseUrl}/items. Check API Gateway URL, stage path, and CORS (allow http://localhost:5173).`);
  }
  if (!res.ok) { const e = await res.text(); throw new Error(`List items failed: ${res.status} ${e}`); }
  return res.json();
}

export async function createUploadUrl({ fileName, contentType, ownerId }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL in .env");

  let res;
  try {
    res = await fetch(`${baseUrl}/uploads/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, contentType, ownerId }),
    });
  } catch {
    throw new Error(`Network error while calling ${baseUrl}/uploads/presign.`);
  }
  if (!res.ok) { const e = await res.text(); throw new Error(`Presign failed: ${res.status} ${e}`); }
  return res.json();
}

export async function uploadFileToS3(uploadUrl, file, contentType) {
  let res;
  try {
    res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType || file.type || "application/octet-stream" },
      body: file,
    });
  } catch {
    throw new Error("Network error while uploading file to S3.");
  }
  if (!res.ok) { const e = await res.text(); throw new Error(`S3 upload failed: ${res.status} ${e}`); }
}

export async function registerUser({ name, username, password, lat, lng }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL in .env");

  let res;
  try {
    res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password, lat, lng }),
    });
  } catch {
    throw new Error("Network error while registering. Check API Gateway CORS.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Register failed: ${res.status}`);
  return data;
}

export async function loginUser({ username, password }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL in .env");

  let res;
  try {
    res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Network error while logging in. Check API Gateway CORS.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Login failed: ${res.status}`);
  return data;
}

export async function deleteItemAPI(itemId, ownerId) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("Missing VITE_API_BASE_URL in .env");

  let res;
  try {
    res = await fetch(`${baseUrl}/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, ownerId }),
    });
  } catch {
    throw new Error(`Network error while calling ${baseUrl}/items (DELETE).`);
  }
  if (!res.ok) { const e = await res.text(); throw new Error(`Delete failed: ${res.status} ${e}`); }
  return res.json();
}
