import HomePageClient from '@/components/HomePageClient';

export default async function Home() {
  // We fetch the data on the server for speed
  // Next.js handles caching and optimization here
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api');
  
  let initialData = null;
  try {
    const res = await fetch(`${apiUrl}/cms/site`, {
      cache: 'no-store' // Fetch fresh data every time
    });
    if (res.ok) {
      initialData = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch initial home data', err);
  }

  return <HomePageClient initialData={initialData} />;
}
