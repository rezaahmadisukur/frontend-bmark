"use client";

import { useGetCollections } from "~/features/collections/api/get-collections";
import {
  CreateBookmarkInput,
  createBookmarkInputSchema,
  useCreateBookmark
} from "../api/create-bookmark";
import { Globe, Link2, Loader2, X } from "lucide-react";
import { useState } from "react";
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

  // const [url, setUrl] = useState("");
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [collectionId, setCollectionId] = useState("");
  // const [tags, setTags] = useState<string[]>([]);
  // const [tagInput, setTagInput] = useState("");

  const onSubmit = () => {
    console.log("OK");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blue-md" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-primary/20">
              <Link2 size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              Add New Bookmark
            </h2>
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
            <X size={15} />
          </button>
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
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
