<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the examination form and the clinician
	// dashboard.
	const plural = 'mental-state-examinations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/mental-state-examination/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new examination</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step MSE. One continuous single-page wizard that grades completeness and
				risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/mental-state-examination/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed completeness status and risk indicator, and
				filter by risk level and completeness.
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
					Capture the mental state across the seven ASEPTIC domains and produce a graded report — a
					complete / partial classification, a completeness percentage, a risk indicator (none / low /
					moderate / high), and flagged issues — to support the mental state section of a clinical
					record and prompt escalation where risk is flagged.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Oxford Handbook of Psychiatry, Trzepacz &amp; Baker, and NICE NG225. A
					documentation and completeness aid, not a diagnosis, and not a replacement for a full risk
					assessment.
				</dd>
			</div>
		</dl>
	</section>
</main>
