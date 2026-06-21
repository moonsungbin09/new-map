async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `요청 실패 (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

async function renderIndex() {
  const listEl = document.querySelector("#place-list");
  const out = await fetchJson("/api/places");
  listEl.innerHTML = "";

  for (const item of out.items || []) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `/detail.html?id=${encodeURIComponent(item.id)}`;
    link.textContent = item.name || item.id;
    li.appendChild(link);
    listEl.appendChild(li);
  }
}

function setupCreate() {
  const form = document.querySelector("#create-form");
  const errorEl = document.querySelector("#error-text");
  const submitButton = form?.querySelector('button[type="submit"]');
  let isSubmitting = false;

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    isSubmitting = true;
    if (submitButton) {
      submitButton.disabled = true;
    }
    errorEl.textContent = "";

    const data = new FormData(form);
    const body = {
      name: String(data.get("name") || ""),
      latitude: Number(data.get("latitude")),
      longitude: Number(data.get("longitude")),
      level_type: String(data.get("level_type") || ""),
      description: String(data.get("description") || "")
    };

    try {
      const created = await fetchJson("/api/places", {
        method: "POST",
        body: JSON.stringify(body)
      });
      window.location.href = `/detail.html?id=${encodeURIComponent(created.id)}`;
    } catch (error) {
      errorEl.textContent = error instanceof Error ? error.message : "등록에 실패했습니다.";
      isSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

async function renderDetail() {
  const outEl = document.querySelector("#place-json");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    outEl.textContent = "id 파라미터가 필요합니다.";
    return;
  }

  try {
    const out = await fetchJson(`/api/places/${encodeURIComponent(id)}`);
    outEl.textContent = JSON.stringify(out, null, 2);
  } catch (error) {
    outEl.textContent = error instanceof Error ? error.message : "조회에 실패했습니다.";
  }
}

const page = document.body.dataset.page;
if (page === "index") {
  renderIndex().catch(() => {
    const listEl = document.querySelector("#place-list");
    if (listEl) {
      listEl.innerHTML = `<li class="error">목록을 불러오지 못했습니다.</li>`;
    }
  });
} else if (page === "create") {
  setupCreate();
} else if (page === "detail") {
  renderDetail();
}

export { fetchJson };
