<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces: the application wizard and the
  // assessor dashboard.
  const plural = 'property-tax-exemption-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-property-tax-exemption-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that checks the
        application against your state's rule as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-property-tax-exemption-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Assessor dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed eligibility class, the exemptions claimed, the
        late-filing indication and flag count, and filter by class.
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
          Capture a residential property tax homestead exemption application, with senior,
          disability, disabled-veteran and circuit-breaker relief and assessment-appeal basics, and
          produce an eligibility report: a class, the state filing deadline, and prioritized flags.
          The county assessor or state agency decides; this is documentation support, not legal or
          tax advice.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the state rule table, the
          classification engine and the flag rules. The same engine grades the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the state statutes and agency guidance for California, New York, Texas,
          Florida, Illinois, Pennsylvania, Ohio and Washington. Other states use a default rule and
          raise a verify flag. State figures and deadlines change; confirm them with the county
          assessor.
        </dd>
      </div>
    </dl>
  </section>
</main>
