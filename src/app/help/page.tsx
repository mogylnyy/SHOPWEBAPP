import FaqClient from '@/components/FaqClient';

export default function HelpPage() {
  return (
    <div>
      {/* 
        The page title and description are handled within FaqClient for better component cohesion,
        but you could also add a general page intro here if needed.
        Example:
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Help & Support</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Find answers to your questions or get assistance from our AI.
          </p>
        </div> 
      */}
      <FaqClient />
    </div>
  );
}
