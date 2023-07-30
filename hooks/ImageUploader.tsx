import React, { useCallback, useState} from "react"
import {useDropzone} from "react-dropzone"
import Input from "@/components/Input";
import Image from "next/image";

interface FileProps extends File {preview: string}
const ImageUploader: React.FC = () =>{
    const dropzoneStyles: React.CSSProperties = {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
    };

    const previewStyles: React.CSSProperties = {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        margin: '10px',
    };

    const textStyles: React.CSSProperties = {
        fontSize:"15px",
        fontWeight: "lighter",
        lineHeight: "normal"
    }

const [previewFiles, setPreviewFiles] = useState<FileProps[]>([]);
const onDrop = useCallback((acceptedFiles: File[]) => {
    // Update the state with the accepted files for preview
    setPreviewFiles(
        acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        )
    );
}, []);

const { getRootProps, getInputProps } = useDropzone({
    // @ts-ignore
    accept: ["image/*"], // Restrict to image files
    onDrop,
});

return (
        <>
            <div>
                <div {...getRootProps()} style={dropzoneStyles}>
                    <Input {...getInputProps()} />
                    <p style={textStyles}
                    >Drag and drop images here, or click to select files</p>
                </div>
                <div>
                    {previewFiles.map((file) => (
                        <Image
                            key={file.name}
                            src={file.preview}
                            alt="Preview"
                            style={previewStyles}
                            width={500}
                            height={300}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default  ImageUploader