import SignIn from '@/components/signin/Signin';
import Loader from '@/components/vendor/layout/Loader';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      router.replace("/user/profile");
    } else {
      setLoading(false);
    }
  }, [userInfo, router]);

  if (loading) {
    return <Loader />; 
  }
  return (
      <SignIn />
  );
};

export default LoginPage;

