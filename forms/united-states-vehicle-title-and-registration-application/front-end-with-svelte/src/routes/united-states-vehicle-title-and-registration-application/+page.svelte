<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces: the application wizard and the clerk
  // dashboard.
  const plural = 'vehicle-title-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-vehicle-title-and-registration-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that checks the
        application against the federal rules and the state's rules as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-vehicle-title-and-registration-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Clerk dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed class, VIN status, and outstanding items, and filter
        by class.
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
          Prepare an application for a certificate of title and registration with a state motor
          vehicle agency and produce a report: an application class (ready to submit, incomplete, or
          title brand or lien issue), the VIN check, and flagged issues. The issuing state agency
          decides whether to issue a title, not this software.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the classification engine, the
          state rule table, and the flag rules. The same engine grades both the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from 49 CFR 565.15 (VIN), 49 CFR Part 580 (odometer disclosure), the National Motor
          Vehicle Title Information System, and the rules of nine encoded states. Documentation
          support, not legal advice.
        </dd>
      </div>
    </dl>
  </section>
</main>
