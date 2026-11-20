<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the will wizard and the
  // wills dashboard.
  const plural = 'united-kingdom-last-will-and-testaments';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-last-will-and-testament/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new will record</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step will record. One continuous single-page wizard that classifies and
        checks the will as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-last-will-and-testament/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Wills dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse will records with their computed validity class, beneficiary share total, witness
        count, and flag count, and filter by validity class.
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
          Capture a will for England and Wales and produce a graded report: a validity class (valid,
          incomplete, or formality risk), the beneficiary share total, and flagged issues. It is
          documentation support, not legal advice: it cannot confirm that a will is valid, and
          anyone with a complex estate should take advice from a solicitor.
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
          Drawn from the GOV.UK guidance on making a will, the Wills Act 1837 (age 18, writing, two
          witnesses, gifts to witnesses, revocation by marriage), the Inheritance (Provision for
          Family and Dependants) Act 1975, and the Law Society guidance. A documentation aid, not a
          will and not legal advice.
        </dd>
      </div>
    </dl>
  </section>
</main>
