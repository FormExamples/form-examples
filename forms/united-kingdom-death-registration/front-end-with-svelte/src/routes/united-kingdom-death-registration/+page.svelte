<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the registration wizard and the
  // informant dashboard.
  const plural = 'united-kingdom-death-registrations';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-death-registration/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new registration</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step form. One continuous single-page wizard that checks whether the death
        is ready to register as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-death-registration/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Registrations dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse registrations with their computed class, 5-day deadline status, and flag count, and
        filter by class.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
    </a>
  </div>

  <section class="mt-12">
    <h2 class="text-lg font-semibold text-base-content">About this work</h2>
    <dl class="mt-4 space-y-4 text-sm">
      <div>
        <dt class="font-semibold text-base-content">Purpose</dt>
        <dd class="mt-1 text-base-content/70">
          Check whether a death in England and Wales is ready to be registered and produce a report
          — a registration class, the 5-day deadline status, and flagged issues. Registration
          decisions rest with the registrar, not this software.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the classification /
          validation engine, and the flag rules. The same engine grades both the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from GOV.UK guidance (Register a death; Order a copy of a death certificate; When a
          death is reported to a coroner) and section 16 of the Births and Deaths Registration Act
          1953. A readiness aid, not legal advice.
        </dd>
      </div>
    </dl>
  </section>
</main>
