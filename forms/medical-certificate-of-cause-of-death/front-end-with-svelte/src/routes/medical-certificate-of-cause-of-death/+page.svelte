<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the certification wizard and the
	// clinician dashboard.
	const plural = 'medical-certificates-of-cause-of-death';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/medical-certificate-of-cause-of-death/{plural}/new"
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
			href="/medical-certificate-of-cause-of-death/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
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
					Capture a Medical Certificate of Cause of Death and produce a graded report — a validity
					class, the derived underlying cause, and flagged issues — to support complete, consistent,
					and lawful death certification. Certification and referral decisions rest with the
					certifying doctor, coroner, and medical examiner, not this software.
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
					Drawn from the ONS guidance for doctors completing MCCDs, the Coroners and Justice Act 2009,
					and the statutory NHS medical-examiner system. A documentation and validation aid, not the
					prescribed statutory certificate, which remains the definitive legal record.
				</dd>
			</div>
		</dl>
	</section>
</main>
