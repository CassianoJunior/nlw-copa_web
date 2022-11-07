import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GoogleLogo } from 'phosphor-react';
import { useEffect } from 'react';
import logoImg from '../assets/logo.svg';
import { Loading } from '../components/Loading';

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  });

  return session ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-4 items-center justify-center h-screen max-w-sm m-auto">
      <Image src={logoImg} alt="NLW Copa" />

      <button
        className="flex items-center gap-4 rounded px-8 py-4 bg-yellow-500 uppercase font-bold"
        onClick={() => signIn('google')}
      >
        <GoogleLogo weight="bold" size={24} />
        Entrar com o google
      </button>
      <p className="text-gray-300 font-thin text-center mt-8">
        Não utilizamos nenhuma informação além do seu email para criação de sua
        conta.
      </p>
    </div>
  );
};

export default Login;
