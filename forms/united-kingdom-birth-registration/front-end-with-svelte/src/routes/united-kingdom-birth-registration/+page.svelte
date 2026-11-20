<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the
  // registrar dashboard.
  const plural = 'united-kingdom-birth-registrations';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-birth-registration/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that checks the
        application is complete and supported by evidence as you fill it in.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-birth-registration/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Registrar dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed readiness class, days since birth against the 42-day
        period, and flag count, and filter by readiness class.
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
          Prepare to register a birth in England and Wales and order the birth certificate. The
          engine classifies the application as ready to submit, incomplete, needs additional
          evidence, or out of scope, and flags the 42-day period, the qualified informant, the
          unmarried-father rules, and the required evidence. The registrar decides and makes the
          entry in the register, not this software.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the readiness engine, and the
          flag rules. The same engine grades both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the GOV.UK guidance on registering a birth and ordering a certificate, and the
          Births and Deaths Registration Act 1953. A completeness aid, not legal advice; the
          registrar's entry in the register remains the legal record.
        </dd>
      </div>
    </dl>
  </section>
</main>
