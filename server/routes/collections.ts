import { RequestHandler } from "express";
import { z } from "zod";
import {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "../data/collections";
import { Collection } from "@shared/api";

const collectionSchema = z.object({
  name: z.string().min(2, "Invalid name").max(100, "Name too long"),
  description: z
    .string()
    .min(10, "Invalid description")
    .max(500, "Description too long"),
  image: z.string().url("Invalid image URL"),
  slug: z
    .string()
    .min(2, "Invalid slug")
    .max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
});

type CollectionInput = z.infer<typeof collectionSchema>;

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 500);
}

export const handleGetCollections: RequestHandler = (_req, res) => {
  try {
    const collections = getAllCollections();
    res.status(200).json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching collections",
    });
  }
};

export const handleCreateCollection: RequestHandler = (req, res) => {
  try {
    const validationResult = collectionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Validation failed: " + validationResult.error.errors[0].message,
      });
    }

    const data = validationResult.data as CollectionInput;

    const sanitizedData = {
      name: sanitizeInput(data.name),
      description: sanitizeInput(data.description),
      image: sanitizeInput(data.image),
      slug: sanitizeInput(data.slug),
    };

    const collection = createCollection(
      sanitizedData.name,
      sanitizedData.description,
      sanitizedData.image,
      sanitizedData.slug,
    );

    res.status(201).json({
      success: true,
      collection,
      message: "Collection created successfully",
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({
      success: false,
      message: "Error creating collection",
    });
  }
};

export const handleGetCollection: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    const collection = getCollectionById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching collection",
    });
  }
};

export const handleUpdateCollection: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    const validationResult = collectionSchema.partial().safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message:
          "Validation failed: " + validationResult.error.errors[0].message,
      });
    }

    const data = validationResult.data;

    const sanitizedData: Partial<Omit<Collection, "id" | "createdAt">> = {};
    if (data.name) sanitizedData.name = sanitizeInput(data.name);
    if (data.description)
      sanitizedData.description = sanitizeInput(data.description);
    if (data.image) sanitizedData.image = sanitizeInput(data.image);
    if (data.slug) sanitizedData.slug = sanitizeInput(data.slug);

    const collection = updateCollection(id, sanitizedData);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
      message: "Collection updated successfully",
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({
      success: false,
      message: "Error updating collection",
    });
  }
};

export const handleDeleteCollection: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    const success = deleteCollection(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting collection",
    });
  }
};
