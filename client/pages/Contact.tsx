import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

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

          <div className="grid md:grid-cols-3 gap-8 mb-12">
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

          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground font-roboto mb-6">
              La page de contact est en cours de développement. N'hésitez pas à
              nous contacter directement via les informations de contact
              affichées ci-dessus.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-futura font-bold transition-all duration-300 hover:gap-4 group"
            >
              Retour à l'accueil
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
