<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let mode = $state<'login' | 'register'>('login');
	let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-indigo-600">Skillio</h1>
			<p class="mt-2 text-gray-500">Learn smarter with spaced repetition</p>
		</div>

		<!-- Card -->
		<div class="rounded-2xl border border-gray-200 bg-white p-8">
			<!-- Tabs -->
			<div class="mb-6 flex rounded-lg bg-gray-100 p-1">
				<button
					type="button"
					onclick={() => (mode = 'login')}
					class="flex-1 rounded-md py-2 text-sm font-medium transition-colors {mode === 'login'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Sign in
				</button>
				<button
					type="button"
					onclick={() => (mode = 'register')}
					class="flex-1 rounded-md py-2 text-sm font-medium transition-colors {mode === 'register'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Create account
				</button>
			</div>

			<!-- Form -->
			<form
				method="POST"
				action={mode === 'login' ? '?/signInEmail' : '?/signUpEmail'}
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="flex flex-col gap-4"
			>
				{#if mode === 'register'}
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-gray-700">Name</label>
						<input
							id="name"
							type="text"
							name="name"
							placeholder="Your name"
							required
							class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
						/>
					</div>
				{/if}

				<div>
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
					<input
						id="email"
						type="email"
						name="email"
						placeholder="you@example.com"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
					/>
				</div>

				<div>
					<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label
					>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="••••••••"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
					/>
				</div>

				{#if form?.message}
					<p class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
						{form.message}
					</p>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
				>
					{#if loading}
						<span class="flex items-center justify-center gap-2">
							<span
								class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></span>
							{mode === 'login' ? 'Signing in...' : 'Creating account...'}
						</span>
					{:else}
						{mode === 'login' ? 'Sign in' : 'Create account'}
					{/if}
				</button>
			</form>
		</div>

		<p class="mt-6 text-center text-xs text-gray-400">Your learning journey starts here.</p>
	</div>
</div>
