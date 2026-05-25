<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UnitedStatesSocialSecurityNumberView from './UnitedStatesSocialSecurityNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UnitedStatesSocialSecurityNumberView',
    component: UnitedStatesSocialSecurityNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'United States Social Security Number View'}}
/>
