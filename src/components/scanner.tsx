"use client"

import { useEffect, useRef, useState } from "react";
import { ScanIcon } from "lucide-react";
import Image from "next/image"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDataContext } from "@/hooks/analysis";
import { useRouter } from "next/navigation";
export default function Scanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[] | []>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const router = useRouter();
    const { data, loading, error, setData, setLoading, setError } = useDataContext();
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedImages((prev)=>[...prev,...Array.from(files)]);
        }
    };
    useEffect(() => {
        if (!videoRef.current) return;
        canvasRef.height = videoRef?.current?.videoHeight;
        canvasRef.width = videoRef?.current?.videoWidth;
    }, [videoRef.current]);


    const captureImage = () => {
        canvasRef.height = videoRef?.current?.videoHeight;
        canvasRef.width = videoRef?.current?.videoWidth;
        const context = canvasRef.current?.getContext("2d");
        context?.drawImage(videoRef?.current, 0, 0, videoRef?.current?.videoWidth, videoRef?.current?.videoHeight);
        canvasRef.current?.toBlob(e=>setSelectedImages((prev)=>[...prev,new File([e!],`${Date.now()}.png`)]), "image/png");

    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files) {
            setSelectedImages((prev)=>[...prev,...Array.from(files)]);
        }
        setIsDragActive(false);
    };





    const handleImageUpload = async () => {
        setLoading(true);
    
        if (selectedImages.length) {
          const formData = new FormData();
    
          // Append images to formData
          selectedImages.forEach((image) => {
            formData.append('images', image);
          });
    
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            if (response.ok) {
              console.log('Success:', data);
             // Redirect to the analysis page
            } else {
              console.error('Failed to upload images:', data);
            }
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setLoading(false);
          }
        } else {
          console.error('No images selected');
        }
      };

    useEffect(() => {
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing the camera: ', error);
            }
        };

        getCameraStream();
    }, []);

    return (
        <div className="p-3">
            <div className=" w-full  mt-10 rounded-3xl relative flex items-center justify-center">

                <ScanIcon className="w-full h-full absolute top-0 right-0 text-white font-extralight stroke-[1] animate-pulse " />
                <video ref={videoRef} autoPlay className="rounded-3xl" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <Button onClick={captureImage} className="bg-orange-500 text-white mt-10 hover:bg-orange-600">Capture</Button>
            </div>
            {/* Camera Input */}
            <div className="flex flex-col items-center justify-center p-4 space-y-4 border rounded-lg shadow-md bg-white cursor-pointer ">
                {/* Drag and Drop Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full p-4 border-2 border-dashed rounded-lg relative ${isDragActive ? "border-accent-color" : "border-orange-300"
                        } bg-orange-50 transition-colors duration-200`}
                >
                    <p className="text-center text-orange-700">
                        {isDragActive ? "Release to drop" : "Drag & drop your image here or click to select"}
                    </p>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="opacity-0 w-full h-full absolute top-0 left-0" // Hide the file input
                    />
                </div>

                {/* Preview Selected Image */}
                {selectedImages ? (
                    <div className="w-full mt-4 flex flex-col items-center space-y-2">
                        {selectedImages?.map((image) => (<div key={image.name}> <Image
                            src={URL.createObjectURL(image)}
                            alt="Selected"
                            className="max-w-xs rounded-lg shadow-md"
                            width={200}
                            height={200}
                            key={image.name}
                        />
                            <p className="text-sm text-orange-700">{image.name}</p>
                        </div>)
                        )}
                        <canvas width="500"
                            height="500" className=" hidden max-w-xs rounded-lg shadow-md" ref={canvasRef} />
                            
                    </div>

                ) : null
                }
                {/* Upload Button */}
                <Button
                    onClick={handleImageUpload}
                    disabled={!selectedImages}
                    variant="default"
                    className={` ${selectedImages ? "bg-orange-500 text-white" : "bg-white text-orange-700 "} font-medium py-2 px-4 rounded-lg`}
                >
                    Upload Image
                </Button>
            </div>
        </div>)


}