import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Award, Target } from "lucide-react";
import heroImage from "@/assets/hero-hoodie.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Quality",
      description: "Every thread, every stitch is crafted with meticulous attention to detail and genuine love for the art of fashion.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building a community of like-minded individuals who appreciate premium streetwear culture.",
    },
    {
      icon: Award,
      title: "Excellence Always",
      description: "We never compromise on quality. Our hoodies are made from the finest materials with superior craftsmanship.",
    },
    {
      icon: Target,
      title: "Purpose Driven",
      description: "Our mission is to redefine streetwear by creating pieces that embody both style and substance.",
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground">Our Story</Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            T'RISHH
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-light">
            Defined by Desire
          </p>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Born from a passion for premium streetwear, T'RISHH represents the intersection of luxury and urban culture. 
            We create hoodies that don't just look good – they embody a lifestyle, a statement, a desire for excellence.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              To revolutionize streetwear by creating premium hoodies that combine exceptional quality, 
              innovative design, and cultural relevance. We believe that clothing should be more than fabric – 
              it should be an extension of your identity, your aspirations, and your unique style.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={value.title} className="border-0 shadow-card hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                      <value.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Story Behind T'RISHH
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  T'RISHH was conceived in the bustling streets of urban India, where fashion meets function, 
                  and style speaks louder than words. Our founder envisioned a brand that would bridge the gap 
                  between high-end fashion and accessible streetwear.
                </p>
                <p>
                  The name "T'RISHH" itself represents the desire – the burning passion for something more, 
                  something better, something that defines who you are. It's not just about wearing a hoodie; 
                  it's about wearing your aspirations.
                </p>
                <p>
                  Every T'RISHH hoodie is crafted with premium materials sourced from the finest mills, 
                  ensuring not just comfort but longevity. We believe in slow fashion – creating pieces 
                  that last, reducing waste, and promoting sustainable consumption.
                </p>
                <p>
                  Today, T'RISHH has grown into a community of over 5,000 satisfied customers who don't just 
                  wear our hoodies – they live the lifestyle, embrace the culture, and embody the values we stand for.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="T'RISHH Story"
                className="w-full h-96 object-cover rounded-lg shadow-premium"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent rounded-lg" />
              <div className="absolute bottom-6 left-6 text-primary-foreground">
                <p className="font-display text-2xl font-bold mb-2">Defined by Desire</p>
                <p className="text-primary-foreground/80">Premium Streetwear Culture</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Join the T'RISHH Community
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Become part of a movement that values quality, style, and authenticity. 
            Experience streetwear like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="hover-lift">
              Shop Collection
            </Button>
            <Button size="lg" variant="ghost" className="border border-primary-foreground/20 hover:bg-primary-foreground/10">
              Follow Our Journey
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;