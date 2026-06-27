import { HomePageContent } from "@/components/home/home-page-content";
import { PageContainer } from "@/components/layout/page-container";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageContainer>
      <HomePageContent isAuthenticated={!!user} />
    </PageContainer>
  );
}
