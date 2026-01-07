import { supabase } from "../lib/supabase";

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  slug: string;
  pdfFile?: string | null;
  pdfFilename?: string | null;
  specifications: Specification[];
}

// Helper function to convert DB product to API format
function dbProductToApi(dbProduct: any, images: any[], specs: any[]): Product {
  return {
    id: dbProduct.id,
    collectionId: dbProduct.collection_id,
    name: dbProduct.name,
    description: dbProduct.description,
    images: images
      .map((img) => img.image_url)
      .sort((a, b) => {
        const aIndex =
          images.find((img) => img.image_url === a)?.order_index || 0;
        const bIndex =
          images.find((img) => img.image_url === b)?.order_index || 0;
        return aIndex - bIndex;
      }),
    category: dbProduct.category,
    slug: dbProduct.slug,
    pdfFile: dbProduct.pdf_file || null,
    pdfFilename: dbProduct.pdf_filename || null,
    specifications: specs
      .sort((a, b) => a.order_index - b.order_index)
      .map((spec) => ({ label: spec.label, value: spec.value })),
  };
}

export async function getProducts(_req: any, res: any) {
  try {
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsError) throw productsError;
    if (!products || products.length === 0) {
      return res.json([]);
    }

    // Fetch all product images and specifications in parallel
    const productIds = products.map((p) => p.id);
    const [imagesResult, specsResult] = await Promise.all([
      supabase.from("product_images").select("*").in("product_id", productIds),
      supabase
        .from("product_specifications")
        .select("*")
        .in("product_id", productIds),
    ]);

    if (imagesResult.error) throw imagesResult.error;
    if (specsResult.error) throw specsResult.error;

    const images = imagesResult.data || [];
    const specs = specsResult.data || [];

    // Group images and specs by product_id
    const imagesByProduct = new Map<string, any[]>();
    const specsByProduct = new Map<string, any[]>();

    images.forEach((img) => {
      if (!imagesByProduct.has(img.product_id)) {
        imagesByProduct.set(img.product_id, []);
      }
      imagesByProduct.get(img.product_id)!.push(img);
    });

    specs.forEach((spec) => {
      if (!specsByProduct.has(spec.product_id)) {
        specsByProduct.set(spec.product_id, []);
      }
      specsByProduct.get(spec.product_id)!.push(spec);
    });

    // Combine products with their images and specs
    const productsWithRelations = products.map((product) =>
      dbProductToApi(
        product,
        imagesByProduct.get(product.id) || [],
        specsByProduct.get(product.id) || [],
      ),
    );

    res.json(productsWithRelations);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function getProductById(req: any, res: any) {
  try {
    const { id } = req.params;

    // Try to find by id or slug
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch images and specifications
    const [imagesResult, specsResult] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", product.id)
        .order("order_index", { ascending: true }),
      supabase
        .from("product_specifications")
        .select("*")
        .eq("product_id", product.id)
        .order("order_index", { ascending: true }),
    ]);

    if (imagesResult.error) throw imagesResult.error;
    if (specsResult.error) throw specsResult.error;

    const productWithRelations = dbProductToApi(
      product,
      imagesResult.data || [],
      specsResult.data || [],
    );

    res.json(productWithRelations);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

export async function createProduct(req: any, res: any) {
  try {
    const {
      name,
      description,
      images,
      category,
      collectionId,
      pdfFile,
      pdfFilename,
      specifications,
    } = req.body;

    if (!name || !description) {
      res
        .status(400)
        .json({
          error:
            "Missing required fields: name and description are required",
        });
      return;
    }

    // Generate slug and ID
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    const id = `product-${Date.now()}`;

    // Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        id,
        collection_id: collectionId || null,
        name,
        description,
        category: category || "Uncategorized",
        slug,
        pdf_file: pdfFile || null,
        pdf_filename: pdfFilename || null,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const imageRecords = images
        .filter((img: string) => img && img.trim())
        .map((img: string, index: number) => ({
          product_id: id,
          image_url: img,
          order_index: index,
        }));

      if (imageRecords.length > 0) {
        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imageRecords);

        if (imagesError) throw imagesError;
      }
    }

    // Insert specifications if provided
    if (
      specifications &&
      Array.isArray(specifications) &&
      specifications.length > 0
    ) {
      const specRecords = specifications
        .filter(
          (spec: any) =>
            spec &&
            spec.label &&
            spec.value &&
            spec.label.trim() &&
            spec.value.trim(),
        )
        .map((spec: any, index: number) => ({
          product_id: id,
          label: spec.label,
          value: spec.value,
          order_index: index,
        }));

      if (specRecords.length > 0) {
        const { error: specsError } = await supabase
          .from("product_specifications")
          .insert(specRecords);

        if (specsError) throw specsError;
      }
    }

    // Fetch the complete product with relations
    const [imagesResult, specsResult] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
      supabase
        .from("product_specifications")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
    ]);

    const productWithRelations = dbProductToApi(
      product,
      imagesResult.data || [],
      specsResult.data || [],
    );

    res.status(201).json(productWithRelations);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

export async function updateProduct(req: any, res: any) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      images,
      category,
      collectionId,
      pdfFile,
      pdfFilename,
      specifications,
    } = req.body;

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Prepare update data (only include fields that are provided)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (collectionId !== undefined) updateData.collection_id = collectionId;
    if (pdfFile !== undefined) updateData.pdf_file = pdfFile || null;
    if (pdfFilename !== undefined)
      updateData.pdf_filename = pdfFilename || null;

    // Update product
    const { data: product, error: productError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (productError) throw productError;

    // Update images if provided
    if (images !== undefined && Array.isArray(images)) {
      // Delete existing images
      await supabase.from("product_images").delete().eq("product_id", id);

      // Insert new images
      if (images.length > 0) {
        const imageRecords = images
          .filter((img: string) => img && img.trim())
          .map((img: string, index: number) => ({
            product_id: id,
            image_url: img,
            order_index: index,
          }));

        if (imageRecords.length > 0) {
          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageRecords);

          if (imagesError) throw imagesError;
        }
      }
    }

    // Update specifications if provided
    if (specifications !== undefined && Array.isArray(specifications)) {
      // Delete existing specifications
      await supabase
        .from("product_specifications")
        .delete()
        .eq("product_id", id);

      // Insert new specifications
      if (specifications.length > 0) {
        const specRecords = specifications
          .filter(
            (spec: any) =>
              spec &&
              spec.label &&
              spec.value &&
              spec.label.trim() &&
              spec.value.trim(),
          )
          .map((spec: any, index: number) => ({
            product_id: id,
            label: spec.label,
            value: spec.value,
            order_index: index,
          }));

        if (specRecords.length > 0) {
          const { error: specsError } = await supabase
            .from("product_specifications")
            .insert(specRecords);

          if (specsError) throw specsError;
        }
      }
    }

    // Fetch the complete product with relations
    const [imagesResult, specsResult] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
      supabase
        .from("product_specifications")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
    ]);

    const productWithRelations = dbProductToApi(
      product,
      imagesResult.data || [],
      specsResult.data || [],
    );

    res.json(productWithRelations);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}

export async function deleteProduct(req: any, res: any) {
  try {
    const { id } = req.params;

    // Check if product exists
    const { data: product, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete product (cascade will delete images and specifications)
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({ id, deleted: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}

export async function addProductImage(req: any, res: any) {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ error: "Image URL required" });
      return;
    }

    // Check if product exists
    const { data: product, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get current max order_index
    const { data: existingImages } = await supabase
      .from("product_images")
      .select("order_index")
      .eq("product_id", id)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex =
      existingImages && existingImages.length > 0
        ? (existingImages[0].order_index || 0) + 1
        : 0;

    // Insert new image
    const { error: insertError } = await supabase
      .from("product_images")
      .insert({
        product_id: id,
        image_url: imageUrl,
        order_index: nextOrderIndex,
      });

    if (insertError) throw insertError;

    // Fetch updated product
    const [imagesResult, specsResult] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
      supabase
        .from("product_specifications")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
    ]);

    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    const productWithRelations = dbProductToApi(
      productData,
      imagesResult.data || [],
      specsResult.data || [],
    );

    res.json(productWithRelations);
  } catch (error) {
    console.error("Error adding product image:", error);
    res.status(500).json({ error: "Failed to add product image" });
  }
}

export async function removeProductImage(req: any, res: any) {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ error: "Image URL required" });
      return;
    }

    // Delete the image
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id)
      .eq("image_url", imageUrl);

    if (deleteError) throw deleteError;

    // Fetch updated product
    const [imagesResult, specsResult] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
      supabase
        .from("product_specifications")
        .select("*")
        .eq("product_id", id)
        .order("order_index", { ascending: true }),
    ]);

    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    const productWithRelations = dbProductToApi(
      productData,
      imagesResult.data || [],
      specsResult.data || [],
    );

    res.json(productWithRelations);
  } catch (error) {
    console.error("Error removing product image:", error);
    res.status(500).json({ error: "Failed to remove product image" });
  }
}
