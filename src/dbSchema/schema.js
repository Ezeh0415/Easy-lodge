// schema.js
const { 
  pgTable, 
  serial, 
  integer, 
  varchar, 
  text, 
  timestamp, 
  jsonb,
  index 
} = require('drizzle-orm/pg-core');
const { users } = require('./users'); // Import users table

const payment = pgTable('payment', {
  // Core identifiers
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Paystack specific fields
  reference: varchar('reference', { length: 100 }).unique().notNull(),
  accessCode: varchar('access_code', { length: 100 }).notNull(),
  authorizationUrl: text('authorization_url').notNull(),
  
  // Payment details
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('NGN'),
  description: varchar('description', { length: 255 }),
  
  // Customer info
  email: varchar('email', { length: 150 }).notNull(),
  customerCode: varchar('customer_code', { length: 100 }),
  customerName: varchar('customer_name', { length: 200 }),
  
  // Status tracking
  status: varchar('status', { length: 20 }).default('pending'),
  gatewayResponse: text('gateway_response'),
  transactionDate: timestamp('transaction_date'),
  paidAt: timestamp('paid_at'),
  
  // Additional Paystack data
  paymentMethod: varchar('payment_method', { length: 50 }),
  cardLast4: varchar('card_last4', { length: 4 }),
  cardType: varchar('card_type', { length: 50 }),
  bank: varchar('bank', { length: 100 }),
  
  // Metadata
  metadata: jsonb('metadata'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    // Indexes
    userIdIdx: index('idx_payment_user_id').on(table.userId),
    statusIdx: index('idx_payment_status').on(table.status),
    referenceIdx: index('idx_payment_reference').on(table.reference),
    createdAtIdx: index('idx_payment_created_at').on(table.createdAt),
  };
});

module.exports = { payment };