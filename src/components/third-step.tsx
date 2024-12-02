import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { File, Library, Settings2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { EPUB_DATA_KEY, KINDLE_EMAIL_KEY } from "../constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface EpubData {
  epub_url: string;
  epub_download_url: string;
  epub_title: string;
}

export function ThirdStep() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [epubTitle, setEpubTitle] = useState<string>("");
  const [epubAuthors, setEpubAuthors] = useState<string>("");
  const [emailKindle, setEmailKindle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const { toast } = useToast();

  const loadlocalStorageData = useCallback(() => {
    const storedEpubData = localStorage.getItem(EPUB_DATA_KEY);
    if (storedEpubData) {
      const epubData: EpubData = JSON.parse(storedEpubData);
      setEpubUrl(epubData.epub_url);
      setDownloadUrl(epubData.epub_download_url);
      setEpubTitle(epubData.epub_title);
    }

    const storedEmailKindle = localStorage.getItem(KINDLE_EMAIL_KEY);
    if (storedEmailKindle) {
      setEmailKindle(storedEmailKindle);
    } else {
      setSearchParams({ step: "1" });
    }
  }, [setSearchParams]);

  useEffect(() => {
    loadlocalStorageData();
  }, [loadlocalStorageData]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      if (acceptedFiles[0].size * 0.000001 <= 10) {
        setFile(acceptedFiles[0]);
      } else {
        toast({
          title: "File to large",
          description: "Please select a file less than 10MB.",
          variant: "destructive",
        });
      }
    }

    setIsConverted(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to convert.",
        status: "warning",
      });
      return;
    }

    const storedKindleEmail = localStorage.getItem(KINDLE_EMAIL_KEY);
    if (!storedKindleEmail) {
      toast({
        title: "No kindle email",
        description: "Please add a kindle email to convert.",
        status: "destructive",
      });
      return;
    }

    setIsProcessing(true); // Set processing state
    const formData = new FormData();
    formData.append("file", file);
    formData.append("send_to_email", storedKindleEmail);

    if (epubTitle) {
      formData.append("title", epubTitle);
    }
    if (epubAuthors) {
      formData.append("authors", epubAuthors);
    }

    try {
      const response = await api.post("/api/v1/convert/pdf-to-epub", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Conversion Successful",
        description: response?.data?.message,
        variant: "success",
      });

      const _epubUrl = response?.data?.data?.url;
      const _epubDownloadUrl = response?.data?.data?.download_url;
      const _epubTitle = response?.data?.data?.title;

      const epubData: EpubData = {
        epub_url: _epubUrl,
        epub_download_url: _epubDownloadUrl,
        epub_title: _epubTitle,
      };

      localStorage.setItem(EPUB_DATA_KEY, JSON.stringify(epubData));

      setEpubUrl(_epubUrl);
      setDownloadUrl(_epubDownloadUrl);
      setEpubTitle(_epubTitle);
      setIsConverted(true);
    } catch (error) {
      console.log(error?.response);
      toast({
        title: "Conversion Failed",
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  const handleSentToKindle = async () => {
    setIsSending(true);
    try {
      if (emailKindle && epubUrl) {
        alert(epubUrl)
        const formData = new FormData();
        formData.append("kindle_email", emailKindle);
        formData.append("file_url", epubUrl);
        const response = await api.post("/api/v1/send/to-kindle", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data);

        toast({
          description: response?.data?.message,
          variant: "success",
        });
      }

      setIsSending(false);
    } catch (error: any) {
      setIsSending(false);

      toast({
        title: "Error Sending Epub",
        description:
          error.response?.data?.message ||
          "An error occurred while sending the Epub.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Load and Convert PDF to EPUB</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`w-full max-w-md p-8 mb-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center">
              <File className="mr-2 w-16" />
              <span className="truncate">{file.name}</span>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto mb-2" />
              <p>Drag & drop a PDF file here, or click to select one</p>
            </div>
          )}
        </div>
        {file && !isConverted && (
          <div className="flex gap-2 items-center justify-center">
            <Button onClick={handleConvert} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Convert to EPUB"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Optional Settings</DialogTitle>
                  <DialogDescription>
                    Make changes to your ebook here
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={epubTitle}
                      onChange={(e) => setEpubTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Authors
                    </Label>
                    <Input
                      id="authors"
                      value={epubAuthors}
                      onChange={(e) => setEpubAuthors(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleConvert} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Convert to EPUB"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {epubTitle && <h2 className="mt-6">{epubTitle}</h2>}
          {epubUrl && (
            <Button onClick={handleSentToKindle} disabled={isSending}>
              <Library className="mr-2" />
              {isSending ? "Sending..." : "Send to Kindle"}
            </Button>
          )}
          {downloadUrl && (
            <Button variant="link">
              <Link to={downloadUrl} target="_blank">
                Download EPUB
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
}
