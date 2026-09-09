import type { LocalizedText } from "@/types/product";

export type Category = {
  id: string;
  parentId: string | null;
  slug: string;
  name: LocalizedText;
};
