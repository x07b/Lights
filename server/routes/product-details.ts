import { supabase } from "../lib/supabase.js";

export interface DetailSection {
  id?: string;
  title: string;
  content: string;
  order?: number;
}

// Helper function to convert DB section to API format
function dbSectionToApi(dbSection: any): DetailSection {
  return {
    id: dbSection.id,
    title: dbSection.title,
    content: dbSection.content,
    order: dbSection.order_index || 0,
  };
}

export async function getProductDetails(req: any, res: any) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const { data: sections, error } = await supabase
      .from("product_details_sections")
      .select("*")
      .eq("product_id", productId)
      .order("order_index", { ascending: true });

    if (error) throw error;

    const apiSections = (sections || []).map(dbSectionToApi);
    res.json(apiSections);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
}

export async function upsertProductDetails(req: any, res: any) {
  try {
    const { productId } = req.params;
    const { sections } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Sections must be an array" });
    }

    // Delete existing sections for this product
    const { error: deleteError } = await supabase
      .from("product_details_sections")
      .delete()
      .eq("product_id", productId);

    if (deleteError) throw deleteError;

    // Insert new sections
    const sectionsToInsert = sections
      .filter((s: any) => s.title && s.content)
      .map((s: any, index: number) => ({
        product_id: productId,
        title: s.title,
        content: s.content,
        order_index: s.order || index,
      }));

    if (sectionsToInsert.length === 0) {
      return res.json([]);
    }

    const { data: insertedSections, error: insertError } = await supabase
      .from("product_details_sections")
      .insert(sectionsToInsert)
      .select();

    if (insertError) throw insertError;

    const apiSections = (insertedSections || []).map(dbSectionToApi);
    res.json(apiSections);
  } catch (error) {
    console.error("Error upserting product details:", error);
    res.status(500).json({ error: "Failed to save product details" });
  }
}

export async function deleteProductDetail(req: any, res: any) {
  try {
    const { productId, sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({ error: "Section ID is required" });
    }

    const { error } = await supabase
      .from("product_details_sections")
      .delete()
      .eq("id", sectionId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product detail:", error);
    res.status(500).json({ error: "Failed to delete product detail" });
  }
}
