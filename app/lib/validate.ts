import { z } from "zod";

export const schema  = z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email is invalid'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password is too short')
      .max(100, 'Password is too long'),
  });

// export const isOnboarded = async(user: any) => {
//   const isExistingUser = await user?.typeOfUser === "returning_user"
//   if(isExistingUser){

//   }

// }