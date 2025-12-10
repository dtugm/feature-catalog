export const SiteFooter = () => {
  return (
    <footer className="relative w-full mt-20">
      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8" />
      
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xs">G</span>
          </div>
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Geo AIT Gallery
          </span>
        </div>
        
        <div className="text-sm text-default-500">
          &copy; {new Date().getFullYear()} Geo AIT Gallery. All rights reserved.
        </div>
        
        <div className="flex gap-6">
          <a 
            href="#" 
            className="text-sm text-default-600 hover:text-primary transition-colors duration-200"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-sm text-default-600 hover:text-primary transition-colors duration-200"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-sm text-default-600 hover:text-primary transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
