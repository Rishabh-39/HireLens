import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password@123', 10);

  const hr = await prisma.user.upsert({
    where: { email: 'hr@hirelens.dev' },
    update: {},
    create: {
      name: 'Demo HR',
      email: 'hr@hirelens.dev',
      password,
      role: Role.HR,
    },
  });

  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@hirelens.dev' },
    update: {},
    create: {
      name: 'Demo Candidate',
      email: 'candidate@hirelens.dev',
      password,
      role: Role.CANDIDATE,
    },
  });

  console.log({ hr: hr.email, candidate: candidate.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
