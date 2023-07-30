"use client"

import * as React from "react";
import Modal from "./Modal";
import uniqueId from "uniqid"
import useUploadModal from "@/hooks/useUploadModal";
import {
  useForm,
} from "react-hook-form";
import Input from "./Input";
import Button from "@/components/Button";
import {toast} from "react-hot-toast";
import {useUser} from "@/hooks/useUser";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useRouter} from "next/navigation";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

type ErrorMessage = {
  message:  string
}
const ERROR_MESSAGES = {
  uploadSongFailed: "Failed to upload the song.",
  uploadImageFailed: "Failed to upload the image.",
  songCreationFailed: "Failed to create the song.",
};

const formSchema = z.object({
  author: z.string().nonempty("Please enter the authors name"),
  title: z.string().nonempty("Enter your title"),
  song: z.string().nullable(),
  image: z.string().nullable()
})
const UploadModal = () => {
  const supabaseClient = useSupabaseClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      title: "",
      image: null,
      song: null
    },
  });
  const router = useRouter()
  const {user}  = useUser()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const uploadModal = useUploadModal();
  const onChange = (open: boolean) => {
    if (!open) {
      form.reset();
      return uploadModal.onClose;
    }
  };
  async function onSubmit(values:  z.infer<typeof  formSchema>, event?: React.BaseSyntheticEvent){
    event?.preventDefault()
    console.log("Submitting form...", values);
    try{
      setIsLoading(true)
      const imageFile = values.image?.[0]
      const songFile = values.song?.[0]
      if(!imageFile || !songFile || !user) {
        toast.error("Missing fields")
        return
      }
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
      form.reset()
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
      <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
      >
        <Input
            id="title"
            disabled={isLoading}
            {...form.register('title', { required: true })}
            placeholder="Song title"
        />
        <Input
            id="author"
            disabled={isLoading}
            {...form.register('author', { required: true })}
            placeholder="Song author"
        />
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
              disabled={isLoading}
              type="file"
              accept=".mp3"
              id="song"
              {...form.register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
              disabled={isLoading}
              type="file"
              accept="image/*"
              id="image"
              {...form.register('image', { required: true })}
          />
        </div>
        <button
            className="text-blue-500 disabled:text-red-500"
            disabled={ !form.getValues().title || !form.getValues().author || isLoading} type="submit"
        >
          { isLoading ? "Creating" : "Create" }
        </button>
        {/*<Button disabled={ !form.getValues().title || !form.getValues().author || isLoading} type="submit">*/}
        {/*  { isLoading ? "Creating" : "Create" }*/}
        {/*</Button>*/}
        {isLoading ? <div>Loading...</div> : <div>Will Load</div>}
      </form>
    </Modal>
  </>
  );
};

export default UploadModal;
