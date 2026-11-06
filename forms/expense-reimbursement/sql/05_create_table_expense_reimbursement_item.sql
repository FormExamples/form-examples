-- One line item (a single receipt or purchase) within an expense reimbursement claim.

CREATE TABLE expense_reimbursement_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    expense_reimbursement_id UUID NOT NULL REFERENCES expense_reimbursement(id) ON DELETE CASCADE,

    line_number INTEGER NOT NULL CHECK (line_number >= 1),
    expense_date DATE,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN ('travel', 'mileage', 'accommodation', 'meals', 'equipment', 'clothing-uniform', 'training-course', 'professional-fees', 'registration-and-licensing', 'books-and-subscriptions', 'telephone-and-internet', 'postage', 'parking-and-tolls', 'client-hospitality', 'other', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    merchant VARCHAR(255) NOT NULL DEFAULT '',
    currency_as_iso_4217 CHAR(3) NOT NULL DEFAULT 'GBP',
    amount NUMERIC(12, 2) CHECK (amount IS NULL OR amount >= 0),
    vat_amount NUMERIC(12, 2) CHECK (vat_amount IS NULL OR vat_amount >= 0),
    exchange_rate_to_claim_currency NUMERIC(12, 6),
    payment_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (payment_method IN ('personal-credit-card', 'personal-debit-card', 'cash', 'other', '')),
    mileage_distance_miles NUMERIC(8, 1) CHECK (mileage_distance_miles IS NULL OR mileage_distance_miles >= 0),
    receipt_attached BOOLEAN NOT NULL DEFAULT FALSE,
    receipt_reference VARCHAR(255) NOT NULL DEFAULT '',
    receipt_missing_reason VARCHAR(500) NOT NULL DEFAULT '',
    prior_approval_obtained BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (expense_reimbursement_id, line_number)
);

CREATE INDEX index_expense_reimbursement_item_claim_id ON expense_reimbursement_item(expense_reimbursement_id);

CREATE TRIGGER trigger_expense_reimbursement_item_updated_at
    BEFORE UPDATE ON expense_reimbursement_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE expense_reimbursement_item IS
    'One line item (a single receipt or purchase) within an expense reimbursement claim.';

COMMENT ON COLUMN expense_reimbursement_item.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement_item.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement_item.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement_item.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement_item.expense_reimbursement_id IS
    'Foreign key to the expense_reimbursement table.';
COMMENT ON COLUMN expense_reimbursement_item.line_number IS
    'Line number.';
COMMENT ON COLUMN expense_reimbursement_item.expense_date IS
    'Expense date.';
COMMENT ON COLUMN expense_reimbursement_item.category IS
    'Category. One of: travel, mileage, accommodation, meals, equipment, clothing-uniform, training-course, professional-fees, ….';
COMMENT ON COLUMN expense_reimbursement_item.description IS
    'Description.';
COMMENT ON COLUMN expense_reimbursement_item.merchant IS
    'Merchant.';
COMMENT ON COLUMN expense_reimbursement_item.currency_as_iso_4217 IS
    'Currency as iso 4217.';
COMMENT ON COLUMN expense_reimbursement_item.amount IS
    'Amount.';
COMMENT ON COLUMN expense_reimbursement_item.vat_amount IS
    'Vat amount.';
COMMENT ON COLUMN expense_reimbursement_item.exchange_rate_to_claim_currency IS
    'Exchange rate to claim currency.';
COMMENT ON COLUMN expense_reimbursement_item.payment_method IS
    'Payment method. One of: personal-credit-card, personal-debit-card, cash, other.';
COMMENT ON COLUMN expense_reimbursement_item.mileage_distance_miles IS
    'Mileage distance miles.';
COMMENT ON COLUMN expense_reimbursement_item.receipt_attached IS
    'Receipt attached.';
COMMENT ON COLUMN expense_reimbursement_item.receipt_reference IS
    'Receipt reference.';
COMMENT ON COLUMN expense_reimbursement_item.receipt_missing_reason IS
    'Receipt missing reason.';
COMMENT ON COLUMN expense_reimbursement_item.prior_approval_obtained IS
    'Prior approval obtained.';
