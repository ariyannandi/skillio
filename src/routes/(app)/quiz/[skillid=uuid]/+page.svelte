<script lang="ts">
	import type { PageProps } from './$types';
	import type { QuizQuestion } from '$lib/server/gemini';

	let { data }: PageProps = $props();

	let questions = $state<QuizQuestion[]>(data.questions);
	let currentIndex = $state(0);
	let current = $derived(questions[currentIndex]);
	let selected = $state<number[]>([]);
	let revealed = $state(false);
	let done = $state(false);
	let score = $state(0);

	function toggle(i: number) {
		if (revealed) return;
		if (current.multiSelect) {
			selected = selected.includes(i) ? selected.filter((s) => s !== i) : [...selected, i];
		} else {
			selected = [i];
		}
	}

	function check() {
		revealed = true;
		const correct =
			selected.length === current.answerIndices.length &&
			selected.every((s) => current.answerIndices.includes(s));
		if (correct) score += 1;
	}

	function next() {
		if (currentIndex + 1 >= questions.length) {
			done = true;
		} else {
			currentIndex += 1;
			selected = [];
			revealed = false;
		}
	}

	function optionState(i: number): string {
		if (!revealed) {
			return selected.includes(i)
				? 'border-indigo-400 bg-indigo-50 text-indigo-800'
				: 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300';
		}
		if (current.answerIndices.includes(i)) return 'border-green-400 bg-green-50 text-green-800';
		if (selected.includes(i)) return 'border-red-400 bg-red-50 text-red-800';
		return 'border-gray-200 bg-white text-gray-400';
	}
</script>

<div class="mb-8 flex items-center justify-between">
	<div>
		<a href="/quiz" class="text-sm text-indigo-600 hover:underline">← Back to quiz</a>
		<h1 class="mt-1 text-2xl font-semibold text-gray-900">{data.skill.name} Quiz</h1>
	</div>
	{#if !done}
		<span class="text-sm text-gray-400">{currentIndex + 1} / {questions.length}</span>
	{/if}
</div>

{#if done}
	<div class="mx-auto max-w-xl py-16 text-center">
		<p class="mb-4 text-5xl">
			{score === questions.length ? '🏆' : score >= questions.length / 2 ? '👍' : '📚'}
		</p>
		<h2 class="text-2xl font-semibold text-gray-900">Quiz complete!</h2>
		<p class="mt-2 text-gray-500">You scored {score} out of {questions.length}</p>
		<div class="mt-8 flex justify-center gap-3">
			<a
				href="/quiz/{data.skill.id}"
				class="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
				>Try again</a
			>
			<a
				href="/quiz"
				class="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300"
				>Pick another skill</a
			>
		</div>
	</div>
{:else if current}
	<div class="mx-auto max-w-xl">
		<!-- Progress bar -->
		<div class="mb-6 h-1.5 w-full rounded-full bg-gray-100">
			<div
				class="h-1.5 rounded-full bg-indigo-600 transition-all"
				style="width: {(currentIndex / questions.length) * 100}%"
			></div>
		</div>

		{#if current.multiSelect}
			<p
				class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-600"
			>
				Select all correct answers
			</p>
		{/if}

		<!-- Question -->
		<div class="mb-6 rounded-2xl border border-gray-200 bg-white p-8">
			<p class="mb-3 text-xs font-medium text-gray-400">Question {currentIndex + 1}</p>
			<p class="text-lg font-medium text-gray-900">{current.question}</p>
		</div>

		<!-- Options -->
		<div class="mb-6 flex flex-col gap-3">
			{#each current.options as option, i}
				<button
					onclick={() => toggle(i)}
					disabled={revealed}
					class="w-full rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors {optionState(
						i
					)}"
				>
					<span class="mr-3 font-semibold">{String.fromCharCode(65 + i)}.</span>{option}
				</button>
			{/each}
		</div>

		<!-- Check / Next -->
		{#if !revealed}
			<button
				onclick={check}
				disabled={selected.length === 0}
				class="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
			>
				Check answer
			</button>
		{:else}
			<div class="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
				<p
					class="mb-2 text-xs font-medium {selected.every((s) =>
						current.answerIndices.includes(s)
					) && selected.length === current.answerIndices.length
						? 'text-green-600'
						: 'text-red-600'}"
				>
					{selected.every((s) => current.answerIndices.includes(s)) &&
					selected.length === current.answerIndices.length
						? '✓ Correct!'
						: '✗ Incorrect'}
				</p>
				<p class="text-sm text-gray-700">{current.explanation}</p>
			</div>
			<button
				onclick={next}
				class="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
			>
				{currentIndex + 1 === questions.length ? 'See results' : 'Next question →'}
			</button>
		{/if}
	</div>
{/if}
