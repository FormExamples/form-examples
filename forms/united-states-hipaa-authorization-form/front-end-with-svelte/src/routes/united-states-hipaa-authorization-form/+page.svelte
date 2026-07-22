<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the authorization form and the review
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'united-states-hipaa-authorization-forms';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-states-hipaa-authorization-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new authorization</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step authorization form. One continuous single-page wizard that checks
				validity as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-states-hipaa-authorization-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Review dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted authorizations with their computed validity status, completeness, and flag
				counts, and filter by validity and purpose.
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
					Capture a structured HIPAA authorization — patient and signer identification, disclosing
					source, recipient, records to disclose, purpose, expiration, patient-rights acknowledgements,
					and signature — and produce a validity report (valid / invalid status, completeness, fired
					rules with citations, and additional flags) to support a medical-records release decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Rule-based validation against the core elements (§ 164.508(c)(1)) and required statements
					(§ 164.508(c)(2)), plus sensitive-category rules for 42 CFR Part 2 substance-use records,
					HIV/AIDS, mental-health, psychotherapy notes, and VA § 7332 records.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Modelled on the Tennessee Department of Human Services form HS-2557. The same engine
					validates both the form and the dashboard.
				</dd>
			</div>
		</dl>
	</section>
</main>
