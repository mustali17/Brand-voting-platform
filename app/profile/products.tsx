import { ProductDto } from "@/utils/models/product.model";
import { Heart, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";

const Products = ({
  products,
  updateProduct,
}: {
  products: ProductDto[];
  updateProduct: (product: ProductDto) => void;
}) => {
  return (
    <>
      {products.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4'>
          {products.map((image, index) => (
            <div
              key={index}
              className='relative group aspect-[3/4] overflow-hidden'
              onClick={() => {
                updateProduct(image);
              }}
            >
              <Image
                src={image.imageUrl || "images/post.jpg"}
                alt={`image-${index}`}
                width={300}
                height={400}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white text-lg font-semibold'>
                <div className='flex items-center gap-1'>
                  <ThumbsUp className='w-5 h-5' />
                  {image.votes}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p className='text-gray-500'>No products available</p>
        </div>
      )}
    </>
  );
};

export default Products;
