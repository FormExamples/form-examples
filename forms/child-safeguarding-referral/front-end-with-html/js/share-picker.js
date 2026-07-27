// Lily Design System — share-picker (headless, vanilla JS).
// Tries the native Web Share API first; otherwise opens a one-item list
// ("Copy link") to the clipboard. Mirrors the front-end-with-svelte
// convention (front-end-with-svelte/src/lib/components/ui/ShareButton.svelte).
// This monorepo ships no social-network targets on purpose -- see that
// component's docs for the rationale.

function canShareNatively() {
  return (
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
}

function canCopy() {
  return (
    typeof navigator !== "undefined" &&
    !!(navigator.clipboard && navigator.clipboard.writeText)
  );
}

function currentUrl() {
  return location.href;
}

function setStatus(status, text) {
  if (status) status.textContent = text;
}

function closeList(list, trigger) {
  if (!list || list.hidden) return;
  list.hidden = true;
  if (trigger) trigger.setAttribute("aria-expanded", "false");
}

function openList(list, trigger, copyButton) {
  list.hidden = false;
  if (trigger) trigger.setAttribute("aria-expanded", "true");
  if (copyButton) copyButton.focus();
}

async function shareNatively() {
  try {
    await navigator.share({ url: currentUrl(), title: document.title });
    return true;
  } catch {
    // A rejected promise here is almost always the user dismissing the
    // sheet, which is not an error and must not fall through to the list.
    return true;
  }
}

async function copyUrl(status) {
  const url = currentUrl();
  try {
    if (!canCopy()) throw new Error("clipboard unavailable");
    await navigator.clipboard.writeText(url);
    setStatus(status, "Link copied");
  } catch {
    setStatus(status, "Could not copy — copy it from the address bar");
  }
}

function init() {
  const root = document.querySelector(".share-picker");
  const trigger = document.getElementById("share-picker");
  const list = document.getElementById("share-picker-list");
  const copyButton = document.getElementById("share-picker-copy");
  const status = document.getElementById("share-picker-status");
  if (!root || !trigger || !list || !copyButton) return;

  trigger.addEventListener("click", async () => {
    if (!list.hidden) {
      closeList(list, trigger);
      return;
    }
    if (canShareNatively()) {
      if (await shareNatively()) return;
    }
    setStatus(status, "");
    openList(list, trigger, copyButton);
  });

  copyButton.addEventListener("click", async () => {
    await copyUrl(status);
    closeList(list, trigger);
    trigger.focus();
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) closeList(list, trigger);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeList(list, trigger);
      trigger.focus();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
