export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} QuickBuy TG. All rights reserved.</p>
      </div>
    </footer>
  );
}
