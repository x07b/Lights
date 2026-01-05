import { supabase } from "../lib/supabase";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

// Helper function to convert DB collection to API format
function dbCollectionToApi(dbCollection: any): Collection {
  return {
    id: dbCollection.id,
    name: dbCollection.name,
    slug: dbCollection.slug,
    description: dbCollection.description || "",
    image: dbCollection.image || undefined,
  };
}

export async function getCollections(_req: any, res: any) {
  try {
    const { data: collections, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const apiCollections = collections?.map(dbCollectionToApi) || [];
    res.json(apiCollections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
}

export async function getCollectionById(req: any, res: any) {
  try {
    const { id } = req.params;

    // Try to find by id or slug
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (collectionError || !collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Get products in this collection
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("collection_id", collection.id);

    if (productsError) throw productsError;

    const apiCollection = dbCollectionToApi(collection);
    res.json({ ...apiCollection, products: products || [] });
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
}

export async function createCollection(req: any, res: any) {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      res.status(400).json({ error: "Collection name is required" });
      return;
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    const id = slug;

    // Check if collection already exists
    const { data: existing } = await supabase
      .from("collections")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      return res.status(400).json({ error: "Collection already exists" });
    }

    // Insert collection
    const { data: collection, error } = await supabase
      .from("collections")
      .insert({
        id,
        name,
        slug,
        description: description || "",
        image: image || null,
      })
      .select()
      .single();

    if (error) throw error;

    const apiCollection = dbCollectionToApi(collection);
    res.status(201).json(apiCollection);
  } catch (error: any) {
    console.error("Error creating collection:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({ error: "Collection already exists" });
    }
    res.status(500).json({ error: "Failed to create collection" });
  }
}

export async function updateCollection(req: any, res: any) {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    // Check if collection exists
    const { data: existingCollection, error: checkError } = await supabase
      .from("collections")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Prepare update data (only include fields that are provided)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image || null;

    // Update collection
    const { data: collection, error } = await supabase
      .from("collections")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const apiCollection = dbCollectionToApi(collection);
    res.json(apiCollection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
}

export async function deleteCollection(req: any, res: any) {
  try {
    const { id } = req.params;

    // Check if collection exists
    const { data: existingCollection, error: checkError } = await supabase
      .from("collections")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Check if collection has products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id")
      .eq("collection_id", id)
      .limit(1);

    if (productsError) throw productsError;

    if (products && products.length > 0) {
      return res.status(400).json({
        error:
          "Cannot delete collection with products. Delete all products first.",
      });
    }

    // Delete collection
    const { error: deleteError } = await supabase
      .from("collections")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({ id, deleted: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
}
