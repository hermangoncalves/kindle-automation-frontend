import { File, Upload } from "lucide-react";
import { ToastAction } from "./ui/toast";
import { useToast } from "../hooks/use-toast";
import { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";

type DragDropProps = {
    step: 'upload' | 'convert' | 'email';
    onClick: (step: 'convert') => void
}

export function DragDrop({ step, onClick }: DragDropProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("");
    const { toast } = useToast()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0])
            setMessage("")
            onClick("convert")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"]
        },
        multiple: false
    })

    const handleConvertAndSend = () => {
        if (file) {
            setIsProcessing(true)
            // Here you would implement the actual conversion and sending logic
            // For now, we'll just simulate a process with a timeout
            setTimeout(() => {
                setIsProcessing(false)
                setFile(null)
                toast({
                    title: "PDF converted",
                    description: "PDF converted and sent to Kindle successfully!",
                    action: (
                        <ToastAction altText="PDF converted">Undo</ToastAction>
                    ),
                })
            }, 2000)
        }
    }
    return (
        <div className="h-screen flex flex-col gap-2 items-center text-center justify-center">
            <h1 className="text-2xl font-bold mb-8">PDF to Kindle Converter</h1>
            <div
                {...getRootProps()}
                className={`w-full max-w-md p-8 mb-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
            >
                <input {...getInputProps()} />
                {file ? (
                    <div className="flex items-center justify-center">
                        <File className="mr-2" />
                        <span>{file.name}</span>
                    </div>
                ) : (
                    <div>
                        <Upload className="mx-auto mb-2" />
                        <p>Drag & drop a PDF file here, or click to select one</p>
                    </div>
                )}
            </div>
            {step === 'convert' && (
                <Button>Convert to EPUB</Button>
            )}
        </div>
    )
}