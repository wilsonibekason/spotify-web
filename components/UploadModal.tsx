import * as React from "react";
import Modal from "./Modal";
import uniqueId from "uniqid"
import useUploadModal from "@/hooks/useUploadModal";
import {
  useForm,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import Input from "./Input";
import ImageUploader from "@/hooks/ImageUploader";
import Button from "@/components/Button";
import {toast} from "react-hot-toast";
import {useUser} from "@/hooks/useUser";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useRouter} from "next/navigation";

type ErrorMessage = {
  message:  string
}
const ERROR_MESSAGES = {
  uploadSongFailed: "Failed to upload the song.",
  uploadImageFailed: "Failed to upload the image.",
  songCreationFailed: "Failed to create the song.",
};
const UploadModal = () => {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()
  const {user}  = useUser()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FieldValues>({
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

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try{
      setIsLoading(true)
      const imageFile = values.image?.[0]
      const songFile = values.song?.[0]
      toast.success(songFile + imageFile)
      // if(!imageFile || !songFile || !user) {
      //   toast.error("Missing fields")
      //   return
      // }
      const uniqueID = uniqueId()
      // upload songs
      const {data: songData, error: songError}  = await supabaseClient.storage.from("songs").upload(`song-${values.title}-${uniqueID}`, songFile, {
        cacheControl:"3600",
        upsert: false
      })
      if(songError) {
        setIsLoading(false)
        return toast.error(ERROR_MESSAGES.songCreationFailed)
      }
      //   UPLOAD IMAGES
      const {data: imageData, error: imageError}  = await supabaseClient.storage.from("images").upload(`image-${values.title}-${uniqueID}`, imageFile, {
        cacheControl:"3600",
        upsert: false
      })
      if(imageError) {
        setIsLoading(false)
        return toast.error(ERROR_MESSAGES.uploadImageFailed)
      }
      //   TODO UPLOAD SONGS

      const {data: supabaseData, error: supabaseError}  = await supabaseClient.from("songs").insert({
        user_id: user && user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path
      })
      //   render supabase error
      if(supabaseError) {
        setIsLoading(false)
        return toast.error(supabaseError.message)
      }
      router.refresh()
      setIsLoading(false)
      toast.success("song created.")
      console.table(supabaseData)
      reset()
      uploadModal.onClose()

    }
    catch (e) {
      handleErrorMessage(e);
    } finally {
      setIsLoading(false)
    }
  }

  // handle error message
  const handleErrorMessage = (error: any) => {
    const errorObj = error as ErrorMessage;
    toast.error(errorObj?.message || "An unknown error occurred.");
  };

  return (
    <>
      <Modal
          title="Add a song"
          description="Upload an mp3 file"
          isOpen={uploadModal.isOpen}
          onChange={onChange}
          onClose={uploadModal.onClose}
      >
        {/* FORM COMPONENT */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
          {/* ... form fields */}
          <Input
              id={"title"}
              {...register("title", { required: true })}
              placeholder={"Song title"}
          />
          <Input
              id={"author"}
              {...register("author", {required: true})}
              placeholder={"Song Author"}
          />
          <div>
            <div>
              <p>Select a file to upload</p>
              <Input
                  id={"song"}
                  type={"file"}
                  accept={".mp3"}
                  {...register("song", {required: true})}
              />
            </div>
            <div>
              <p>Select an image to upload</p>
              <Input
                  id={"image"}
                  type={"file"}
                  accept={"images/*"}
                  {...register("image", {required: true})}
              />
            </div>
          </div>
          {/*  IMAGE*/}
          <ImageUploader/>
          <Button type="submit" disabled={isLoading}>Submit</Button>
        </form>
        {isLoading && <div>Loading...</div>}
      </Modal>

    </>
  );
};

export default UploadModal;
