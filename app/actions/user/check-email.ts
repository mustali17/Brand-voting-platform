'use server';

import User from "@/models/User";
import connect from "@/utils/db";


export async function checkEmailExists(email: string) {
  await connect();
  
  try {
    const user = await User.findOne({ email });
    return { exists: !!user };
  } catch (error) {
    console.error('Error checking email:', error);
    return { exists: false, error: 'Database error' };
  }
}