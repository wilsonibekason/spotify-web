import React from "react";
import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";
import {
  useForm,
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import Input from "./Input";

const UploadModal = () => {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });
  const uploadModal = useUploadModal();
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      return uploadModal.onClose;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {};
  return (
    <>
      <Modal
        title="Add a song"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}
      >
        {/* FORM COMPONENT */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("title", { required: true })} />
        </form>
      </Modal>
    </>
  );
};

export default UploadModal;
