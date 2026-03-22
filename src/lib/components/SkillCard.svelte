<script lang="ts">
	import Badge from './Badge.svelte';

	let {
		id,
		name,
		description,
		category,
		enrolled = false,
		xp = null,
		href
	}: {
		id: string;
		name: string;
		description?: string | null;
		category: string;
		enrolled?: boolean;
		xp?: number | null;
		href?: string;
	} = $props();
</script>

<a
	href={href ?? `/skills/${id}`}
	class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300"
>
	<Badge text={category} />
	<div>
		<h2 class="font-semibold text-gray-900">{name}</h2>
		{#if description}
			<p class="mt-1 text-sm text-gray-500">{description}</p>
		{/if}
	</div>
	{#if enrolled}
		<span class="text-sm font-medium text-green-600">✓ Enrolled</span>
	{/if}
	{#if xp !== null}
		<p class="text-sm text-gray-400">{xp} XP</p>
	{/if}
</a>
