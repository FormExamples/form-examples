<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the
  // applications dashboard.
  const plural = 'united-states-birth-certificate-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-birth-certificate-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that checks eligibility
        and completeness as you fill it in.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-birth-certificate-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Applications dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed class, eligibility finding, and flag count, and
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
          Prepare a request for a certified copy of a US birth certificate and produce a graded
          report: an application class (ready to submit, incomplete, or ineligible requester), the
          expected fee, and flagged issues. The issuing state or territory vital records office, not
          this software, decides whether a copy is issued. This is documentation support, not legal
          advice.
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
          Drawn from the CDC/NCHS Where to Write for Vital Records, the Model State Vital Statistics
          Act, and the US Standard Certificate of Live Birth. Verified state rules are held for
          eight states; other states use a uniform default and a verify-the-state-rule flag.
        </dd>
      </div>
    </dl>
  </section>
</main>
