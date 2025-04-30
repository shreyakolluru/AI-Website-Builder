'use client';
import React, { useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Lookup from '@/data/Lookup';
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import uuid4 from 'uuid4';

function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const createUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Token Response:', tokenResponse);
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } }
        );

        console.log('User Info:', userInfo.data);
        const user = userInfo.data;

        // Create or get user in Convex
        const userId = await createUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          uid: uuid4(),
        });

        // Store user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Update userDetail with Convex user ID
        setUserDetail({ ...user, _id: userId });

        closeDialog(false);
      } catch (error) {
        console.error('Google login failed:', error);
      }
    },
    onError: (errorResponse) => console.log('Google login error:', errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <div className="flex flex-col justify-center items-center gap-3">
              <h2 className="font-bold text-2xl text-center text-white">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
                onClick={() => googleLogin()}
              >
                Sign In With Google
              </Button>
              <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;