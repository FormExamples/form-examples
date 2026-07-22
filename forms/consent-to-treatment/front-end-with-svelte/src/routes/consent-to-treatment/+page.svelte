<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the consent form and the clinician
	// dashboard. The collection routes (`/consents-to-treatment` and
	// `/consents-to-treatment/new`) hold the actual functionality.
	const plural = 'consents-to-treatment';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/consent-to-treatment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new consent form</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step consent form. One continuous single-page wizard that validates
				completeness as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/consent-to-treatment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse consent records with their computed completeness status and consent decision, and
				filter by status and consent.
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
					Capture a structured informed-consent record and produce a validated report —
					completeness status, percentage complete, and flagged issues — to support the consent
					process and clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness-validation
					engine, and the flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Records informed consent for a medical procedure, validated against the required sections
					a valid consent form must contain.
				</dd>
			</div>
		</dl>
	</section>
</main>
