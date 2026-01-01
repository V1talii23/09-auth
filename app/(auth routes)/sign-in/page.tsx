'use client';

import { login } from '@/lib/api/clientApi';
import css from './SignIn.module.css';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';

function SignIn() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data);
      router.push('/profile');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const user = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    mutate(user);
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            disabled={isPending}
            type="submit"
            className={css.submitButton}
          >
            Log in
          </button>
        </div>

        {error && <p className={css.error}>Incorrect email or password. </p>}
      </form>
    </main>
  );
}

export default SignIn;
