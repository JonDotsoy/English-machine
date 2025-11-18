import { test, expect } from '@playwright/test';

test.describe('Search functionality', () => {
  test('should display search bar on home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the search input is present
    const searchInput = page.getByPlaceholder('Search by title or description...');
    await expect(searchInput).toBeVisible();
  });

  test('should filter question sets when searching', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Count initial number of question cards
    const initialCards = await page.locator('a[aria-label^="Go to"]').count();
    expect(initialCards).toBeGreaterThan(0);
    
    // Type in search box
    const searchInput = page.getByPlaceholder('Search by title or description...');
    await searchInput.fill('phrasal');
    
    // Wait a bit for filtering to happen
    await page.waitForTimeout(500);
    
    // Count filtered cards
    const filteredCards = await page.locator('a[aria-label^="Go to"]').count();
    
    // Should have fewer cards after filtering
    expect(filteredCards).toBeLessThan(initialCards);
    expect(filteredCards).toBeGreaterThan(0);
  });

  test('should show empty state when no results match', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Search for something that doesn't exist
    const searchInput = page.getByPlaceholder('Search by title or description...');
    await searchInput.fill('xyzabc123notfound');
    
    // Wait for filtering
    await page.waitForTimeout(500);
    
    // Should show empty state message
    const emptyState = page.getByText('No question sets found matching your search');
    await expect(emptyState).toBeVisible();
  });

  test('should show all cards when search is cleared', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Count initial cards
    const initialCards = await page.locator('a[aria-label^="Go to"]').count();
    
    // Search for something
    const searchInput = page.getByPlaceholder('Search by title or description...');
    await searchInput.fill('phrasal');
    await page.waitForTimeout(500);
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Should show all cards again
    const finalCards = await page.locator('a[aria-label^="Go to"]').count();
    expect(finalCards).toBe(initialCards);
  });
});
