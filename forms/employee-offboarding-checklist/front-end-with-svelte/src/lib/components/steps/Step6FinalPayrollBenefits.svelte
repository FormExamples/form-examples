<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '$lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.finalPayrollBenefits;
</script>

<Fieldset legend="Final Payroll & Benefits">
	<p class="hint">Confirm the final pay run, holiday settlement, tax documents, and benefits termination.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Final salary calculated">
			<YesNoRadio label="Final salary calculated" name="finalSalaryCalculated" bind:value={d.finalSalaryCalculated} />
		</Field>
		<Field label="Accrued holiday paid">
			<YesNoRadio label="Accrued holiday paid" name="accruedHolidayPaid" bind:value={d.accruedHolidayPaid} />
		</Field>
		<Field label="Expenses reimbursed">
			<YesNoRadio label="Expenses reimbursed" name="expensesReimbursed" bind:value={d.expensesReimbursed} />
		</Field>
		<Field label="Pension information provided">
			<YesNoRadio label="Pension information provided" name="pensionInformationProvided" bind:value={d.pensionInformationProvided} />
		</Field>
		<Field label="P45 / final tax document issued">
			<YesNoRadio label="P45 / final tax document issued" name="p45Issued" bind:value={d.p45Issued} />
		</Field>
		<Field label="Benefits terminated">
			<YesNoRadio label="Benefits terminated" name="benefitsTerminated" bind:value={d.benefitsTerminated} />
		</Field>
		<Field label="Payroll details confirmed with employee">
			<YesNoRadio label="Payroll details confirmed with employee" name="payrollDetailsConfirmed" bind:value={d.payrollDetailsConfirmed} />
		</Field>
		<Field label="Final payment date" inputId="finalPaymentDate">
			<DateInput id="finalPaymentDate" label="Final payment date" bind:value={d.finalPaymentDate} />
		</Field>
	</div>

	<Field label="Notes" inputId="finalPayrollNotes">
		<TextAreaInput id="finalPayrollNotes" label="Notes" rows={3} bind:value={d.finalPayrollNotes} />
	</Field>
</Fieldset>
