const tabs = ["about", "experience", "lab", "work"];

const tabButtons = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = {
  about: document.getElementById("panel-about"),
  experience: document.getElementById("panel-experience"),
  lab: document.getElementById("panel-lab"),
  work: document.getElementById("panel-work"),
};

let activeTab = "about";

function activate(tab) {
  activeTab = tab;
  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.tab === tab;
    btn.setAttribute("aria-selected", String(isActive));
    btn.classList.toggle("is-active", isActive);
  });
  Object.keys(panels).forEach((id) => {
    const el = panels[id];
    if (!el) return;
    el.classList.toggle("is-active", id === tab);
  });
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", `#${tab}`);
  }
}

function tabFromHash() {
  const hash = (window.location.hash || "#about").replace(/^#/, "");
  return tabs.includes(hash) ? hash : "about";
}

function onHashChange() {
  activate(tabFromHash());
}

window.addEventListener("hashchange", onHashChange);
window.addEventListener("load", () => activate(tabFromHash()));

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => activate(btn.dataset.tab));
});

const tablist = document.getElementById("portfolio-tabs");
if (tablist) {
  tablist.addEventListener("keydown", (e) => {
    const currentIndex = tabs.indexOf(activeTab);
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = tabs.length - 1;
    else return;
    e.preventDefault();
    const nextTab = tabs[nextIndex];
    activate(nextTab);
    const nextBtn = document.getElementById(`tab-${nextTab}`);
    if (nextBtn) nextBtn.focus();
  });
}

/* ---------- Lab filters ----------
   Each category below holds lab entries. To add a project, copy this
   template into the right category's items array:

   {
     title: "Project name",
     tools: ["Tool one", "Tool two"],
     summary: "What was built or tested.",
     outcome: "Result or what was learned.",
     status: "done", // "done" | "ongoing"
   }

   An empty items array automatically shows a "Coming soon" card. */
const labData = [
  {
    id: "network",
    label: "Network",
    items: [
      {
        title: "Failover 2 ISP",
        tools: ["Mikrotik", "VLAN"],
        summary:
          "Created high availability (HA) using 2 Internet providers: if one link goes down, traffic switches to the other.",
        outcome: "High Availability Internet",
        status: "done",
      },
    ],
  },
  { id: "virtualization", label: "Virtualization", items: [] },
  { id: "server", label: "Server", items: [] },
  { id: "ai", label: "AI Experiments", items: [] },
];

const labGrid = document.querySelector(".lab-grid");

function renderLab(filterId) {
  if (!labGrid) return;
  labGrid.innerHTML = "";
  labData.forEach((f) => {
    if (filterId && f.id !== filterId) return;

    if (f.items.length === 0) {
      const soon = document.createElement("div");
      soon.className = "lab-card";
      soon.setAttribute("data-lab-filter", f.id);
      soon.innerHTML =
        '<p class="lab-card-kicker">' + f.label + '</p><h3 class="lab-card-title">Coming soon</h3>';
      labGrid.appendChild(soon);
      return;
    }

    f.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "lab-card";
      card.setAttribute("data-lab-filter", f.id);
      const toolsHtml =
        item.tools && item.tools.length
          ? '<ul class="lab-tools">' +
            item.tools.map((t) => '<li class="chip">' + t + "</li>").join("") +
            "</ul>"
          : "";
      card.innerHTML =
        '<span class="lab-status">' + item.status + "</span>" +
        '<p class="lab-card-kicker">' + f.label + "</p>" +
        '<h3 class="lab-card-title">' + item.title + "</h3>" +
        '<p class="lab-card-desc">' + item.summary + "</p>" +
        '<p class="lab-card-outcome"><strong>Result:</strong> ' + item.outcome + "</p>" +
        toolsHtml;
      labGrid.appendChild(card);
    });
  });
}

const chips = Array.from(document.querySelectorAll(".chip-row .chip"));

function syncChipPressed() {
  chips.forEach((c) =>
    c.setAttribute("aria-pressed", String(c.classList.contains("chip-active")))
  );
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const wasActive = chip.classList.contains("chip-active");
    chips.forEach((c) => c.classList.remove("chip-active"));
    if (wasActive) {
      // Clicking the active filter again clears it and shows every category
      renderLab(null);
    } else {
      chip.classList.add("chip-active");
      renderLab(chip.dataset.filter);
    }
    syncChipPressed();
  });
});

syncChipPressed();
renderLab(null); // show all categories on page load

/* ---------- Footer contact link ---------- */
const footerContact = document.querySelector(".footer-contact");
if (footerContact) {
  footerContact.addEventListener("click", (e) => {
    e.preventDefault();
    activate("about");
    const contact = document.getElementById("contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth" });
  });
}
