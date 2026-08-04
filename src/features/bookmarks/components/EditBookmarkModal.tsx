"use client";

import { useGetCollections } from "~/features/collections/api/get-collections";
import {
  UpdateBookmarkInput,
  updateBookmarkInputSchema,
  useUpdateBookmark
} from "../api/update-bookmark";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Link2,
  Loader2,
  X
} from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
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
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fetchMetadata } from "../api/get-metadata";
import { Bookmark } from "~/types/api";

type BookmarkMetadata = {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  tags?: string[];
};

type EditBookmarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark | null; // bookmark yang mau diedit
};

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

const EditBookmarkModal = ({
  isOpen,
  onClose,
  bookmark
}: EditBookmarkModalProps) => {
  const updateBookmark = useUpdateBookmark();
  const { data: collections } = useGetCollections();
  const form = useForm<UpdateBookmarkInput>({
    resolver: zodResolver(updateBookmarkInputSchema)
  });
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [metadata, setMetadata] = useState<BookmarkMetadata | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewData = metadata ?? bookmark;
  const showPreview =
    fetchState === "success" || (bookmark !== null && fetchState === "idle");

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

  // Pre-fill input for update bookmark
  useEffect(() => {
    if (isOpen && bookmark) {
      form.reset({
        url: bookmark.url,
        title: bookmark.title,
        description: bookmark.description,
        image: bookmark.image,
        favicon: bookmark.favicon,
        collectionId: bookmark.collectionId
      });
    }
  }, [isOpen, bookmark, form]);

  const handleFetch = async () => {
    const urlValue = form.getValues("url") ?? "";
    if (!urlValue?.trim()) return;
    setFetchState("loading");
    setMetadata(null);
    try {
      const data = await fetchMetadata(urlValue);
      setMetadata(data);
      // Auto-fill title & description to form
      if (data.title) form.setValue("title", data.title);
      if (data.description) form.setValue("description", data.description);
      setFetchState("success");
      if (data.image) form.setValue("image", data.image);
      if (data.favicon) form.setValue("favicon", data.favicon);
    } catch {
      setFetchState("error");
    }
  };

  const onSubmit = (data: UpdateBookmarkInput) => {
    if (!bookmark) return;
    updateBookmark.mutate(
      {
        id: bookmark.id,
        data
      },
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
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-background border border-border shadow-[0_5px_0_hsl(var(--border))] overflow-y-auto max-h-[90vh] scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-primary/20">
              <Link2 size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Edit Bookmark
            </h2>
          </div>
          <Button
            type="button"
            onClick={() => {
              onClose();
              form.reset();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary hover:text-accent-foreground"
          >
            <X size={15} />
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
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-medium text-muted-foreground"
                    >
                      Paste a URL
                    </FieldLabel>
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
                          ref={inputRef}
                          className="w-full rounded-xl border border-border py-2.5 pl-9 pr-3 text-sm outline-none"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleFetch}
                        disabled={fetchState === "loading"}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {fetchState === "loading" ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          "Fetch"
                        )}
                      </Button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Press Enter or click Fetch to retrieve metadata
                    </p>
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />

              {/* Loading Skeleton */}
              {fetchState === "loading" && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 size={11} className="animate-spin text-primary" />
                    Fetching metadata from URL...
                  </p>
                  <LoadingSkeleton />
                </div>
              )}

              {/* Error State */}
              {fetchState === "error" && (
                <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3">
                  <AlertCircle
                    size={16}
                    className="shrink-0 text-destructive"
                  />
                  <div>
                    <p className="text-xs font-medium text-destructive">
                      Failed to fetch metadata
                    </p>
                    <p className="text-[11px] text-destructive/70">
                      Check the URL and try again.
                    </p>
                  </div>
                </div>
              )}

              {/* Success - Preview Card */}
              {showPreview && previewData && (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <CheckCircle2 size={13} />
                    <span>Metadata retrieved successfully</span>
                  </div>

                  {/* Preview Card */}
                  <div className="overflow-hidden rounded-xl border border-border bg-muted">
                    {metadata?.image && (
                      <div className="relative h-36 bg-muted">
                        <Image
                          width={144}
                          height={144}
                          src={metadata.image}
                          alt=""
                          className="w-full h-full object-contain"
                          unoptimized
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-4">
                      {/* Title Input */}
                      <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            {/* <FieldLabel htmlFor={field.name}>
                              Title <span>(optional)</span>
                            </FieldLabel> */}
                            <Input
                              type="text"
                              id={field.name}
                              placeholder="Amazing Developer Resource"
                              aria-invalid={fieldState.invalid}
                              {...field}
                              className="mb-1 w-full rounded-lg border border-transparent bg-transparent text-sm font-semibold text-foreground outline-none focus:px-2"
                            />
                            <Activity
                              mode={fieldState.invalid ? "visible" : "hidden"}
                            >
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
                            {/* <FieldLabel htmlFor={field.name}>
                              Description
                            </FieldLabel> */}
                            <Textarea
                              id={field.name}
                              placeholder="A fantastic resource for developers..."
                              rows={2}
                              {...field}
                              className="w-full resize-none rounded-lg border border-transparent bg-transparent text-xs text-muted-foreground outline-none focus:px-2"
                            />
                            <Activity
                              mode={fieldState.invalid ? "visible" : "hidden"}
                            >
                              <FieldError errors={[fieldState.error]} />
                            </Activity>
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Collection Picker */}
              <Controller
                name="collectionId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-medium text-muted-foreground"
                    >
                      Collection
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:ring-2">
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
              <Controller
                name="tags"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tags (optional)</FieldLabel>
                    {fetchState === "success" && metadata?.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {metadata.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Input
                      type="text"
                      placeholder="react, typescript, nextjs"
                      value={field.value?.join(", ") ?? ""}
                      onChange={(e) => {
                        const tagsArray = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        field.onChange(tagsArray);
                      }}
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      Separate tags with commas
                    </p>
                  </Field>
                )}
              />

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-destructive shadow-[0_5px_0_hsl(var(--destructive-pressed))] hover:bg-destructive"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateBookmark.isPending}>
                  {updateBookmark.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Bookmark"
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

export default EditBookmarkModal;
