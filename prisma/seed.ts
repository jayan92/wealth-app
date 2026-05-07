import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const OWNER_CLERK_USER_ID = 'user_38QHygJlPl8ZRs837xcTxl860qY'
const DEMO_CLERK_USER_ID  = 'user_3DNgufFOnQFhY8WV0YKU7UPCG2K'

const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day, 9, 0, 0)

type TxInput = {
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string
  date: Date
  category: string
  accountId: string
  status?: 'PENDING' | 'COMPLETED' | 'FAILED'
  isRecurring?: boolean
  recurringInterval?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
}

// ─── Owner (Chinthaka) ──────────────────────────────────────────────────────
async function seedOwner() {
  console.log('\n👤 Seeding owner account...')

  const user = await prisma.user.upsert({
    where:  { clerkUserId: OWNER_CLERK_USER_ID },
    update: {},
    create: { clerkUserId: OWNER_CLERK_USER_ID, email: 'chinthaka.jay92@gmail.com', name: 'Chinthaka' },
  })
  console.log(`  ✅ User: ${user.name}`)

  await prisma.account.deleteMany({ where: { userId: user.id } })
  await prisma.budget.deleteMany({ where: { userId: user.id } })

  const checking   = await prisma.account.create({ data: { name: 'Main Checking',    type: 'CURRENT',     balance: 8450,    isDefault: true,  userId: user.id } })
  const savings    = await prisma.account.create({ data: { name: 'Emergency Savings', type: 'SAVINGS',     balance: 15000,   isDefault: false, userId: user.id } })
  const creditCard = await prisma.account.create({ data: { name: 'Chase Sapphire',   type: 'CREDIT_CARD', balance: -1240.5, isDefault: false, userId: user.id } })
  await prisma.budget.create({ data: { amount: 5000, userId: user.id } })

  const txs: TxInput[] = [
    // ── MARCH 2026 ────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 6500,   description: 'Monthly Salary',            date: d(2026,3,1),  category: 'salary',        accountId: checking.id },
    { type: 'INCOME',  amount: 850,    description: 'Freelance – Web Design',    date: d(2026,3,14), category: 'freelance',      accountId: checking.id },
    { type: 'INCOME',  amount: 120,    description: 'Dividend Income',           date: d(2026,3,20), category: 'investments',    accountId: savings.id },
    { type: 'EXPENSE', amount: 1800,   description: 'March Rent',                date: d(2026,3,1),  category: 'housing',        accountId: checking.id },
    { type: 'EXPENSE', amount: 95,     description: 'Electric Bill',             date: d(2026,3,5),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 65,     description: 'Internet Bill',             date: d(2026,3,7),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 35,     description: 'Doctor Copay',              date: d(2026,3,11), category: 'healthcare',     accountId: checking.id },
    { type: 'EXPENSE', amount: 128.40, description: 'Whole Foods',               date: d(2026,3,3),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 89.20,  description: 'Costco',                    date: d(2026,3,10), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 110.50, description: 'Weekly Groceries',          date: d(2026,3,18), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 48.50,  description: 'Dinner at Nobu',            date: d(2026,3,8),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 32.00,  description: 'Lunch – Chipotle',          date: d(2026,3,12), category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 85,     description: 'Gas – Shell',               date: d(2026,3,6),  category: 'transportation', accountId: creditCard.id },
    { type: 'EXPENSE', amount: 28,     description: 'Uber Rides',                date: d(2026,3,15), category: 'transportation', accountId: creditCard.id },
    { type: 'EXPENSE', amount: 15.99,  description: 'Netflix',                   date: d(2026,3,4),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 11.99,  description: 'Spotify Premium',           date: d(2026,3,4),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 14.99,  description: 'Amazon Prime',              date: d(2026,3,15), category: 'shopping',       accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 210,    description: 'Nike Sneakers',             date: d(2026,3,17), category: 'shopping',       accountId: creditCard.id },
    // ── APRIL 2026 ────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 6500,   description: 'Monthly Salary',            date: d(2026,4,1),  category: 'salary',        accountId: checking.id },
    { type: 'INCOME',  amount: 1200,   description: 'Freelance – App Dev',       date: d(2026,4,18), category: 'freelance',      accountId: checking.id },
    { type: 'EXPENSE', amount: 1800,   description: 'April Rent',                date: d(2026,4,1),  category: 'housing',        accountId: checking.id },
    { type: 'EXPENSE', amount: 88,     description: 'Electric Bill',             date: d(2026,4,5),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 65,     description: 'Internet Bill',             date: d(2026,4,7),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 120,    description: 'Dental Cleaning',           date: d(2026,4,22), category: 'healthcare',     accountId: checking.id },
    { type: 'EXPENSE', amount: 145.60, description: 'Whole Foods',               date: d(2026,4,2),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 78.30,  description: "Trader Joe's",              date: d(2026,4,9),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 72.50,  description: 'Birthday Dinner',           date: d(2026,4,5),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 55.00,  description: 'Sushi Night',               date: d(2026,4,19), category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 90,     description: 'Gas',                       date: d(2026,4,4),  category: 'transportation', accountId: creditCard.id },
    { type: 'EXPENSE', amount: 480,    description: 'Flight – Weekend Trip',     date: d(2026,4,10), category: 'travel',         accountId: creditCard.id },
    { type: 'EXPENSE', amount: 250,    description: 'Hotel – 2 nights',          date: d(2026,4,13), category: 'travel',         accountId: creditCard.id },
    { type: 'EXPENSE', amount: 15.99,  description: 'Netflix',                   date: d(2026,4,4),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 11.99,  description: 'Spotify Premium',           date: d(2026,4,4),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 14.99,  description: 'Amazon Prime',              date: d(2026,4,15), category: 'shopping',       accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 320,    description: 'Laptop Stand + Accessories',date: d(2026,4,8),  category: 'shopping',       accountId: creditCard.id },
    // ── MAY 2026 ──────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 6500,   description: 'Monthly Salary',            date: d(2026,5,1),  category: 'salary',        accountId: checking.id },
    { type: 'EXPENSE', amount: 1800,   description: 'May Rent',                  date: d(2026,5,1),  category: 'housing',        accountId: checking.id },
    { type: 'EXPENSE', amount: 65,     description: 'Internet Bill',             date: d(2026,5,2),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 15.99,  description: 'Netflix',                   date: d(2026,5,4),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 11.99,  description: 'Spotify Premium',           date: d(2026,5,4),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 92.30,  description: 'Whole Foods',               date: d(2026,5,3),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 42.00,  description: 'Lunch',                     date: d(2026,5,2),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 78.00,  description: 'Gas',                       date: d(2026,5,5),  category: 'transportation', accountId: creditCard.id },
  ]

  await prisma.transaction.createMany({
    data: txs.map(t => ({
      type: t.type, amount: t.amount, description: t.description ?? null,
      date: t.date, category: t.category, accountId: t.accountId, userId: user.id,
      status: t.status ?? 'COMPLETED', isRecurring: t.isRecurring ?? false,
      recurringInterval: t.recurringInterval ?? null, nextRecurringDate: null, lastProcessed: null,
    })),
  })
  console.log(`  ✅ ${txs.length} transactions seeded`)
}

// ─── Demo User (Tamir) ───────────────────────────────────────────────────────
async function seedDemo() {
  console.log('\n🎭 Seeding demo account...')

  const user = await prisma.user.upsert({
    where:  { clerkUserId: DEMO_CLERK_USER_ID },
    update: { name: 'Tamir', email: 'tamir89089@lohinja.com' },
    create: { clerkUserId: DEMO_CLERK_USER_ID, email: 'tamir89089@lohinja.com', name: 'Tamir' },
  })
  console.log(`  ✅ User: ${user.name}`)

  await prisma.account.deleteMany({ where: { userId: user.id } })
  await prisma.budget.deleteMany({ where: { userId: user.id } })

  const checking   = await prisma.account.create({ data: { name: 'Daily Checking',   type: 'CURRENT',     balance: 5320.75, isDefault: true,  userId: user.id } })
  const savings    = await prisma.account.create({ data: { name: 'Savings Goal',     type: 'SAVINGS',     balance: 9500,    isDefault: false, userId: user.id } })
  const creditCard = await prisma.account.create({ data: { name: 'Visa Platinum',   type: 'CREDIT_CARD', balance: -870.40, isDefault: false, userId: user.id } })
  await prisma.budget.create({ data: { amount: 4000, userId: user.id } })

  const txs: TxInput[] = [
    // ── MARCH 2026 ────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 5200,   description: 'Monthly Salary',            date: d(2026,3,1),  category: 'salary',        accountId: checking.id },
    { type: 'INCOME',  amount: 600,    description: 'Freelance – Logo Design',   date: d(2026,3,10), category: 'freelance',      accountId: checking.id },
    { type: 'INCOME',  amount: 85,     description: 'Stock Dividend',            date: d(2026,3,22), category: 'investments',    accountId: savings.id },
    { type: 'EXPENSE', amount: 1450,   description: 'March Rent',                date: d(2026,3,1),  category: 'housing',        accountId: checking.id },
    { type: 'EXPENSE', amount: 110,    description: 'Electricity',               date: d(2026,3,4),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 55,     description: 'Internet',                  date: d(2026,3,6),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 45,     description: 'Phone Bill',                date: d(2026,3,8),  category: 'bills',          accountId: checking.id },
    { type: 'EXPENSE', amount: 80,     description: 'Gym Membership',            date: d(2026,3,3),  category: 'personal',       accountId: checking.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 135.60, description: 'Supermarket',               date: d(2026,3,5),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 92.40,  description: 'Weekly Groceries',          date: d(2026,3,12), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 108.20, description: 'Grocery Run',               date: d(2026,3,19), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 76.50,  description: 'Supermarket',               date: d(2026,3,26), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 55.00,  description: 'Restaurant – Date Night',   date: d(2026,3,7),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 18.50,  description: 'Lunch – Sandwich Shop',     date: d(2026,3,13), category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 42.00,  description: 'Pizza Night',               date: d(2026,3,21), category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 70,     description: 'Fuel',                      date: d(2026,3,9),  category: 'transportation', accountId: creditCard.id },
    { type: 'EXPENSE', amount: 22,     description: 'Bus Pass',                  date: d(2026,3,1),  category: 'transportation', accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 13.99,  description: 'Disney+',                   date: d(2026,3,5),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 9.99,   description: 'Spotify',                   date: d(2026,3,5),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 48,     description: 'Cinema Tickets',            date: d(2026,3,16), category: 'entertainment',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 65.99,  description: 'New Shoes',                 date: d(2026,3,20), category: 'shopping',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 29.99,  description: 'Online Shopping',           date: d(2026,3,27), category: 'shopping',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 200,    description: 'Transfer to Savings',       date: d(2026,3,28), category: 'other-expense',  accountId: checking.id },
    // ── APRIL 2026 ────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 5200,   description: 'Monthly Salary',            date: d(2026,4,1),  category: 'salary',        accountId: checking.id },
    { type: 'INCOME',  amount: 950,    description: 'Freelance – UI Design',     date: d(2026,4,15), category: 'freelance',      accountId: checking.id },
    { type: 'INCOME',  amount: 300,    description: 'Sold Old Laptop',           date: d(2026,4,20), category: 'other-income',   accountId: checking.id },
    { type: 'EXPENSE', amount: 1450,   description: 'April Rent',                date: d(2026,4,1),  category: 'housing',        accountId: checking.id },
    { type: 'EXPENSE', amount: 98,     description: 'Electricity',               date: d(2026,4,4),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 55,     description: 'Internet',                  date: d(2026,4,6),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 45,     description: 'Phone Bill',                date: d(2026,4,8),  category: 'bills',          accountId: checking.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 80,     description: 'Gym Membership',            date: d(2026,4,3),  category: 'personal',       accountId: checking.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 150,    description: 'Dentist Visit',             date: d(2026,4,17), category: 'healthcare',     accountId: checking.id },
    { type: 'EXPENSE', amount: 40,     description: 'Pharmacy',                  date: d(2026,4,24), category: 'healthcare',     accountId: checking.id },
    { type: 'EXPENSE', amount: 118.30, description: 'Supermarket',               date: d(2026,4,3),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 88.60,  description: 'Grocery Run',               date: d(2026,4,10), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 124.10, description: 'Weekly Shop',               date: d(2026,4,17), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 94.20,  description: 'Supermarket',               date: d(2026,4,24), category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 68.00,  description: 'Anniversary Dinner',        date: d(2026,4,6),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 24.50,  description: 'Lunch',                     date: d(2026,4,14), category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 38.00,  description: 'Dinner with Friends',       date: d(2026,4,22), category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 75,     description: 'Fuel',                      date: d(2026,4,7),  category: 'transportation', accountId: creditCard.id },
    { type: 'EXPENSE', amount: 32,     description: 'Uber',                      date: d(2026,4,19), category: 'transportation', accountId: creditCard.id },
    { type: 'EXPENSE', amount: 380,    description: 'Flight – Easter Holiday',   date: d(2026,4,9),  category: 'travel',         accountId: creditCard.id },
    { type: 'EXPENSE', amount: 190,    description: 'Hotel – 2 nights',          date: d(2026,4,11), category: 'travel',         accountId: creditCard.id },
    { type: 'EXPENSE', amount: 85,     description: 'Holiday Spending',          date: d(2026,4,12), category: 'travel',         accountId: creditCard.id },
    { type: 'EXPENSE', amount: 13.99,  description: 'Disney+',                   date: d(2026,4,5),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 9.99,   description: 'Spotify',                   date: d(2026,4,5),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 22,     description: 'Bus Pass',                  date: d(2026,4,1),  category: 'transportation', accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 110,    description: 'Clothing Haul',             date: d(2026,4,23), category: 'shopping',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 54.99,  description: 'Amazon Order',              date: d(2026,4,28), category: 'shopping',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 200,    description: 'Transfer to Savings',       date: d(2026,4,29), category: 'other-expense',  accountId: checking.id },
    // ── MAY 2026 ──────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 5200,   description: 'Monthly Salary',            date: d(2026,5,1),  category: 'salary',        accountId: checking.id },
    { type: 'EXPENSE', amount: 1450,   description: 'May Rent',                  date: d(2026,5,1),  category: 'housing',        accountId: checking.id },
    { type: 'EXPENSE', amount: 55,     description: 'Internet',                  date: d(2026,5,2),  category: 'utilities',      accountId: checking.id },
    { type: 'EXPENSE', amount: 45,     description: 'Phone Bill',                date: d(2026,5,2),  category: 'bills',          accountId: checking.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 80,     description: 'Gym Membership',            date: d(2026,5,3),  category: 'personal',       accountId: checking.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 13.99,  description: 'Disney+',                   date: d(2026,5,5),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 9.99,   description: 'Spotify',                   date: d(2026,5,5),  category: 'entertainment',  accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 22,     description: 'Bus Pass',                  date: d(2026,5,1),  category: 'transportation', accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 104.80, description: 'Supermarket',               date: d(2026,5,3),  category: 'groceries',      accountId: creditCard.id },
    { type: 'EXPENSE', amount: 35.50,  description: 'Lunch',                     date: d(2026,5,2),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 62.00,  description: 'Dinner Out',                date: d(2026,5,6),  category: 'food',           accountId: creditCard.id },
    { type: 'EXPENSE', amount: 68,     description: 'Fuel',                      date: d(2026,5,4),  category: 'transportation', accountId: creditCard.id },
  ]

  await prisma.transaction.createMany({
    data: txs.map(t => ({
      type: t.type, amount: t.amount, description: t.description ?? null,
      date: t.date, category: t.category, accountId: t.accountId, userId: user.id,
      status: t.status ?? 'COMPLETED', isRecurring: t.isRecurring ?? false,
      recurringInterval: t.recurringInterval ?? null, nextRecurringDate: null, lastProcessed: null,
    })),
  })
  console.log(`  ✅ ${txs.length} transactions seeded`)
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding database...')
  await seedOwner()
  await seedDemo()
  console.log('\n🎉 Seeding complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
