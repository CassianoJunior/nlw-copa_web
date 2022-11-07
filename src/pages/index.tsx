interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

import { GetServerSideProps } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import appPreviewImage from '../assets/app-nlw-copa-preview.png';
import iconCheckImg from '../assets/iconCheck.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatars-example.png';
import { Loading } from '../components/Loading';
import { api } from '../lib/axios';

export default function Home({ pollCount, guessCount, userCount }: HomeProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [pollTitle, setPollTitle] = useState('');

  const createPoll = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('/polls', {
        title: pollTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transferência!'
      );
    } catch (err) {
      alert('Falha ao criar o bolão');
      console.log(err);
    }

    setPollTitle('');
  };

  useEffect(() => {
    if (!session && typeof session !== 'undefined') {
      router.push('/login');
    }
  }, [session, router]);

  return !session ? (
    <Loading />
  ) : (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <div className="absolute top-2 right-2">
        <button
          className="bg-yellow-500 px-4 py-2 rounded uppercase font-bold"
          onClick={() => signOut()}
        >
          Sair
        </button>
      </div>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={usersAvatarExampleImg}
            alt="Imagens de membros participantes"
          />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+ {userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
            className="
              flex-1 
              px-6 
              py-4 
              rounded 
              bg-gray-800 
              border 
              border-gray-600 
              outline-none 
              text-sm
              text-gray-100
            "
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
          />
          <button
            className="
              bg-yellow-500
              px-6 
              py-4 
              rounded 
              font-bold 
              uppercase 
              text-gray-900 
              text-sm 
              hover:bg-yellow-700
            "
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar o seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Icone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+ {pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Icone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+ {guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
        priority
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const {  } = await getSession(context);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }

  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('polls/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
