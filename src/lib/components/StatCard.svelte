<script lang="ts">
	let {
		label,
		value,
		color = 'gray'
	}: {
		label: string;
		value: string | number;
		color?: 'gray' | 'indigo' | 'amber' | 'green';
	} = $props();

	const colorMap = {
		gray: 'text-gray-900',
		indigo: 'text-indigo-600',
		amber: 'text-amber-500',
		green: 'text-green-600'
	};
</script>

<div class="rounded-xl border border-gray-200 bg-white p-5">
	<p class="text-sm text-gray-500">{label}</p>
	<p class="mt-1 text-3xl font-semibold {colorMap[color]}">{value}</p>
</div>
