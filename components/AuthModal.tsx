"use client";

import React, { useEffect } from "react";
import Modal from "./Modal";
import { Auth } from "@supabase/auth-ui-react";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () => {
  const { isOpen, onClose, onOpen } = useAuthModal();
  const handleOnChange = (open: boolean) => {
    if (!open) {
      return onClose();
    }
  };
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();
  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
    // return () => {};
  }, [session, onClose, router]);

  return (
    <div>
      <Modal
        title="Welcome Back"
        description="Login to your account"
        isOpen={isOpen}
        onChange={handleOnChange}
      >
        <Auth
          providers={["github", "google"]}
          supabaseClient={supabaseClient}
          theme="dark"
          magicLink
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#404040",
                  brandAccent: "#22c55e",
                },
              },
            },
          }}
        />
      </Modal>
    </div>
  );
};

export default AuthModal;
