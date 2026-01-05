import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

interface DataFile {
  collections: Collection[];
  products: Array<{ id: string; collectionId: string; [key: string]: any }>;
}

function readData(): DataFile {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { collections: [], products: [] };
  }
}

function writeData(data: DataFile): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const getCollections: RequestHandler = (_req, res) => {
  const data = readData();
  res.json(data.collections);
};

export const getCollectionById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const collection = data.collections.find((c) => c.id === id || c.slug === id);

  if (!collection) {
    res.status(404).json({ error: "Collection not found" });
    return;
  }

  // Get products in this collection
  const products = data.products.filter(
    (p) => p.collectionId === collection.id,
  );

  res.json({ ...collection, products });
};

export const createCollection: RequestHandler = (req, res) => {
  const { name, description, image } = req.body;

  if (!name) {
    res.status(400).json({ error: "Collection name is required" });
    return;
  }

  const data = readData();

  // Generate slug
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  const id = slug;

  // Check if collection already exists
  if (data.collections.some((c) => c.id === id)) {
    res.status(400).json({ error: "Collection already exists" });
    return;
  }

  const newCollection: Collection = {
    id,
    name,
    slug,
    description: description || "",
    image: image || undefined,
  };

  data.collections.push(newCollection);
  writeData(data);

  res.status(201).json(newCollection);
};

export const updateCollection: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  const data = readData();
  const collectionIndex = data.collections.findIndex((c) => c.id === id);

  if (collectionIndex === -1) {
    res.status(404).json({ error: "Collection not found" });
    return;
  }

  const updatedCollection: Collection = {
    ...data.collections[collectionIndex],
    name: name || data.collections[collectionIndex].name,
    description:
      description !== undefined
        ? description
        : data.collections[collectionIndex].description,
    image:
      image !== undefined ? image : data.collections[collectionIndex].image,
  };

  data.collections[collectionIndex] = updatedCollection;
  writeData(data);

  res.json(updatedCollection);
};

export const deleteCollection: RequestHandler = (req, res) => {
  const { id } = req.params;
  const data = readData();

  const collectionIndex = data.collections.findIndex((c) => c.id === id);

  if (collectionIndex === -1) {
    res.status(404).json({ error: "Collection not found" });
    return;
  }

  // Check if collection has products
  const hasProducts = data.products.some((p) => p.collectionId === id);
  if (hasProducts) {
    res.status(400).json({
      error:
        "Cannot delete collection with products. Delete all products first.",
    });
    return;
  }

  const deleted = data.collections.splice(collectionIndex, 1);
  writeData(data);

  res.json(deleted[0]);
};
