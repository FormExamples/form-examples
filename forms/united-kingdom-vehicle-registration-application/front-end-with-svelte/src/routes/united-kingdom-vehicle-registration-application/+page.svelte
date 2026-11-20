<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the
  // dashboard.
  const plural = 'vehicle-registration-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-vehicle-registration-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that checks the
        application is complete and valid as you fill it in.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-vehicle-registration-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Application dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed validity class, fee due, and count of missing items,
        and filter by validity class.
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
          Prepare an application to the DVLA to register a vehicle in Great Britain: a V62 for a
          replacement V5C, or a V55/4, V55/5, import, or V627/1 first registration. The report gives
          a validity class, the fee due, and flagged issues, so the application is complete before
          it is posted. Only the DVLA decides whether a vehicle is registered.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the validity engine, and the
          flag rules. The same engine grades both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the GOV.UK and DVLA guidance on registering a vehicle, the V62, V55/4, V55/5
          and V627/1 forms, and the HMRC NOVA guidance for imports. A completeness check, not a
          decision; fees and rules can change, so check GOV.UK before posting.
        </dd>
      </div>
    </dl>
  </section>
</main>
