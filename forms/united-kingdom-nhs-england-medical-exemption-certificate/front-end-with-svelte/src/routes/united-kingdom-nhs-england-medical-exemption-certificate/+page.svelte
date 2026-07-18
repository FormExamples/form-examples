<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the FP92A application form and the
	// practitioner dashboard. The collection routes hold the functionality.
	const plural = 'united-kingdom-nhs-england-medical-exemption-certificates';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">UK NHS England Medical Exemption Certificate</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">FP92A medical exemption application</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A single continuous wizard for capturing the data needed for an FP92A medical exemption
			application — practitioner and patient identification, existing-exemption and age / pregnancy
			checks, qualifying-condition selection and detail, and disability / appliance attestation —
			whose shared engine evaluates eligibility against the ten NHSBSA-recognised qualifying
			conditions before the practitioner prints and posts the signed paper form to NHSBSA Bridge
			House, which only accepts the original in ink.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-nhs-england-medical-exemption-certificate/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new application</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step application form. One continuous single-page wizard that evaluates
				eligibility as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-nhs-england-medical-exemption-certificate/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Practitioner dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse applications with their computed eligibility outcome, eligible-condition count, and
				flag count, and filter by outcome and flagged status.
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
					Capture a structured FP92A data set and produce an eligibility outcome — eligible,
					ineligible, or requires clarification — with fired rules, advisory flags, and the
					five-year validity window, to support the practitioner before posting the paper form.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the rule-based eligibility
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Implements the NHSBSA FP92A medical exemption certificate eligibility list of ten
					qualifying conditions, with redirects to FW8 (maternity) and age-based exemption.
				</dd>
			</div>
		</dl>
	</section>
</main>
