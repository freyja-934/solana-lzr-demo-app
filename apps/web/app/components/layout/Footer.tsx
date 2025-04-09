export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-dark-text">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} LAZR. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

