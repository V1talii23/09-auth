import css from '@/app/(private routes)/notes/filter/layout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className={css.container}>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}

export default AuthLayout;

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface AuthLayoutProps {
//   children: React.ReactNode;
// }

// function AuthLayout({ children }: AuthLayoutProps) {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     router.refresh();
//     setLoading(false);
//   }, [router]);

//   return <>{loading ? <p>Loading...</p> : children}</>;
// }

// export default AuthLayout;
