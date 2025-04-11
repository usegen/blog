import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscription process
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold mb-6">Join My Romanian Adventure</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">Sign up for my newsletter and receive exclusive travel tips, hidden gems, and special offers from across Romania.</p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg text-dark outline-none focus:ring-2 focus:ring-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <Button 
              type="submit"
              className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
