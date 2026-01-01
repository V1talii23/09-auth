'use client';

import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

function Edit() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (userData: User) => updateMe(userData),

    onSuccess: () => {},
  });

  const handleSubmit = (formData: FormData) => {
    const username = formData.get('username') as string;
    console.log(username);

    mutate(
      { username: username },
      {
        onSuccess: () => {
          setUser({ ...user, username });
          console.log('sccess');
          queryClient.invalidateQueries({ queryKey: ['me'] });
          router.push('/profile');
        },

        onError: (error) => console.log(error.message),
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUser({ ...user, username: value });
  };

  const handleCancel = () => router.push('/profile');

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={me?.avatar ?? ''}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              className={css.input}
              defaultValue={me?.username}
              onChange={handleChange}
            />
          </div>

          <p>Email: {me?.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              disabled={isPending}
              className={css.saveButton}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Edit;
