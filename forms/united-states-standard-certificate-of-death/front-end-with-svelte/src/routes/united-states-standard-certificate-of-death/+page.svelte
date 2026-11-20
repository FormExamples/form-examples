<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the certification wizard and the
  // certifier dashboard.
  const plural = 'united-states-standard-certificates-of-death';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-standard-certificate-of-death/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new certificate</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step certificate. One continuous single-page wizard that classifies and
        validates the certificate as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-standard-certificate-of-death/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Certifier dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse certificates with their computed validity class, derived underlying cause, and flag
        count, and filter by validity class.
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
          Capture a US Standard Certificate of Death and produce a graded report: a validity class,
          the derived underlying cause, and flagged issues, with state filing deadlines and
          certified-copy fees. Certification and referral decisions rest with the certifier, the
          medical examiner or coroner, and the registering state agency, not this software. It is
          documentation support, not legal advice.
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
          Drawn from the NCHS Physicians’ Handbook on Medical Certification of Death, the NCHS
          Standard Certificate of Death (2003 revision), and state vital-statistics law. A
          documentation and validation aid, not the registered certificate, which remains the legal
          record.
        </dd>
      </div>
    </dl>
  </section>
</main>
