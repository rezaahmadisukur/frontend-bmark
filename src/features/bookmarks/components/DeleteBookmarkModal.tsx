"use client";

import { Bookmark } from "~/types/api";
import { useDeleteBookmark } from "../api/delete-bookmark";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type DeleteBookmarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark | null; // bookmark yang mau dihapus
};

const DeleteBookmarkModal = ({
  isOpen,
  onClose,
  bookmark
}: DeleteBookmarkModalProps) => {
  const deleteBookmark = useDeleteBookmark();
  const [confirmText, setConfirmText] = useState("");

  const isConfirmMatch =
    confirmText.trim().toLowerCase() ===
    (bookmark?.title ?? "").trim().toLowerCase();

  const handleDelete = () => {
    if (!bookmark || !isConfirmMatch) return;
    deleteBookmark.mutate(
      { id: bookmark.id },
      {
        onSuccess: () => {
          setConfirmText("");
          onClose();
        }
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmText("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-destructive/20">
              <AlertTriangle size={14} className="text-destructive" />
            </div>
            <DialogTitle>Delete Bookmark</DialogTitle>
          </div>
          <DialogDescription>
            You are about to delete{" "}
            <span className="font-semibold text-foreground">
              {bookmark?.title}
            </span>
            . This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Please type{" "}
            <span className="font-semibold text-foreground">
              {bookmark?.title}
            </span>{" "}
            to confirm:
          </p>
          <Input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={bookmark?.title}
            autoFocus
            autoComplete="off"
          />
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmMatch || deleteBookmark.isPending}
            className="bg-destructive hover:bg-destructive"
          >
            {deleteBookmark.isPending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete this bookmark"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookmarkModal;
