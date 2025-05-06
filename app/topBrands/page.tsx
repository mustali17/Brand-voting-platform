import Image from 'next/image';

export default function BrandShowcase() {
  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold mb-2'>Brand Showcase</h1>
        <p className='text-gray-600 text-lg'>
          Discover the top brands across various categories
        </p>
      </div>

      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-1'>Top Automotive Brands</h2>
        <p className='text-gray-600 mb-6'>Top 5 brands in Automobiles</p>

        <div className='space-y-6'>
          {/* Tesla */}
          <div className='border rounded-lg overflow-hidden flex'>
            <div className='w-1/4 bg-gray-100 p-6 flex items-center justify-center'>
              <Image
                src='/placeholder.svg?height=100&width=100'
                alt='Tesla logo'
                width={100}
                height={100}
                className='object-contain'
              />
            </div>
            <div className='w-3/4 p-6 relative'>
              <div className='flex items-center mb-2'>
                <h3 className='text-xl font-bold mr-2'>Tesla</h3>
                <span className='text-gray-600 text-sm'>#1</span>
              </div>
              <p className='text-gray-700 mb-4'>
                Leading electric vehicle manufacturer known for innovation and
                sustainable energy solutions.
              </p>
              <div className='absolute top-6 right-6'>
                <span className='bg-gray-200 px-3 py-1 rounded-full text-sm'>
                  Score: 95
                </span>
              </div>
            </div>
          </div>

          {/* Toyota */}
          <div className='border rounded-lg overflow-hidden flex'>
            <div className='w-1/4 bg-gray-100 p-6 flex items-center justify-center'>
              <Image
                src='/placeholder.svg?height=100&width=100'
                alt='Toyota logo'
                width={100}
                height={100}
                className='object-contain'
              />
            </div>
            <div className='w-3/4 p-6 relative'>
              <div className='flex items-center mb-2'>
                <h3 className='text-xl font-bold mr-2'>Toyota</h3>
                <span className='text-gray-600 text-sm'>#2</span>
              </div>
              <p className='text-gray-700 mb-4'>
                Renowned for reliability, durability and fuel efficiency across
                a wide range of vehicle types.
              </p>
              <div className='absolute top-6 right-6'>
                <span className='bg-gray-200 px-3 py-1 rounded-full text-sm'>
                  Score: 92
                </span>
              </div>
            </div>
          </div>

          {/* BMW */}
          <div className='border rounded-lg overflow-hidden flex'>
            <div className='w-1/4 bg-gray-100 p-6 flex items-center justify-center'>
              <Image
                src='/placeholder.svg?height=100&width=100'
                alt='BMW logo'
                width={100}
                height={100}
                className='object-contain'
              />
            </div>
            <div className='w-3/4 p-6 relative'>
              <div className='flex items-center mb-2'>
                <h3 className='text-xl font-bold mr-2'>BMW</h3>
                <span className='text-gray-600 text-sm'>#3</span>
              </div>
              <p className='text-gray-700 mb-4'>
                Luxury German manufacturer famous for performance, technology
                and sophisticated design.
              </p>
              <div className='absolute top-6 right-6'>
                <span className='bg-gray-200 px-3 py-1 rounded-full text-sm'>
                  Score: 88
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
