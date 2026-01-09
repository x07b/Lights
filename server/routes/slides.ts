import { supabase } from "../lib/supabase";

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  order: number;
  title: string;
  description: string;
  button1_text: string;
  button1_link: string;
  button2_text: string;
  button2_link: string;
}

// Helper function to convert DB slide to API format
function dbSlideToApi(dbSlide: any): HeroSlide {
  return {
    id: dbSlide.id,
    image: dbSlide.image,
    alt: dbSlide.alt || "Hero slide",
    order: dbSlide.order_index || 0,
    title: dbSlide.title || "Slide Title",
    description: dbSlide.description || "Slide description",
    button1_text: dbSlide.button1_text || "Découvrir",
    button1_link: dbSlide.button1_link || "/products",
    button2_text: dbSlide.button2_text || "En savoir plus",
    button2_link: dbSlide.button2_link || "/about",
  };
}

// Helper function to convert API slide to DB format
function apiSlideToDb(apiSlide: Partial<HeroSlide>): any {
  const dbSlide: any = {};
  if (apiSlide.image !== undefined) dbSlide.image = apiSlide.image;
  if (apiSlide.alt !== undefined) dbSlide.alt = apiSlide.alt;
  if (apiSlide.order !== undefined) dbSlide.order_index = apiSlide.order;
  if (apiSlide.title !== undefined) dbSlide.title = apiSlide.title;
  if (apiSlide.description !== undefined) dbSlide.description = apiSlide.description;
  if (apiSlide.button1_text !== undefined) dbSlide.button1_text = apiSlide.button1_text;
  if (apiSlide.button1_link !== undefined) dbSlide.button1_link = apiSlide.button1_link;
  if (apiSlide.button2_text !== undefined) dbSlide.button2_text = apiSlide.button2_text;
  if (apiSlide.button2_link !== undefined) dbSlide.button2_link = apiSlide.button2_link;
  return dbSlide;
}

export async function getHeroSlides(_req: any, res: any) {
  try {
    const { data: slides, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    const apiSlides = (slides || []).map(dbSlideToApi);
    res.json(apiSlides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    res.status(500).json({ error: "Failed to fetch hero slides" });
  }
}

export async function createHeroSlide(req: any, res: any) {
  try {
    const { image, alt, order } = req.body;

    if (!image) {
      res.status(400).json({ error: "Image URL is required" });
      return;
    }

    // Get current max order_index if order not provided
    let orderIndex = order;
    if (orderIndex === undefined) {
      const { data: existingSlides } = await supabase
        .from("hero_slides")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);

      orderIndex =
        existingSlides && existingSlides.length > 0
          ? (existingSlides[0].order_index || 0) + 1
          : 0;
    }

    const slideId = `slide_${Date.now()}`;

    const { data, error } = await supabase
      .from("hero_slides")
      .insert({
        id: slideId,
        image,
        alt: alt || "Hero slide",
        order_index: orderIndex,
      })
      .select();

    if (error) throw error;

    // Handle array response from insert().select()
    const slide = Array.isArray(data) ? data[0] : data;
    if (!slide) {
      throw new Error("Failed to retrieve inserted slide");
    }

    const apiSlide = dbSlideToApi(slide);
    res.status(201).json(apiSlide);
  } catch (error) {
    console.error("Error creating hero slide:", error);
    res.status(500).json({ error: "Failed to create hero slide" });
  }
}

export async function updateHeroSlide(req: any, res: any) {
  try {
    const { id } = req.params;
    const { image, alt, order } = req.body;

    // Check if slide exists
    const { data: existingSlide, error: checkError } = await supabase
      .from("hero_slides")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingSlide) {
      return res.status(404).json({ error: "Slide not found" });
    }

    // Prepare update data
    const updateData: any = {};
    if (image !== undefined) updateData.image = image;
    if (alt !== undefined) updateData.alt = alt;
    if (order !== undefined) updateData.order_index = order;

    const { data, error } = await supabase
      .from("hero_slides")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    // Handle array response from update().select()
    const slide = Array.isArray(data) ? data[0] : data;
    if (!slide) {
      return res.status(404).json({ error: "Slide not found after update" });
    }

    const apiSlide = dbSlideToApi(slide);
    res.json(apiSlide);
  } catch (error) {
    console.error("Error updating hero slide:", error);
    res.status(500).json({ error: "Failed to update hero slide" });
  }
}

export async function deleteHeroSlide(req: any, res: any) {
  try {
    const { id } = req.params;

    // Check if slide exists
    const { data: existingSlide, error: checkError } = await supabase
      .from("hero_slides")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingSlide) {
      return res.status(404).json({ error: "Slide not found" });
    }

    const { data, error: deleteError } = await supabase
      .from("hero_slides")
      .delete()
      .eq("id", id)
      .select();

    if (deleteError) throw deleteError;

    // Handle array response from delete().select()
    const deletedSlide = Array.isArray(data) ? data[0] : data;
    if (!deletedSlide) {
      return res.status(404).json({ error: "Slide not found" });
    }

    const apiSlide = dbSlideToApi(deletedSlide);
    res.json(apiSlide);
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    res.status(500).json({ error: "Failed to delete hero slide" });
  }
}
