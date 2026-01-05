import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Collection {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    collectionId: product?.collectionId || "",
    images: product?.images || [""],
    specifications: product?.specifications || [{ label: "", value: "" }],
  });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredImages = formData.images.filter((img) => img.trim());
    const filteredSpecs = formData.specifications.filter(
      (spec) => spec.label && spec.value
    );

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      images: filteredImages,
      specifications: filteredSpecs,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g., LED Panel Light"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price (TND) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            step="0.01"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="49.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g., Panneaux LED"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Collection *</label>
          <select
            name="collectionId"
            value={formData.collectionId}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Select a collection</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Product description"
        />
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Product Images</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImage}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-2">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="https://example.com/image.jpg"
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Specifications</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpec}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Spec
          </Button>
        </div>
        <div className="space-y-2">
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) =>
                  handleSpecChange(index, "label", e.target.value)
                }
                className="w-1/3 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g., Power"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
                className="w-2/3 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="e.g., 10W"
              />
              {formData.specifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" className="flex-1">
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
