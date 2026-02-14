import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test-harness');
});

test('shows and dismisses a success toast', async ({ page }) => {
	await page.getByRole('button', { name: 'Trigger success' }).click();

	const successToast = page.getByText('Success toast');
	await expect(successToast).toBeVisible();

	await page.getByRole('button', { name: 'Dismiss all' }).click();
	await expect(successToast).toBeHidden();
});

test('handles promise success and error flows', async ({ page }) => {
	await page.getByRole('button', { name: 'Trigger promise success' }).click();
	await expect(page.getByText('Promise loading')).toBeVisible();
	await expect(page.getByText('Promise success: ok')).toBeVisible();

	await page.getByRole('button', { name: 'Trigger promise error' }).click();
	await expect(page.getByText('Promise error: fail')).toBeVisible();
});
