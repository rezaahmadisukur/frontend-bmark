"use client";

import { useDeleteCollection } from "../api/delete-collection";
import { X, Trash2, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Collection } from "~/types/api";

type DeleteCollectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
};

const DeleteCollectionModal = ({
  isOpen,
  onClose,
  collection
}: DeleteCollectionModalProps) => {
  const deleteCollection = useDeleteCollection();

  const handleDelete = () => {
    if (!collection) return;
    deleteCollection.mutate(
      { id: collection.id },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  if (!isOpen || !collection) return null;

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
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-destructive/20">
              <Trash2 size={14} className="text-destructive" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Delete Collection
            </h2>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary hover:text-accent-foreground"
          >
            <X size={15} />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{collection.name}&quot;
              </span>
              ?
            </p>
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-xs text-destructive">
                <strong>Warning:</strong> Bookmarks in this collection will be
                moved to &quot;No Collection&quot; and will not be deleted.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-destructive shadow-[0_5px_0_hsl(var(--destructive-pressed))] hover:bg-destructive"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleteCollection.isPending}
              className="bg-destructive shadow-[0_5px_0_hsl(var(--destructive-pressed))] hover:bg-destructive"
            >
              {deleteCollection.isPending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Collection"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCollectionModal;
