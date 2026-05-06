import { PrismaClient } from '../lib/generated/prisma/client'

const prisma = new PrismaClient()

const CLERK_USER_ID = 'user_38QHygJlPl8ZRs837xcTxl860qY'

const d = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day, 9, 0, 0)

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Upsert user
  const user = await prisma.user.upsert({
    where: { clerkUserId: CLERK_USER_ID },
    update: {},
    create: {
      clerkUserId: CLERK_USER_ID,
      email: 'chinthaka.jay92@gmail.com',
      name: 'Chinthaka',
    },
  })
  console.log(`✅ User: ${user.name} (${user.id})`)

  // 2. Clear existing related data (cascade handles transactions)
  await prisma.account.deleteMany({ where: { userId: user.id } })
  await prisma.budget.deleteMany({ where: { userId: user.id } })
  console.log('🗑️  Cleared existing accounts, transactions, and budget')

  // 3. Create accounts
  const checking = await prisma.account.create({
    data: { name: 'Main Checking', type: 'CURRENT', balance: 8450, isDefault: true, userId: user.id },
  })
  const savings = await prisma.account.create({
    data: { name: 'Emergency Savings', type: 'SAVINGS', balance: 15000, isDefault: false, userId: user.id },
  })
  const creditCard = await prisma.account.create({
    data: { name: 'Chase Sapphire', type: 'CREDIT_CARD', balance: -1240.5, isDefault: false, userId: user.id },
  })
  console.log('✅ Created 3 accounts: Main Checking, Emergency Savings, Chase Sapphire')

  // 4. Create budget ($5,000/month)
  await prisma.budget.create({ data: { amount: 5000, userId: user.id } })
  console.log('✅ Created budget: $5,000 / month')

  // 5. Transactions
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

  const txs: TxInput[] = [
    // ── MARCH 2026 ────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 6500,   description: 'Monthly Salary',            date: d(2026,3,1),  category: 'salary',         accountId: checking.id },
    { type: 'INCOME',  amount: 850,    description: 'Freelance – Web Design',    date: d(2026,3,14), category: 'freelance',       accountId: checking.id },
    { type: 'INCOME',  amount: 120,    description: 'Dividend Income',            date: d(2026,3,20), category: 'investments',     accountId: savings.id },
    { type: 'INCOME',  amount: 500,    description: 'Transfer to Savings',        date: d(2026,3,28), category: 'other',           accountId: savings.id },

    { type: 'EXPENSE', amount: 1800,   description: 'March Rent',                 date: d(2026,3,1),  category: 'housing',         accountId: checking.id },
    { type: 'EXPENSE', amount: 95,     description: 'Electric Bill',              date: d(2026,3,5),  category: 'utilities',       accountId: checking.id },
    { type: 'EXPENSE', amount: 65,     description: 'Internet Bill',              date: d(2026,3,7),  category: 'utilities',       accountId: checking.id },
    { type: 'EXPENSE', amount: 35,     description: 'Doctor Copay',               date: d(2026,3,11), category: 'healthcare',      accountId: checking.id },

    { type: 'EXPENSE', amount: 128.40, description: 'Whole Foods',                date: d(2026,3,3),  category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 89.20,  description: 'Costco',                     date: d(2026,3,10), category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 110.50, description: 'Weekly Groceries',           date: d(2026,3,18), category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 95.00,  description: 'Groceries',                  date: d(2026,3,25), category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 48.50,  description: 'Dinner at Nobu',             date: d(2026,3,8),  category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 32.00,  description: 'Lunch – Chipotle',           date: d(2026,3,12), category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 67.80,  description: 'Team Dinner',                date: d(2026,3,22), category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 85,     description: 'Gas – Shell',                date: d(2026,3,6),  category: 'transportation',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 45,     description: 'Gas',                        date: d(2026,3,20), category: 'transportation',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 28,     description: 'Uber Rides',                 date: d(2026,3,15), category: 'transportation',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 15.99,  description: 'Netflix',                    date: d(2026,3,4),  category: 'entertainment',   accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 11.99,  description: 'Spotify Premium',            date: d(2026,3,4),  category: 'entertainment',   accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 14.99,  description: 'Amazon Prime',               date: d(2026,3,15), category: 'shopping',        accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 210,    description: 'Nike Sneakers',              date: d(2026,3,17), category: 'shopping',        accountId: creditCard.id },
    { type: 'EXPENSE', amount: 55.40,  description: 'Amazon Order',               date: d(2026,3,23), category: 'shopping',        accountId: creditCard.id },

    // ── APRIL 2026 ────────────────────────────────────────────────────────────
    { type: 'INCOME',  amount: 6500,   description: 'Monthly Salary',            date: d(2026,4,1),  category: 'salary',         accountId: checking.id },
    { type: 'INCOME',  amount: 1200,   description: 'Freelance – App Dev',       date: d(2026,4,18), category: 'freelance',       accountId: checking.id },
    { type: 'INCOME',  amount: 500,    description: 'Transfer to Savings',        date: d(2026,4,30), category: 'other',           accountId: savings.id },

    { type: 'EXPENSE', amount: 1800,   description: 'April Rent',                 date: d(2026,4,1),  category: 'housing',         accountId: checking.id },
    { type: 'EXPENSE', amount: 88,     description: 'Electric Bill',              date: d(2026,4,5),  category: 'utilities',       accountId: checking.id },
    { type: 'EXPENSE', amount: 65,     description: 'Internet Bill',              date: d(2026,4,7),  category: 'utilities',       accountId: checking.id },
    { type: 'EXPENSE', amount: 120,    description: 'Dental Cleaning',            date: d(2026,4,22), category: 'healthcare',      accountId: checking.id },

    { type: 'EXPENSE', amount: 145.60, description: 'Whole Foods',                date: d(2026,4,2),  category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 78.30,  description: "Trader Joe's",               date: d(2026,4,9),  category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 102.80, description: 'Weekly Groceries',           date: d(2026,4,16), category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 88.40,  description: 'Groceries',                  date: d(2026,4,23), category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 72.50,  description: 'Birthday Dinner',            date: d(2026,4,5),  category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 28.50,  description: 'Lunch',                      date: d(2026,4,11), category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 55.00,  description: 'Sushi Night',                date: d(2026,4,19), category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 38.75,  description: 'Brunch',                     date: d(2026,4,26), category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 90,     description: 'Gas',                        date: d(2026,4,4),  category: 'transportation',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 50,     description: 'Gas',                        date: d(2026,4,18), category: 'transportation',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 38,     description: 'Uber',                       date: d(2026,4,14), category: 'transportation',  accountId: creditCard.id },
    { type: 'EXPENSE', amount: 480,    description: 'Flight – Weekend Trip',      date: d(2026,4,10), category: 'travel',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 250,    description: 'Hotel – 2 nights',           date: d(2026,4,13), category: 'travel',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 15.99,  description: 'Netflix',                    date: d(2026,4,4),  category: 'entertainment',   accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 11.99,  description: 'Spotify Premium',            date: d(2026,4,4),  category: 'entertainment',   accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 14.99,  description: 'Amazon Prime',               date: d(2026,4,15), category: 'shopping',        accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 320,    description: 'Laptop Stand + Accessories', date: d(2026,4,8),  category: 'shopping',        accountId: creditCard.id },
    { type: 'EXPENSE', amount: 89.99,  description: 'Clothing – H&M',            date: d(2026,4,20), category: 'shopping',        accountId: creditCard.id },

    // ── MAY 2026 (1–5 only, today = 5th) ─────────────────────────────────────
    { type: 'INCOME',  amount: 6500,   description: 'Monthly Salary',            date: d(2026,5,1),  category: 'salary',         accountId: checking.id },

    { type: 'EXPENSE', amount: 1800,   description: 'May Rent',                   date: d(2026,5,1),  category: 'housing',         accountId: checking.id },
    { type: 'EXPENSE', amount: 65,     description: 'Internet Bill',              date: d(2026,5,2),  category: 'utilities',       accountId: checking.id },
    { type: 'EXPENSE', amount: 15.99,  description: 'Netflix',                    date: d(2026,5,4),  category: 'entertainment',   accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 11.99,  description: 'Spotify Premium',            date: d(2026,5,4),  category: 'entertainment',   accountId: creditCard.id, isRecurring: true, recurringInterval: 'MONTHLY' },
    { type: 'EXPENSE', amount: 92.30,  description: 'Whole Foods',                date: d(2026,5,3),  category: 'groceries',       accountId: creditCard.id },
    { type: 'EXPENSE', amount: 42.00,  description: 'Lunch',                      date: d(2026,5,2),  category: 'dining',          accountId: creditCard.id },
    { type: 'EXPENSE', amount: 78.00,  description: 'Gas',                        date: d(2026,5,5),  category: 'transportation',  accountId: creditCard.id },
  ]

  await prisma.transaction.createMany({
    data: txs.map(t => ({
      type: t.type,
      amount: t.amount,
      description: t.description ?? null,
      date: t.date,
      category: t.category,
      accountId: t.accountId,
      userId: user.id,
      status: t.status ?? 'COMPLETED',
      isRecurring: t.isRecurring ?? false,
      recurringInterval: t.recurringInterval ?? null,
      nextRecurringDate: null,
      lastProcessed: null,
    })),
  })

  console.log(`✅ Created ${txs.length} transactions (March – May 2026)`)
  console.log('\n🎉 Seeding complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
