<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the card wizard and the clinician
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'general-surgery-waiting-list-cards';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/general-surgery-waiting-list-card/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new card</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step card form. One continuous single-page wizard that computes the Waiting
				Time Status when you submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/general-surgery-waiting-list-card/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse waiting list cards with their computed Waiting Time Status and flag counts, and filter
				by clinical priority and status.
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
					Capture a structured waiting list entry — practitioner, patient, referral, waiting-list
					entry, appointment, communication, and sign-off — and produce a graded card — Waiting Time
					Status, days-to-target, days-to-breach, and flagged issues — to support the booking team.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the rule-based grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the NHS England Clinical Prioritisation framework (P1–P6), the 18-week consultant-led
					RTT standard, and the 52-week long-waiter harm-review rule.
				</dd>
			</div>
		</dl>
	</section>
</main>
