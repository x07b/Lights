import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
  pdfFile?: string | null;
  pdfFilename?: string | null;
  specifications: Specification[];
}

interface DataFile {
  collections: Array<{ id: string; name: string; slug: string; description: string }>;
  products: Product[];
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

export const getProducts: RequestHandler = (_req, res) => {
  const data = readData();
  res.json(data.products);
};

export const getProductById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const product = data.products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
};

export const createProduct: RequestHandler = (req, res) => {
  const {
    name,
    description,
    price,
    images,
    category,
    collectionId,
    pdfFile,
    pdfFilename,
    specifications,
  } = req.body;

  if (!name || !description || price === undefined || !collectionId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const data = readData();

  // Generate slug and ID
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  const id = `product-${Date.now()}`;

  const newProduct: Product = {
    id,
    collectionId,
    name,
    description,
    price,
    images: images || [],
    category: category || "Uncategorized",
    slug,
    pdfFile: pdfFile || null,
    pdfFilename: pdfFilename || null,
    specifications: specifications || [],
  };

  data.products.push(newProduct);
  writeData(data);

  res.status(201).json(newProduct);
};

export const updateProduct: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const data = readData();
  const productIndex = data.products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  data.products[productIndex] = {
    ...data.products[productIndex],
    ...updates,
    id: data.products[productIndex].id,
    pdfFile: updates.pdfFile !== undefined ? updates.pdfFile : data.products[productIndex].pdfFile,
    pdfFilename: updates.pdfFilename !== undefined ? updates.pdfFilename : data.products[productIndex].pdfFilename,
  };

  writeData(data);
  res.json(data.products[productIndex]);
};

export const deleteProduct: RequestHandler = (req, res) => {
  const { id } = req.params;
  const data = readData();

  const productIndex = data.products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const deleted = data.products.splice(productIndex, 1);
  writeData(data);

  res.json(deleted[0]);
};

export const addProductImage: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    res.status(400).json({ error: "Image URL required" });
    return;
  }

  const data = readData();
  const product = data.products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (!product.images.includes(imageUrl)) {
    product.images.push(imageUrl);
    writeData(data);
  }

  res.json(product);
};

export const removeProductImage: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  const data = readData();
  const product = data.products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  product.images = product.images.filter((img) => img !== imageUrl);
  writeData(data);

  res.json(product);
};
