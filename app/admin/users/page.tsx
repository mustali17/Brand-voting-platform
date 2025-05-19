'use client';
import LoadingComponent from '@/components/LoadingComponent';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetUsersQuery } from '@/lib/services/user.service';
import Image from 'next/image';

const Users = () => {
  const { data: userList, isLoading, isError } = useGetUsersQuery();

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <div>Error loading brand list.</div>;
  }
  if (!userList) return <div>No user list available.</div>;
  return (
    <div className='w-full p-4'>
      <h2 className='text-2xl font-bold mb-4'>Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Profile</TableHead>
            <TableHead className='w-[100px]'>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Owned Brands</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Image
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`}
                  alt={user.name}
                  width={50}
                  height={50}
                  className='rounded-full object-cover w-10 h-10'
                />
              </TableCell>
              <TableCell className='font-medium'>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.emailVerified.toString()}</TableCell>
              <TableCell>
                {user?.ownedBrands?.map((brand) => brand.name).join(',')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
