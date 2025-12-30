import css from './ProfilePage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { useAuthStore } from '@/lib/store/auth';

// Profile metadata is Private route, so my question is: Do i need to make OpenGraph for it?
export const metadata: Metadata = {
  title: 'Profile',
  description: 'Explore your profile information here',
};

// export const generateMetadata = async (): Promise<Metadata> => {
//   return {
//     title: 'Profile',
//     description: 'Explore your profile information here',
//   };
// };

function Profile() {
  // const user = useAuthStore((state) => state.user);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src="next.svg"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: your_username</p>
          <p>Email: </p>
        </div>
      </div>
    </main>
  );
}

export default Profile;
