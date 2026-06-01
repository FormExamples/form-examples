<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DeutschlandKrankenversichertennummerInput from './DeutschlandKrankenversichertennummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DeutschlandKrankenversichertennummerInput',
    component: DeutschlandKrankenversichertennummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Deutschland Krankenversichertennummer Input'}}
/>
