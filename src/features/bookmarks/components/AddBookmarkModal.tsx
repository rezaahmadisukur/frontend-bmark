"use client";

import { useGetCollections } from "~/features/collections/api/get-collections";
import {
  CreateBookmarkInput,
  createBookmarkInputSchema,
  useCreateBookmark
} from "../api/create-bookmark";
import { Link2, Loader2, X } from "lucide-react";
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

type AddBookmarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddBookmarkModal = ({ isOpen, onClose }: AddBookmarkModalProps) => {
  const createBookmark = useCreateBookmark();
  const { data: collections } = useGetCollections();
  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(createBookmarkInputSchema)
  });

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
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
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
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
                    <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                    <Input
                      type="url"
                      id={field.name}
                      placeholder="https://example.com/article"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
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
                <Button type="button" variant="outline" onClick={onClose}>
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
