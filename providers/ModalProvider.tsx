"use client";

import Modal from "@/components/Modal";
import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  !isMounted && null;
  return (
    <>
      <Modal
        title="Modal Text"
        description="Modal Description"
        isOpen
        onChange={() => {}}
      >
        Test Modal
      </Modal>
    </>
  );
};

export default ModalProvider;
