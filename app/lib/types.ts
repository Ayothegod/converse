export interface UserSessionType {
  session: string;
  userId: string;
  user: {
    id: string;
    email: string;
    username: string | null;
    hashedPassword: string;
  };
}

// get the user data or redirect to /login if it failed
// let user = await authenticator.isAuthenticated(request, {
//     failureRedirect: "/login",
//   });
  
//   // if the user is authenticated, redirect to /dashboard
//   await authenticator.isAuthenticated(request, {
//     successRedirect: "/dashboard",
//   });
  
//   // get the user or null, and do different things in your loader/action based on
//   // the result
//   let user = await authenticator.isAuthenticated(request);
//   if (user) {
//     // here the user is authenticated
//   } else {
//     // here the user is not authenticated
//   }