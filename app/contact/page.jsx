'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheck } from 'react-icons/fi';
import Map from '../components/Map';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your server
    toast.success('ההודעה נשלחה בהצלחה');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-right">צור קשר</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-right">פרטי התקשרות</h2>
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-3 justify-start">
            <FiMapPin className="text-primary text-xl" />

              <span>נצרת</span>
            </div>
            <div className="flex items-center gap-3 justify-start">
            
              <FiPhone className="text-primary text-xl" />
              <span dir="ltr">*5743</span>
            </div>

            <div className="flex items-center gap-3 justify-start">
            <FiMail className="text-primary text-xl" />
              <span>info@kingclean.co.il</span>
            

            </div>
            <div className="flex items-center gap-3 justify-start">
            <FiClock className="text-primary text-xl" />

              <span>ראשון-חמישי: 09:00-18:00</span>

            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-right">שלח לנו הודעה</h2>
          <ContactForm />
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden">
            <Map />
          </div>
        </div>
      </section>
    </div>
  );
} 