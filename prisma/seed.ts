import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Tenant 1: Solo Dermatologist ---
  const dermaTenant = await prisma.tenant.create({
    data: {
      name: 'Derma Glow Clinic',
      slug: 'derma',
      primaryColor: '#60A5FA', // Soft Blue
      contactInfo: {
        email: 'contact@dermaglow.com',
        phone: '+1 (555) 123-4567',
        address: '123 SkinCare Ave, Beautify City, USA'
      }
    },
  });

  await prisma.doctor.create({
    data: {
      title: 'Dr.',
      firstName: 'Evelyn',
      lastName: 'Reed',
      slug: 'evelyn-reed',
      specialization: 'Dermatology',
      bio: 'Dr. Evelyn Reed is a board-certified dermatologist with over 10 years of experience.',
      tenantId: dermaTenant.id,
      experienceYears: 10,
    }
  });

  // --- Tenant 2: Multispecialty Clinic ---
  const multiTenant = await prisma.tenant.create({
    data: {
      name: 'Oakridge Wellness Clinic',
      slug: 'multispecialty',
      primaryColor: '#2563EB', // Brand Blue
      contactInfo: {
        email: 'info@oakridgewellness.com',
        phone: '+1 (555) 987-6543',
        address: '456 Health St, Wellness Town, USA'
      }
    }
  });
  
  const pediatricsDept = await prisma.department.create({
      data: {
          name: 'Pediatrics',
          slug: 'pediatrics',
          tenantId: multiTenant.id
      }
  });

  await prisma.doctor.create({
      data: {
          title: 'Dr.',
          firstName: 'John',
          lastName: 'Smith',
          slug: 'john-smith',
          specialization: 'Pediatrician',
          bio: 'Dr. John Smith is dedicated to providing the best care for children.',
          tenantId: multiTenant.id,
          experienceYears: 15,
          departments: { connect: { id: pediatricsDept.id } }
      }
  });

  // --- Tenant 3: Hospital ---
  const hospitalTenant = await prisma.tenant.create({
    data: {
      name: 'City General Hospital',
      slug: 'hospital',
      primaryColor: '#1E40AF', // Deep Blue
      contactInfo: {
        email: 'support@citygeneral.org',
        phone: '+1 (555) 555-5555',
        address: '789 Emergency Rd, Metro City, USA'
      }
    }
  });
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });