import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "../components/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-4">
              Nous contacter
            </h1>
            <p className="text-lg text-muted-foreground font-roboto">
              Nous serions ravis de vous aider
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg border border-border p-8 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-futura font-bold text-primary mb-2">Email</h3>
              <p className="text-muted-foreground font-roboto text-sm">
                contact@luxence.fr
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8 text-center">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-futura font-bold text-primary mb-2">
                Téléphone
              </h3>
              <p className="text-muted-foreground font-roboto text-sm">
                +33 (0) 1 23 45 67 89
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8 text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-futura font-bold text-primary mb-2">
                Adresse
              </h3>
              <p className="text-muted-foreground font-roboto text-sm">
                Paris, France
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
