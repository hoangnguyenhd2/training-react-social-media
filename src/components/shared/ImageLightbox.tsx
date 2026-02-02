import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageLightboxProps {
    images: string[];
    initialIndex: number;
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
}

export function ImageLightbox({ images, initialIndex, open, onOpenChange }: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState( initialIndex );

    useEffect( () => {
        setCurrentIndex( initialIndex );
    }, [initialIndex]);

    const next = ( e: React.MouseEvent ) => {
        e.stopPropagation();
        setCurrentIndex( ( prev ) => ( prev + 1 ) % images.length );
    };

    const prev = ( e: React.MouseEvent ) => {
        e.stopPropagation();
        setCurrentIndex( ( prev ) => ( prev - 1 + images.length ) % images.length );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 sm:rounded-2xl overflow-hidden flex flex-col items-center justify-center">
                <DialogTitle className="sr-only">View Image</DialogTitle>
                
                <button 
                    type="button"
                    className="absolute top-4 right-4 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                    onClick={() => onOpenChange( false )}
                >
                    <X className="size-6" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 z-50 text-white/50 hover:text-white p-2 sm:p-4 transition-colors"
                                onClick={prev}
                            >
                                <ChevronLeft className="size-8 sm:size-10" />
                            </button>
                            <button
                                className="absolute right-4 z-50 text-white/50 hover:text-white p-2 sm:p-4 transition-colors"
                                onClick={next}
                            >
                                <ChevronRight className="size-8 sm:size-10" />
                            </button>
                        </>
                    )}

                    <img
                        src={images[currentIndex]}
                        alt=""
                        className="max-w-full max-h-[85vh] object-contain select-none"
                    />

                    {images.length > 1 && (
                        <div className="absolute bottom-4 text-white/70 text-sm font-medium">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
