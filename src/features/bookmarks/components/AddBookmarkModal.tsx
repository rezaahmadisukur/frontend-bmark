"use client";

import { useGetCollections } from "~/features/collections/api/get-collections";
import {
  CreateBookmarkInput,
  createBookmarkInputSchema,
  useCreateBookmark
} from "../api/create-bookmark";
import { Globe, Link2, Loader2, X } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/custom/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Activity } from "~/components/partials/Activity";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import { Bookmark } from "~/types/api";
import { useEffect, useRef, useState } from "react";

type AddBookmarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

async function fetchMockMetadata(url: string): Promise<Partial<Bookmark>> {
  // Simulate network delay (1.5s)
  await new Promise((r) => setTimeout(r, 1500));

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();

  // Return domain-based mock data
  if (domain.includes("nextjs")) {
    return {
      title: "Next.js Documentation",
      description:
        "The React framework for the web. Build high-quality applications with the power of React components.",
      image: "https://nextjs.org/static/twitter-cards/home.jpg",
      favicon: "https://nextjs.org/favicon.ico",
      tags: ["nextjs", "react", "frontend"]
    };
  }
  if (domain.includes("github")) {
    return {
      title: "GitHub Repository",
      description:
        "Build and ship software on the world's largest development platform.",
      image:
        "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
      favicon: "https://github.com/favicon.ico",
      tags: ["git", "open-source"]
    };
  }
  if (domain.includes("react") || domain.includes("reactjs")) {
    return {
      title: "React – A JavaScript library for building user interfaces",
      description:
        "React makes it painless to create interactive UIs. Design simple views for each state in your application.",
      image: "https://reactjs.org/logo-og.png",
      favicon: "https://reactjs.org/favicon.ico",
      tags: ["react", "javascript", "frontend"]
    };
  }

  return {
    // ...MOCK_METADATA.default,
    title: `${domain} — Developer Resource`,
    favicon: `https://${domain}/favicon.ico`
  };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-700/60 bg-zinc-800/50 p-4">
      <div className="relative h-36 overflow-hidden rounded-lg bg-zinc-700/50">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
      </div>
      <div className="space-y-2.5">
        <div className="relative h-4 w-3/4 overflow-hidden rounded-md bg-zinc-700/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
        </div>
        <div className="relative h-3 overflow-hidden rounded-md bg-zinc-700/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
        </div>
        <div className="relative h-3 w-5/6 overflow-hidden rounded-md bg-zinc-700/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
        </div>
        <div className="flex gap-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-5 w-16 overflow-hidden rounded-full bg-zinc-700/50"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type FetchState = "idle" | "loading" | "success" | "error";

const AddBookmarkModal = ({ isOpen, onClose }: AddBookmarkModalProps) => {
  const createBookmark = useCreateBookmark();
  const { data: collections } = useGetCollections();
  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(createBookmarkInputSchema)
  });
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [metadata, setMetadata] = useState<Partial<Bookmark> | null>(null);
  const [customTags, setCustomTags] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");

  // Auto focus input when Modal opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape for close modal
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleFetch = async () => {
    const urlValue = form.getValues("url");
    if (!urlValue.trim()) return;
    setFetchState("loading");
    setMetadata(null);
    try {
      // Mock fetch - change with Real API
      await new Promise((r) => setTimeout(r, 1500));
      const domain = new URL(urlValue).hostname;
      setMetadata({
        title: domain.includes("github")
          ? "Github Repository"
          : `${domain} - Developer Resource`,
        description: "A fantanstic resource for developer",
        image:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        tags: domain.includes("github")
          ? ["git", "open-source"]
          : ["developer", "learning"]
      });
      setFetchState("success");
    } catch {
      setFetchState("error");
    }
  };

  const onSubmit = (data: CreateBookmarkInput) => {
    createBookmark.mutate(
      { data },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-none rounded-2xl bg-background border border-border shadow-[0_5px_0_hsl(var(--border))]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-primary/20">
              <Link2 size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Add New Bookmark
            </h2>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary hover:text-accent-foreground"
          >
            <X size={14} />
          </Button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* URL Input */}
              <Controller
                name="url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Globe
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          type="url"
                          id={field.name}
                          placeholder="https://example.com/article"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleFetch}
                        disabled={fetchState === "loading"}
                      >
                        {fetchState === "loading" ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          "Fetch"
                        )}
                      </Button>
                    </div>
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />

              {/* Title Input */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Title <span>(optional)</span>
                    </FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      placeholder="Amazing Developer Resource"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />

              {/* Description Input */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="A fantastic resource for developers..."
                      rows={2}
                      {...field}
                    />
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />

              {/* Collection Picker */}
              <Controller
                name="collectionId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Collection</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {collections?.map((col) => (
                            <SelectItem key={col.id} value={col.id}>
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />

              {/* Tags Input */}
              <Field>
                <FieldLabel>Tags (optional)</FieldLabel>
                <Input type="text" placeholder="react, typescript, nextjs" />
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  Separate tags with commas
                </p>
              </Field>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-destructive shadow-[0_5px_0_hsl(var(--destructive-pressed))] hover:bg-destructive"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createBookmark.isPending}>
                  {createBookmark.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Bookmark"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
