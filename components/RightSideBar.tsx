import { updateUser } from '@/lib/features/user/userSlice';
import {
  useFollowBrandMutation,
  useGetSuggestedBrandsQuery,
  useUnFollowBrandMutation,
} from '@/lib/services/brand.service';
import { UserDto } from '@/utils/models/user.model';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const RightSideBar = ({ user }: { user: UserDto }) => {
  const {
    data: suggestedBrands,
    isLoading,
    error,
  } = useGetSuggestedBrandsQuery();

  const dispatch = useDispatch();
  const [followBrand] = useFollowBrandMutation();

  const handleFollow = async (brandId: string) => {
    try {
      await followBrand({ brandId: brandId }).unwrap();
      dispatch(
        updateUser({
          following: [...user.following, brandId],
        })
      );
      toast.success('Followed successfully');
    } catch (error) {
      toast.error('Failed to follow brand');
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <div>Error loading suggested brands.</div>;
  }

  return (
    <div className='w-64 border-l border-gray-300 p-4 hidden lg:block overflow-x-hidden'>
      <Link className='flex items-center mb-6 cursor-pointer' href={'/profile'}>
        <div className='flex items-center p-1 text-xl italic font-medium rounded-md hover:bg-gray-100'>
          {user?.name}
        </div>
      </Link>

      <div className='flex justify-between items-center mb-4'>
        <span className='text-gray-500 font-semibold text-sm'>
          Suggested for you
        </span>
      </div>

      {suggestedBrands?.suggestedBrands.map((suggestion, i) => (
        <div key={i} className='flex items-center mb-3'>
          <Link
            href={`/profile/brands/${suggestion._id}`}
            className='flex items-center flex-1'
          >
            <Image
              src={suggestion?.logoUrl}
              alt={suggestion.name}
              width={44}
              height={44}
              className='rounded-full w-11 h-11 mr-3 object-contain'
            />
            <div>
              <div className='font-semibold text-sm'>{suggestion.name}</div>
              {/* <div className='text-gray-500 text-xs'>
                {suggestion.description?.slice(0, 10)}...
              </div> */}
            </div>
          </Link>
          <button
            className='text-blue-500 text-xs font-semibold ml-3'
            onClick={(e) => {
              e.stopPropagation();
              handleFollow(suggestion._id);
            }}
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default RightSideBar;
