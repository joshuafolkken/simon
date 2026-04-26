import { test, expect } from '@playwright/test';

test('title screen renders with canvas', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('canvas')).toBeVisible();
});

test('clicking title screen starts game', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('canvas')).toBeVisible();
	await page.locator('.title-container').click();
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
});
