import categoryCatalog from "@/data/categories.json";
import type { Locale } from "@/app/messages";
import { routing } from "@/i18n/routing";
import type { Category } from "@/types/category";

export const categories = categoryCatalog as Category[];

const byId = new Map(categories.map((category) => [category.id, category]));

export function getCategoryById(id: string) {
  return byId.get(id);
}

export function getRootCategories() {
  return categories.filter((category) => category.parentId === null);
}

export function getChildren(parentId: string) {
  return categories.filter((category) => category.parentId === parentId);
}

export function getAncestors(categoryId: string): Category[] {
  const chain: Category[] = [];
  let current = getCategoryById(categoryId);

  while (current?.parentId) {
    const parent = getCategoryById(current.parentId);
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }

  return chain;
}

export function getCategoryChain(categoryId: string): Category[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return [...getAncestors(categoryId), category];
}

/** Slug segments from root to this node, e.g. ["fortojning", "ankare"]. */
export function getCategorySlugPath(categoryId: string): string[] {
  return getCategoryChain(categoryId).map((category) => category.slug);
}

export function categoryHref(categoryId: string) {
  const segments = getCategorySlugPath(categoryId);
  if (segments.length === 0) return "/c";
  return `/c/${segments.join("/")}`;
}

export function categoryPath(
  categoryId: string,
  locale: Locale,
): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const href = categoryHref(categoryId);
  return `${prefix}${href}`;
}

export function formatCategoryPathLabel(
  categoryId: string,
  locale: Locale,
  separator = " › ",
) {
  return getCategoryChain(categoryId)
    .map((category) => category.name[locale])
    .join(separator);
}

export function getCategoryBySlugPath(slugs: string[]): Category | undefined {
  if (slugs.length === 0) return undefined;

  let parentId: string | null = null;
  let matched: Category | undefined;

  for (const slug of slugs) {
    matched = categories.find(
      (category) =>
        category.slug === slug && category.parentId === parentId,
    );
    if (!matched) return undefined;
    parentId = matched.id;
  }

  return matched;
}

export function getDescendantCategoryIds(categoryId: string): string[] {
  const ids = [categoryId];
  const queue = [categoryId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const child of getChildren(current)) {
      ids.push(child.id);
      queue.push(child.id);
    }
  }

  return ids;
}
