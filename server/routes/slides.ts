import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  order: number;
}

interface DataFile {
  heroSlides?: HeroSlide[];
  collections?: any[];
  products?: any[];
}

function readData(): DataFile {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    return { heroSlides: [] };
  }
}

function writeData(data: DataFile): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const getHeroSlides: RequestHandler = (_req, res) => {
  const data = readData();
  const slides = (data.heroSlides || []).sort((a, b) => a.order - b.order);
  res.json(slides);
};

export const createHeroSlide: RequestHandler = (req, res) => {
  const { image, alt } = req.body;

  if (!image) {
    res.status(400).json({ error: "Image URL is required" });
    return;
  }

  const data = readData();
  if (!data.heroSlides) {
    data.heroSlides = [];
  }

  const newSlide: HeroSlide = {
    id: `slide_${Date.now()}`,
    image,
    alt: alt || "Hero slide",
    order: data.heroSlides.length,
  };

  data.heroSlides.push(newSlide);
  writeData(data);

  res.status(201).json(newSlide);
};

export const updateHeroSlide: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { image, alt, order } = req.body;

  const data = readData();
  if (!data.heroSlides) {
    data.heroSlides = [];
  }

  const slideIndex = data.heroSlides.findIndex((s) => s.id === id);

  if (slideIndex === -1) {
    res.status(404).json({ error: "Slide not found" });
    return;
  }

  const updatedSlide: HeroSlide = {
    ...data.heroSlides[slideIndex],
    image: image || data.heroSlides[slideIndex].image,
    alt: alt !== undefined ? alt : data.heroSlides[slideIndex].alt,
    order: order !== undefined ? order : data.heroSlides[slideIndex].order,
  };

  data.heroSlides[slideIndex] = updatedSlide;
  writeData(data);

  res.json(updatedSlide);
};

export const deleteHeroSlide: RequestHandler = (req, res) => {
  const { id } = req.params;
  const data = readData();

  if (!data.heroSlides) {
    data.heroSlides = [];
  }

  const slideIndex = data.heroSlides.findIndex((s) => s.id === id);

  if (slideIndex === -1) {
    res.status(404).json({ error: "Slide not found" });
    return;
  }

  const deleted = data.heroSlides.splice(slideIndex, 1);

  // Re-order remaining slides
  data.heroSlides = data.heroSlides.map((slide, index) => ({
    ...slide,
    order: index,
  }));

  writeData(data);

  res.json(deleted[0]);
};
