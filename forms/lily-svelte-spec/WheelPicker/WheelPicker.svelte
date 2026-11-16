<script lang="ts">
    // WheelPicker component
    //
    // A single-select listbox, vertical by default, where the selection follows the cursor: moving with the arrow keys, typing, or
    // clicking an option chooses it. Use it to pick one of a short list (hours, minutes, months, years) in the manner of a
    // scroll wheel. The component owns the roles, the keys and the selected value; the wheel LOOK (scroll snapping, fading,
    // 3-D) is the consumer's CSS. Pointer dragging and touch inertia are plain scrolling of `.wheel-picker-list`, and where it settles is chosen.
    //
    // Props:
    //   class — string, optional. Consumer class appended after the base class.
    //   label — string, required. Accessible name of the listbox.
    //   options — { value: string; label: string; disabled?: boolean }[], required.
    //   value — string, bindable, default "". The selected option's value; "" or an unknown value selects nothing.
    //   loop — boolean, default false. Arrow keys wrap from the last enabled option to the first and back.
    //   pageSize — number, default 5. Enabled options PageUp / PageDown move by.
    //   disabled — boolean, default false. Ignores keys and clicks; not focusable.
    //   orientation — "vertical" | "horizontal", default "vertical". Horizontal moves with ArrowLeft / ArrowRight, swapped
    //     right-to-left (the nearest `dir`).
    //   name — string, optional. When set, a hidden input carries the value for a form. It is disabled, so not submitted,
    //     while the picker is disabled, and a form reset puts the picker back to the value it was given first.
    //   form — string, optional. The id of the form the hidden input belongs to, when the picker sits outside it.
    //   onChange — (value: string) => void, optional. Called once when the selection changes: by a key, a click, or the user
    //     scrolling the wheel, once it settles (never for each option it passes).
    //   ...restProps — spread onto the root <div>.
    //
    // Markup:
    //   <div class="wheel-picker">
    //     <div class="wheel-picker-list" role="listbox" aria-orientation tabindex="0" aria-activedescendant>
    //       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
    //     </div>
    //     <input type="hidden" name value form? disabled?>   (only with `name`)
    //   </div>
    //
    // Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp (ArrowRight / ArrowLeft when horizontal), Home / End, PageDown / PageUp, type-ahead over
    // the labels. Disabled options are skipped.
    //
    // Scrolling (spec/detent-lessons, P26-T1): when the user turns the wheel (mouse wheel, touch, scroll bar) and it settles, the
    // enabled option nearest the middle is chosen. The component's own centring chooses nothing.
    //
    // Claude rules:
    //   - Headless: no CSS, no inline styles; no animation (the selected option is centred instantly).
    //   - No hardcoded user-facing strings.

    import { untrack } from "svelte";
    import { warnMissingName } from "../dev-warning";
    import {
        isWheelRtl,
        isWheelTypeaheadKey,
        nextWheelIndex,
        nextWheelPrefix,
        watchWheelScroll,
        wheelMoveKey,
        wheelTypeaheadIndex,
        type WheelOption,
        type WheelOrientation,
        type WheelTypeahead,
    } from "./wheel-picker";

    let {
        class: className = "",
        label,
        options,
        value = $bindable(""),
        loop = false,
        pageSize = 5,
        disabled = false,
        orientation = "vertical",
        name,
        form,
        onChange,
        ...restProps
    }: {
        /** Accessible name. */
        label: string;
        /** The choices. */
        options: WheelOption[];
        /** The selected option's value. Bindable. */
        value?: string;
        /** Arrow keys wrap at the ends. */
        loop?: boolean;
        /** Enabled options PageUp / PageDown move by. */
        pageSize?: number;
        /** Ignores keys and clicks. */
        disabled?: boolean;
        /** The axis the options run along. Default "vertical". */
        orientation?: WheelOrientation;
        /** Form field name for a hidden input. */
        name?: string;
        /** The id of the form the hidden input belongs to, when the picker is outside it. */
        form?: string;
        /** Called once when the selection changes. */
        onChange?: (value: string) => void;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "WheelPicker",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    const uid = $props.id();
    let list: HTMLElement | undefined = $state();
    // Typeahead state: the prefix typed so far and when the last key came. Plain (not $state) because nothing renders from it.
    let typeahead: WheelTypeahead = { prefix: "", at: 0 };

    // -1 when `value` matches no option; every move then starts from "nothing selected".
    const selectedIndex = $derived(options.findIndex((o) => o.value === value));

    function select(index: number): void {
        // -1 means no option can be selected (no enabled option, or a typeahead with no match): nothing changes.
        if (index < 0) return;
        const next = options[index].value;
        if (next === value) return; // applying the selection already held is a no-op
        value = next;
        onChange?.(next);
    }

    function onkeydown(event: KeyboardEvent): void {
        if (disabled) return;
        const move = wheelMoveKey(event.key, orientation, list ? isWheelRtl(list) : false);
        if (move) {
            event.preventDefault();
            select(nextWheelIndex(options, selectedIndex, move, { loop, pageSize }));
        } else if (isWheelTypeaheadKey(event)) {
            // The timestamp lets the helper restart the prefix after a pause; the helper decides, this component only supplies the clock.
            typeahead = nextWheelPrefix(typeahead, event.key, Date.now());
            select(wheelTypeaheadIndex(options, selectedIndex, typeahead.prefix));
        }
    }

    function onclick(event: MouseEvent): void {
        if (disabled) return;
        // The click may land on something inside an option, so find the option; its `data-index` is its place in `options`.
        const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
        if (!target || target.getAttribute("aria-disabled") === "true") return;
        select(Number(target.getAttribute("data-index")));
        // Focus stays on the list, which owns the keys, not on the option clicked.
        list?.focus();
    }

    // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
    function centre(): void {
        const index = selectedIndex;
        if (!list || index < 0) return;
        const option = list.querySelector<HTMLElement>(`[data-index="${index}"]`);
        if (!option) return;
        // Scroll the list directly rather than call `scrollIntoView`, which can also scroll the page. Moving by the distance between
        // the two middles works on either axis and in right-to-left, where `scrollLeft` counts from the right.
        const box = list.getBoundingClientRect();
        const row = option.getBoundingClientRect();
        if (orientation === "horizontal")
            list.scrollLeft += row.left + row.width / 2 - (box.left + box.width / 2);
        else list.scrollTop += row.top + row.height / 2 - (box.top + box.height / 2);
    }
    $effect(() => {
        void [list, selectedIndex, orientation];
        untrack(centre);
    });

    // Scrolling chooses: when the user turns the wheel and it settles, the option in the middle becomes the value.
    $effect(() => {
        if (!list) return;
        return watchWheelScroll(list, {
            options: () => options,
            selected: () => selectedIndex,
            orientation: () => orientation,
            disabled: () => disabled,
            choose: select,
            recentre: centre,
        });
    });

    // Form reset: the hidden input's value is its default, so a reset leaves it, and the picker, as the user left them. Put the
    // picker back to the value it was given first: one tick after `reset`, once the browser has reset the DOM, and not when the
    // reset was cancelled. A change is reported as any other.
    const initialValue = untrack(() => value);
    $effect(() => {
        // The form the hidden input belongs to: the one `form` names, else the one around the picker.
        const owner = form ? document.getElementById(form) : list?.closest("form");
        if (!owner) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented || value === initialValue) return;
                value = initialValue;
                onChange?.(initialValue);
            }, 0);
        };
        owner.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            owner.removeEventListener("reset", onReset);
        };
    });
</script>

<!-- WheelPicker.svelte -->
<div
    class={`wheel-picker ${className}`}
    {...restProps}
>
    <div
        bind:this={list}
        class="wheel-picker-list"
        role="listbox"
        aria-label={label}
        aria-orientation={orientation}
        aria-disabled={disabled ? "true" : undefined}
        aria-activedescendant={selectedIndex >= 0 ? `${uid}-option-${selectedIndex}` : undefined}
        tabindex={disabled ? -1 : 0}
        {onkeydown}
        {onclick}
    >
        {#each options as option, index (option.value)}
            <div
                class="wheel-picker-option"
                role="option"
                id={`${uid}-option-${index}`}
                aria-selected={index === selectedIndex}
                aria-disabled={option.disabled ? "true" : undefined}
                data-value={option.value}
                data-index={index}
            >
                {option.label}
            </div>
        {/each}
    </div>
    {#if name}
        <input
            type="hidden"
            {name}
            {value}
            {form}
            {disabled}
        />
    {/if}
</div>
