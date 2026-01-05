import { Collection } from "@shared/api";

// In-memory store for collections
let collections: Collection[] = [];

/**
 * Create a new collection
 */
export function createCollection(
  name: string,
  description: string,
  image: string,
  slug: string
): Collection {
  const collection: Collection = {
    id: `collection-${Date.now()}`,
    name,
    description,
    image,
    slug,
    createdAt: new Date().toISOString(),
  };

  collections.push(collection);
  return collection;
}

/**
 * Get all collections
 */
export function getAllCollections(): Collection[] {
  return [...collections];
}

/**
 * Get collection by ID
 */
export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}

/**
 * Get collection by slug
 */
export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

/**
 * Update collection
 */
export function updateCollection(
  id: string,
  data: Partial<Omit<Collection, "id" | "createdAt">>
): Collection | undefined {
  const collection = collections.find((c) => c.id === id);
  if (collection) {
    Object.assign(collection, data);
  }
  return collection;
}

/**
 * Delete collection
 */
export function deleteCollection(id: string): boolean {
  const initialLength = collections.length;
  collections = collections.filter((c) => c.id !== id);
  return collections.length < initialLength;
}
