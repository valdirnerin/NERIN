import { test, expect } from '@playwright/test'

test('home hero muestra CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Obras eléctricas premium/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Pedir presupuesto' })).toBeVisible()
})
