<script lang="ts">
  // The form root is a welcome page: a one-sentence summary, prominent links
  // to every working surface, then a plain-language explanation of the form.
  const plural = 'medical-device-assessments';
</script>

<header class="page-header">
  <div class="page-header-inner">
    <h1>Medical Device Assessment</h1>
    <p class="subtitle">
      Work out the EU MDR / UK MDR risk class of a medical device, its conformity route and its
      regulatory readiness from a short step-by-step questionnaire.
    </p>
  </div>
</header>

<main class="mx-16 px-4 py-8">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/medical-device-assessment/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new assessment</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the nine-step wizard. One continuous single-page form that computes the device class as
        you answer.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/medical-device-assessment/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Assessment dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse assessed devices with their computed and final class, conformity route, determining
        rule, readiness and flags, and filter by class, route and readiness.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
    </a>
  </div>

  <section class="mt-12">
    <h2 class="text-lg font-semibold text-base-content">About this work</h2>
    <dl class="mt-4 space-y-4 text-sm">
      <div>
        <dt class="font-semibold text-base-content">What it captures</dt>
        <dd class="mt-1 text-base-content/70">
          Who makes the device and who is assessing it, what the device is for, how it touches the
          body, whether it is powered, whether it contains software, any special characteristics
          (medicinal substances, tissues, nanomaterials, and so on), the Class I suffix modifiers
          (sterile, measuring, reusable), and the evidence and systems a manufacturer needs in
          place.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">What it computes</dt>
        <dd class="mt-1 text-base-content/70">
          The classification rules of MDR Annex VIII are applied to your answers and the highest
          class wins. You get the computed class, the final class (you may override it with a
          recorded reason), the conformity-assessment route, the rule that decided the class, a
          readiness verdict, and a list of flags with suggested actions. In vitro diagnostic devices
          are out of scope: they fall under the IVDR and the form tells you so.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the classification engine and
          the flag rules. The same pure engine grades the wizard, the report and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Grounding</dt>
        <dd class="mt-1 text-base-content/70">
          EU Regulation 2017/745 (MDR) Annex VIII, the UK Medical Devices Regulations 2002, MDCG
          2019-11 guidance, and the ISO 14971, ISO 13485 and IEC 62304 standards. This is a
          simplified aid to a classification discussion, not a substitute for the regulation or for
          advice from a notified body.
        </dd>
      </div>
    </dl>
  </section>
</main>
