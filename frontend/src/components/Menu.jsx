import React, { useState } from "react";
import onionPizza from "../assets/onion-pizza.jpg";
import cheeseCorn from "../assets/cheese-corn.jpg";
import eggPizza from "../assets/Egg_Pizza.jpg";
import chickenPizza from "../assets/chicken-pizza.jpg";
import doubleChicken from "../assets/double-chicken-pizza.jpg";
import soyaPizza from "../assets/soya-pizza.jpg";
import paneerTikkaPizza from '../assets/paneerTikkaPizza.jpg'
import VegieDeightPizza from '../assets/VegieDeightPizza.jpg'
import GarlicBreadPizza from '../assets/GarlicBreadPizza.jpg'
import tandooriChickenPizza from '../assets/tandooriChickenPizza.jpg'
import BBQChickenPizza from '../assets/BBQChickenPizza.jpg'
import MargheritaPizza from '../assets/MargheritaPizza.jpg'
import ComboPizza1 from '../assets/ComboPizza1.jpeg'

const pizzas = [
  { name: "Classic Onion Pizza", price: 130, desc: "A timeless classic with perfectly caramelized onions on our signature homemade base.", image: onionPizza },
  { name: "Cheese Corn Pizza", price: 150, desc: "Sweet corn kernels with melted cheese creating the perfect comfort food combination.", image: cheeseCorn },
  { name: "Cheese Egg Pizza", price: 150, desc: "Fluffy eggs and rich cheese blend for a protein-packed delicious treat.", image: eggPizza },
  { name: "Cheese Chicken Pizza", price: 160, desc: "Tender chicken pieces with premium cheese on our homemade pizza base.", image: chickenPizza },
  { name: "Double Cheese Chicken Pizza", price: 170, desc: "Extra cheese and chicken for those who want the ultimate indulgence.", image: doubleChicken },
  { name: "Cheese Soyabean Pizza", price: 150, desc: "Healthy soyabean chunks with cheese - a perfect vegetarian protein option.", image: soyaPizza },
  { name: "Paneer Tikka Pizza", price: 180, desc: "Spiced cottage cheese chunks with onions and peppers for an Indian twist.", image: paneerTikkaPizza },
  { name: "Veggie Delight Pizza", price: 140, desc: "Fresh vegetables including bell peppers, mushrooms, and olives.", image: VegieDeightPizza },
  { name: "Garlic Bread Pizza", price: 135, desc: "Crispy crust topped with garlic, herbs, and melted cheese.", image: GarlicBreadPizza },
  { name: "Tandoori Chicken Pizza", price: 175, desc: "Marinated tandoori chicken with yogurt sauce and Indian spices.", image: tandooriChickenPizza },
  { name: "BBQ Chicken Pizza", price: 170, desc: "Tender chicken in smoky BBQ sauce with onions and peppers.", image: BBQChickenPizza },
  { name: "Margherita Pizza", price: 145, desc: "Classic combination of fresh mozzarella, tomatoes, and basil.", image: MargheritaPizza },
];

const combos = [
  {
    name: "Spicy Lovers Combo",
    description: "Classic Onion Pizza + Tandoori Chicken Pizza + Garlic Bread Pizza - Perfect spice adventure!",
    price: 425,
    emoji: "🌶️🍕",
    color: "from-orange-500 to-red-600",
    items: ["Classic Onion Pizza", "Tandoori Chicken Pizza", "Garlic Bread Pizza"],
    image: ComboPizza1
  },
  {
    name: "Veggie Paradise Combo",
    description: "Paneer Tikka Pizza + Veggie Delight Pizza + Cheese Corn Pizza - All vegetarian delight!",
    price: 395,
    emoji: "🥗🍕",
    color: "from-green-500 to-emerald-600",
    items: ["Paneer Tikka Pizza", "Veggie Delight Pizza", "Cheese Corn Pizza"],
    image: ComboPizza1
  },
  {
    name: "Chicken Feast Combo",
    description: "Double Cheese Chicken Pizza + BBQ Chicken Pizza + Garlic Bread Pizza - Chicken lovers unite!",
    price: 475,
    emoji: "🍗🍕",
    color: "from-yellow-500 to-orange-600",
    items: ["Double Cheese Chicken Pizza", "BBQ Chicken Pizza", "Garlic Bread Pizza"],
    image: ComboPizza1
  },
  {
    name: "Classic Family Combo",
    description: "Margherita Pizza + Cheese Corn Pizza + Cheese Egg Pizza - Perfect for sharing!",
    price: 405,
    emoji: "👨‍👩‍👧‍👦🍕",
    color: "from-pink-500 to-rose-600",
    items: ["Margherita Pizza", "Cheese Corn Pizza", "Cheese Egg Pizza"],
    image: ComboPizza1
  }
];

const Menu = ({ addToCart }) => {
  const [addedIndex, setAddedIndex] = useState(null);
  const [addedComboIndex, setAddedComboIndex] = useState(null);

  const handleAdd = (pizza, index) => {
    addToCart(pizza);
    setAddedIndex(index);
    setTimeout(() => setAddedIndex(null), 1000);
  };

  const handleAddCombo = (combo, index) => {
    // Add combo as a single item instead of individual pizzas
    const comboItem = {
      name: combo.name,
      price: combo.price,
      desc: combo.description,
      image: combo.image, // You can add a combo image if needed
      isCombo: true,
      items: combo.items
    };
    addToCart(comboItem);
    setAddedComboIndex(index);
    setTimeout(() => setAddedComboIndex(null), 1000);
  };

  return (
    <section id="menu" className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-orange-400">
          Our Delicious Menu
        </h2>

        {/* Individual Pizzas */}
        <h3 className="text-2xl font-bold text-orange-300 mb-8 ml-4">
          🍕 Individual Pizzas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pizzas.map((pizza, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-orange-400 hover:shadow-orange-500/30 transition"
            >
              <img src={pizza.image} alt={pizza.name} className="w-full h-42 object-cover rounded-lg mb-4" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-orange-400">
                  🍕 {pizza.name}
                </h3>
                <span className="text-lg font-bold text-orange-300">
                  ₹{pizza.price}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{pizza.desc}</p>
              <div className="relative">
                <button
                  onClick={() => handleAdd(pizza, index)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full transition cursor-pointer"
                >
                  Add to Cart 🛒
                </button>
                {addedIndex === index && (
                  <span className="absolute right-2 -top-8 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md animate-fade">
                    Item added ✅
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Combo Section */}
        <h3 className="text-4xl font-bold text-center mb-12 text-orange-400">
          ⭐ Special Combos (Save More!)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {combos.map((combo, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${combo.color} rounded-2xl p-6 shadow-xl border-2 border-white/20 hover:border-orange-400 hover:shadow-orange-500/30 transition`}
              style={{
                backgroundImage: `url(${combo.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/70 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="mb-4">
                  <span className="text-5xl">{combo.emoji}</span>
                  <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                    COMBO
                  </div>
                </div>
              

              <h3 className="text-xl font-bold text-white mb-2">
                {combo.name}
              </h3>

              <p className="text-white text-sm mb-4 ">{combo.description}</p>

              <div className="bg-black/70 rounded-lg p-3 mb-4">
                <p className="text-white font-semibold text-xs mb-2">Includes:</p>
                <ul className="text-white text-xs space-y-1">
                  {combo.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl font-bold text-white">
                  ₹{combo.price}
                </span>
              </div>


              <div className="relative">
                <button
                  onClick={() => handleAddCombo(combo, index)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full transition cursor-pointer"
                >
                  Add Combo 🛒
                </button>
                {addedComboIndex === index && (
                  <span className="absolute right-2 -top-8 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md animate-fade">
                    Combo added ✅
                  </span>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;