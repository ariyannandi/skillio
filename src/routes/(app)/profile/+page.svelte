<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let nameLoading = $state(false);
	let passwordLoading = $state(false);
</script>

<div class="mb-8">
	<h1 class="text-2xl font-semibold text-gray-900">Profile</h1>
	<p class="mt-1 text-gray-500">Manage your account details.</p>
</div>

<!-- Account info -->
<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6">
	<div class="flex items-center gap-4">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-600"
		>
			{data.user.name?.charAt(0).toUpperCase()}
		</div>
		<div>
			<p class="font-semibold text-gray-900">{data.user.name}</p>
			<p class="text-sm text-gray-400">{data.user.email}</p>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
	<!-- Update name -->
	<div class="rounded-xl border border-gray-200 bg-white p-6">
		<h2 class="mb-4 font-semibold text-gray-900">Display name</h2>
		<form
			method="POST"
			action="?/updateName"
			use:enhance={() => {
				nameLoading = true;
				return async ({ update }) => {
					await update();
					nameLoading = false;
				};
			}}
			class="flex flex-col gap-3"
		>
			<input
				type="text"
				name="name"
				value={data.user.name}
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
			/>
			{#if form?.nameError}
				<p class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
					{form.nameError}
				</p>
			{/if}
			{#if form?.nameSuccess}
				<p class="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
					Name updated!
				</p>
			{/if}
			<button
				type="submit"
				disabled={nameLoading}
				class="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
			>
				{nameLoading ? 'Saving...' : 'Update name'}
			</button>
		</form>
	</div>

	<!-- Update password -->
	<div class="rounded-xl border border-gray-200 bg-white p-6">
		<h2 class="mb-4 font-semibold text-gray-900">Change password</h2>
		<form
			method="POST"
			action="?/updatePassword"
			use:enhance={() => {
				passwordLoading = true;
				return async ({ update }) => {
					await update();
					passwordLoading = false;
				};
			}}
			class="flex flex-col gap-3"
		>
			<input
				type="password"
				name="currentPassword"
				placeholder="Current password"
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
			/>
			<input
				type="password"
				name="newPassword"
				placeholder="New password"
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
			/>
			<input
				type="password"
				name="confirmPassword"
				placeholder="Confirm new password"
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
			/>
			{#if form?.passwordError}
				<p class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
					{form.passwordError}
				</p>
			{/if}
			{#if form?.passwordSuccess}
				<p class="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
					Password changed!
				</p>
			{/if}
			<button
				type="submit"
				disabled={passwordLoading}
				class="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
			>
				{passwordLoading ? 'Saving...' : 'Change password'}
			</button>
		</form>
	</div>
</div>
