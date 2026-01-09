import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  order: number;
}

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<HeroSlide>>({});

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/slides");
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error("Error fetching hero slides:", error);
      toast.error("Failed to load hero slides");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Upload to server
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "content-type": file.type || "image/jpeg",
          "x-filename": file.name,
        },
        body: arrayBuffer,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        setEditData((prev) => ({
          ...prev,
          image: result.url,
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSlide = async () => {
    if (!editData.image) {
      toast.error("Image URL is required");
      return;
    }

    try {
      const isEditing = editingId && editingId !== "new";
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/slides/${editingId}`
        : "/api/slides";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: editData.image,
          alt: editData.alt || "Hero slide",
          order: editData.order,
        }),
      });

      if (response.ok) {
        await fetchSlides();
        setEditingId(null);
        setEditData({});
        toast.success(isEditing ? "Slide updated" : "Slide created");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save slide");
      }
    } catch (error) {
      console.error("Error saving slide:", error);
      toast.error("Failed to save slide");
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm("Delete this slide?")) return;

    try {
      const response = await fetch(`/api/slides/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSlides(slides.filter((s) => s.id !== id));
        toast.success("Slide deleted");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    }
  };

  const handleMoveSlide = async (id: string, direction: "up" | "down") => {
    const index = slides.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newSlides[index].order, newSlides[swapIndex].order] = [
      newSlides[swapIndex].order,
      newSlides[index].order,
    ];

    // Update both slides
    try {
      await Promise.all([
        fetch(`/api/slides/${newSlides[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: newSlides[index].image,
            alt: newSlides[index].alt,
            order: newSlides[index].order,
          }),
        }),
        fetch(`/api/slides/${newSlides[swapIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: newSlides[swapIndex].image,
            alt: newSlides[swapIndex].alt,
            order: newSlides[swapIndex].order,
          }),
        }),
      ]);

      await fetchSlides();
    } catch (error) {
      console.error("Error reordering slides:", error);
      toast.error("Failed to reorder slides");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading hero slides...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hero Slides</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the images in the homepage hero section
          </p>
        </div>
        {!editingId && (
          <Button
            onClick={() => {
              setEditingId("new");
              setEditData({ image: "", alt: "", order: slides.length });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        )}
      </div>

      {editingId && (
        <Card className="bg-accent/5 border-accent">
          <CardHeader>
            <CardTitle>{editingId === "new" ? "Add New Slide" : "Edit Slide"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={editData.image || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    image: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Or upload a new image:
              </p>
              <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {editData.image && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <img
                  src={editData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Alt Text (optional)
              </label>
              <input
                type="text"
                value={editData.alt || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    alt: e.target.value,
                  }))
                }
                placeholder="Image description"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={handleSaveSlide}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Save Slide"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setEditData({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No slides yet. Add one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          slides
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => (
              <Card key={slide.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-32 h-24 object-cover rounded-lg border border-border"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Order:</strong> {index + 1}
                        </p>
                        {slide.alt && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Alt:</strong> {slide.alt}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveSlide(slide.id, "up")}
                            className="flex items-center gap-1"
                          >
                            <ChevronUp className="w-4 h-4" />
                            Move Up
                          </Button>
                        )}
                        {index < slides.length - 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveSlide(slide.id, "down")}
                            className="flex items-center gap-1"
                          >
                            <ChevronDown className="w-4 h-4" />
                            Move Down
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(slide.id);
                            setEditData(slide);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
