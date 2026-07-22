<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the acknowledgement form and the
	// governance dashboard. The collection routes
	// (`/research-and-planning-privacy-notices` and `/…/new`) hold the actual
	// functionality.
	const plural = 'research-and-planning-privacy-notices';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/research-and-planning-privacy-notice/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new acknowledgement</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that records the recipient's
				opt-out preferences and acknowledgement of the research and planning privacy notice.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/research-and-planning-privacy-notice/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Governance dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded acknowledgements with their computed completeness and status, and filter by
				status and Type 1 opt-out preference.
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
					Record a recipient's opt-out preferences (Type 1 and the NHS National Data Opt-Out) and
					acknowledgement and signature confirming they have been shown how confidential patient
					information is used for approved research and service planning, and produce a
					completeness-graded summary — status, missing required fields, and flagged issues — for
					information-governance records.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the required-field validation
					engine, and the governance flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with UK GDPR, the Data Protection Act 2018, the Common Law Duty of Confidentiality,
					and the NHS National Data Opt-Out framework (Type 1 and National Data Opt-Out), with legal
					bases under UK GDPR Article 6(1)(e) and Article 9(2)(h)/(j).
				</dd>
			</div>
		</dl>
	</section>
</main>
