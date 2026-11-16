<script lang="ts">
    // TagInputDiv component
    //
    // A group holding the consumer's tags and a text field that adds to them. When
    // the user types a value and presses Enter, the component calls the onadd
    // callback with the trimmed text and clears the field. The tags are the
    // consumer's: it keeps the collection and renders it as children, with its own
    // remove buttons.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the group and the field, via aria-label.
    //   value — string, default "". Current input text; bindable with bind:value.
    //   onadd — (value: string) => void, optional. Callback fired when Enter is pressed with non-empty trimmed value.
    //   disabled — boolean, default false. Whether the field is disabled.
    //   placeholder, name, required — set on the field.
    //   children — Snippet, optional. The tags so far.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <TagInputDiv label="Add tag" bind:value onadd={(tag) => tags.push(tag)}>
    //       {#each tags as tag}<Tag>{tag}</Tag>{/each}
    //   </TagInputDiv>
    //
    // Examples:
    //   <!-- Tag input with add handler -->
    //   <TagInputDiv label="Add skill" bind:value onadd={(skill) => skills = [...skills, skill]} />
    //
    // Keyboard:
    //   - Enter: when the field has a non-empty trimmed value, calls onadd and clears the field.
    //     With no text it stays a normal Enter, which submits a surrounding form. Enter during
    //     an IME composition confirms the composition, so it adds nothing.
    //
    // Accessibility:
    //   - role="group" with aria-label={label} names the tags and the field together
    //   - aria-label={label} names the text field
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable("") for two-way binding on value
    //   - Enter handler calls preventDefault to avoid form submission
    //
    // References:
    //   - WAI-ARIA textbox role: https://www.w3.org/TR/wai-aria-1.2/#textbox

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        onadd,
        disabled = false,
        placeholder = undefined,
        name = undefined,
        required = false,
        children = undefined,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current input value. Bindable. */
        value?: string;
        /** Callback when a tag is submitted. */
        onadd?: (value: string) => void;
        /** Whether disabled. */
        disabled?: boolean;
        /** The field's placeholder. */
        placeholder?: string;
        /** The field's name. */
        name?: string;
        /** Whether the field is required. */
        required?: boolean;
        /** The tags so far. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "TagInputDiv",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.isComposing && value.trim()) {
            event.preventDefault();
            onadd?.(value.trim());
            value = "";
        }
    }
</script>

<!-- TagInputDiv.svelte -->
<div
    class={`tag-input-div ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
    <input
        class="tag-input-div-field"
        type="text"
        aria-label={label}
        bind:value
        {onkeydown}
        {disabled}
        {placeholder}
        {name}
        {required}
    />
</div>
