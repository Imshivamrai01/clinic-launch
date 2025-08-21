import { NeonButton } from "@/components/ui/NeonButton";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// यह हर tenant का होमपेज है
export default async function TenantHomePage({ params }: { params: { tenant: string }}) {
  const tenant = await prisma.tenant.findUnique({
      where: { slug: params.tenant },
  });

  if (!tenant) {
      return <div>Tenant not found</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: tenant.primaryColor || '#2563EB' }}>
            {tenant.name}
          </h1>
          <ul className="flex space-x-4 text-gray-700">
            <li><a href="#" className="hover:text-primary">Home</a></li>
            <li><a href="#" className="hover:text-primary">Doctors</a></li>
            <li><a href="#" className="hover:text-primary">Services</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="container mx-auto text-center py-20">
        <h2 className="text-5xl font-extrabold text-gray-800">
          Your Health, Our Priority
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Welcome to {tenant.name}. We provide world-class medical services with a compassionate touch.
        </p>
        <div className="mt-8">
          <NeonButton size="lg" glow="blue">
            Book an Appointment
          </NeonButton>
        </div>
      </section>
    </div>
  );
}