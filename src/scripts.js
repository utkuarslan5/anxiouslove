// in a terminal window run `wasp db seed` to seed your dev database with mock user data
export async function deleteAll(prismaClient) {
  await prismaClient.user.deleteMany({});
}

export async function resetSequences(prismaClient) {
  await prismaClient.$queryRaw`SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"));`;
}

export async function resetAll(prismaClient) {
  try {
    await deleteAll(prismaClient);
    await resetSequences(prismaClient);
  } catch (e) {
    console.error(e);
  } finally {
    await prismaClient.$disconnect();
  }
}
