
'use client';

import { AuthGuard } from '@/components/auth-guard';
import { ProfilePageContent } from '@/components/profile-page';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  );
}
