import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      name: 'Ritu & Sahil Malani',
      role: 'Diwali Party Host · Model Town, Delhi',
      comment:
        'The Poker Box (CD 26) with the edible ₹500 rupee notes and chocolate bitcoins was the absolute showstopper of our Diwali card party! Guests couldn’t believe they were 100% edible chocolate. Pure craftsmanship!',
      rating: 5,
      product: 'Grand Poker Chocolate Box (CD 26)',
    },
    {
      id: 'rev-2',
      name: 'Pooja Aggarwal',
      role: 'Wedding Trousseau Client · Pitampura',
      comment:
        'We ordered 120 custom cracker hampers for our pre-wedding ceremonies. The paan and crunchy hazelnut chocolates tasted exceptional, and the golden packaging looked like a million bucks. Highly recommend ChocoBloom!',
      rating: 5,
      product: 'Cracker Chocolate Royal Platter',
    },
    {
      id: 'rev-3',
      name: 'Vikram Sachdeva',
      role: 'Corporate HR Director · Gurugram',
      comment:
        'We ordered 250 customized logo chocolate boxes for our team with edible company logos. The ease of ordering through WhatsApp and paying via UPI without complicated portal logins made the whole procurement effortless.',
      rating: 5,
      product: 'Corporate Executive Logo Hampers',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EADBCC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8C5E35]">
            Loved by Over 10,000 Sweet Teeth
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            Celebrations Made Sweeter
          </h2>
          <p className="text-xs sm:text-sm text-[#7B6256]">
            Real stories from our festive patrons, wedding planners, and corporate partners across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCC] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/60 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#E0C9BA]" />
                </div>
                <p className="text-xs sm:text-sm text-[#4A2E20] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0E4D7] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-[#2C1810] flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <span className="text-[11px] text-[#8C766C]">{rev.role}</span>
                </div>
                <span className="text-[10px] text-[#A66228] font-medium bg-[#FAF2E8] px-2 py-0.5 rounded">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
