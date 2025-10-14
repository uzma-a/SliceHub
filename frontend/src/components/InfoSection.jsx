import React from 'react'
import { Star, Truck, Clock } from 'lucide-react';
import pizzaGif from "../assets/pizzaGif.gif";
import pizzaBanner from "../assets/pizzaBanner.jpeg"

export default function InfoSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "Best pizza I've ever had! The crust is perfectly crispy and the toppings are always fresh.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      text: "Delivery was super fast and the pizza arrived hot. Will definitely order again!",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      text: "Amazing flavors and great customer service. Highly recommend to everyone!",
      rating: 5
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-orange-500">About Us</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Welcome to PizzaHub, where we've been crafting authentic, delicious pizzas since 2010. 
                We use only the finest ingredients, from hand-stretched dough to premium mozzarella and 
                locally sourced toppings.
              </p>
              <p className="text-lg text-gray-300 mb-4">
                Our passionate team of pizzaiolos brings years of experience to every pizza that leaves 
                our kitchen. We believe in quality over quantity, and it shows in every bite.
              </p>
              <p className="text-lg text-gray-300">
                Whether you're grabbing a quick bite or celebrating with friends and family, we're here 
                to make your pizza experience unforgettable.
              </p>
            </div>
            <div className="  h-80 flex items-center justify-center  ">
              <img className='rounded-lg h-70 text-white' src={pizzaGif} alt="pizza-gif" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-orange-500">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-slate-800 rounded-lg border-2 border-orange-500 p-6 hover:border-orange-400 transition">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-orange-500">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/*Banner Section */}
         <section className="mb-16">
            <img className='rounded-lg' src={pizzaBanner} alt="pizza-pic" />
         </section>

        {/* Delivery Information Section */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-12 text-orange-500">Delivery & Service</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-lg border-2 border-orange-500 p-8 text-center hover:border-orange-400 transition">
              <Truck size={48} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-300">
                We deliver to your door in 30-45 minutes on average. Track your order in real-time!
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border-2 border-orange-500 p-8 text-center hover:border-orange-400 transition">
              <Clock size={48} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Opening Hours</h3>
              <p className="text-gray-300">
                Monday - Sunday<br />
                11:00 AM - 11:00 PM<br />
                Order anytime online!
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg border-2 border-orange-500 p-8 text-center hover:border-orange-400 transition">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Delivery Zone</h3>
              <p className="text-gray-300">
                We deliver within 5km of our location. Free delivery on orders over $25!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}