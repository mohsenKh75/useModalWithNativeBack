import { isServerSide } from "@/utils";
import { SimpleFunction } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  modalId: string;
  onOpenCallBack?: SimpleFunction;
}

export function useModalWithNativeBack({ modalId, onOpenCallBack }: Props): {
  isHashedModalOpen: boolean;
  handleHashedModalOpen: SimpleFunction;
  handleHashedModalClose: SimpleFunction;
} {
  const router = useRouter();
  const [isHashedModalOpen, setIsHashedModalOpen] = useState(false);

  const hashes = new Set(
    (!isServerSide ? window.location.hash : "")?.split(",") || []
  );

  const pushHashToHistory = (newHash: string) => {
    if (isServerSide) return;
    const nextHash = [...new Set(hashes).add(newHash)]
      .filter(Boolean)
      .join(",");

    if (`#${window.location.hash}` !== newHash) {
      router.push(nextHash);
    }
  };

  const isOpen = hashes.has(modalId) && isHashedModalOpen;

  // this hook handles the behavior when the modal is closed by the browser's native back.
  useEffect(() => {
    const handlePopState = () => {
      if (!hashes.has(modalId)) {
        setIsHashedModalOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen]);

  function handleHashedModalClose() {
    setIsHashedModalOpen(false);

    if (window.history.length > 1) {
      router.back();
    } else {
      const newHash = [...hashes].filter((h) => h !== modalId).join(",");
      router.replace(newHash);
    }
  }

  function handleHashedModalOpen() {
    pushHashToHistory(modalId);
    setIsHashedModalOpen(true);
    onOpenCallBack?.();
  }

  return {
    isHashedModalOpen: isOpen,
    handleHashedModalOpen,
    handleHashedModalClose,
  };
}
