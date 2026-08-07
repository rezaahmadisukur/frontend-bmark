"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  CreateCollectionInput,
  createCollectionInputSchema,
  useCreateCollection
} from "../api/create-collection";
import { X, Plus, Loader2 } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Activity } from "~/components/partials/Activity";
import { cn } from "~/lib/utils";

const PRESET_COLORS = [
  "#818cf8", // indigo
  "#34d399", // emerald
  "#fb923c", // orange
  "#f472b6", // pink
  "#60a5fa", // blue
  "#a78bfa", // violet
  "#fbbf24", // amber
  "#f87171" // red
];

type AddCollectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddCollectionModal = ({ isOpen, onClose }: AddCollectionModalProps) => {
  const createCollection = useCreateCollection();

  const form = useForm<CreateCollectionInput>({
    resolver: zodResolver(createCollectionInputSchema),
    defaultValues: {
      name: "",
      description: "",
      color: PRESET_COLORS[0]
    }
  });

  const onSubmit = (data: CreateCollectionInput) => {
    createCollection.mutate(
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
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background border border-border shadow-[0_5px_0_hsl(var(--border))]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-primary/20">
              <Plus size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Add New Collection
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
        <div className="p-5">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              {/* Name Input */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-medium text-muted-foreground"
                    >
                      Collection Name{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      placeholder="My Collection"
                      aria-invalid={fieldState.invalid}
                      {...field}
                      className="w-full rounded-xl border border-border py-2.5 px-3 text-sm outline-none"
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
                    <FieldLabel
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-medium text-muted-foreground"
                    >
                      Description{" "}
                      <span className="text-muted-foreground/60">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      placeholder="A short description..."
                      rows={2}
                      aria-invalid={fieldState.invalid}
                      {...field}
                      className="w-full resize-none rounded-xl border border-border py-2.5 px-3 text-sm outline-none"
                    />
                    <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                      <FieldError errors={[fieldState.error]} />
                    </Activity>
                  </Field>
                )}
              />

              {/* Color Picker */}
              <Controller
                name="color"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="mb-2 block text-xs font-medium text-muted-foreground">
                      Color
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={cn(
                            "h-8 w-8 rounded-lg border-2 transition-all",
                            field.value === color
                              ? "border-foreground scale-110"
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </Field>
                )}
              />

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-destructive shadow-[0_5px_0_hsl(var(--destructive-pressed))] hover:bg-destructive"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createCollection.isPending}>
                  {createCollection.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Collection"
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

export default AddCollectionModal;
