<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MedicalBannerBoxForAdvice from './MedicalBannerBoxForAdvice.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MedicalBannerBoxForAdvice',
    component: MedicalBannerBoxForAdvice,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Medical Banner Box For Advice'}}
>
  <p>Banner message</p>
</Story>
