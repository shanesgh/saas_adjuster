-- Comprehensive Database Schema for Accident Adjuster SaaS
-- Optimized for minimal queries - denormalized where beneficial

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with PIN implementation
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'adjuster', 'clerical')),
    
    -- PIN system (3 uses, 5 days valid)
    pin VARCHAR(10),
    pin_created_at TIMESTAMP WITH TIME ZONE,
    pin_uses_remaining INTEGER DEFAULT 3,
    pin_expires_at TIMESTAMP WITH TIME ZONE,
    pin_locked_until TIMESTAMP WITH TIME ZONE,
    
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table - main entity with embedded data for minimal queries
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    
    -- Claim identifiers
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    your_ref VARCHAR(100),
    our_ref VARCHAR(100),
    invoice_number VARCHAR(100),
    
    -- Dates
    date_received DATE,
    date_inspected DATE,
    date_of_loss DATE,
    letter_date DATE,
    
    -- Insured information (denormalized for performance)
    insured_name VARCHAR(255),
    insured_address TEXT,
    third_party_name VARCHAR(255),
    third_party_vehicle VARCHAR(255),
    
    -- Vehicle information (embedded for single query)
    vehicle_data JSONB NOT NULL DEFAULT '{}', -- All vehicle details, features, condition, tyres
    
    -- Assessment data
    damage_data JSONB DEFAULT '{}', -- Damage details, affected areas, severity
    estimate_data JSONB DEFAULT '{}', -- Parts, labour, costs, completion time
    recommendation_data JSONB DEFAULT '{}', -- Settlement basis, costs, recommendations
    
    -- Inspection details
    place_of_inspection VARCHAR(255),
    claims_technician VARCHAR(255),
    witness VARCHAR(255),
    number_of_photographs INTEGER DEFAULT 0,
    
    -- Status and workflow
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
    current_step VARCHAR(50) DEFAULT 'documents',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Notes with versioning - separate table for audit trail
CREATE TABLE claim_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Note content and context
    section VARCHAR(100) NOT NULL, -- 'documents', 'vehicle', 'damage', etc.
    content TEXT NOT NULL,
    
    -- Versioning
    version INTEGER NOT NULL DEFAULT 1,
    is_current BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE claim_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id),
    
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    
    -- Document metadata
    document_type VARCHAR(100), -- 'estimate', 'photo', 'statement', etc.
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table - generated reports with full data snapshot
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    generated_by UUID REFERENCES users(id),
    
    -- Report metadata
    report_type VARCHAR(50) DEFAULT 'assessment',
    report_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Full data snapshot for historical accuracy (denormalized)
    report_data JSONB NOT NULL, -- Complete claim data at time of generation
    
    -- Generated files
    pdf_url TEXT,
    pdf_filename VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'archived')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    claim_id UUID REFERENCES claims(id),
    
    -- Invoice details
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    
    -- Billing information (denormalized)
    bill_to_name VARCHAR(255) NOT NULL,
    bill_to_address TEXT NOT NULL,
    
    -- Financial data
    subtotal DECIMAL(10,2) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 12.5,
    vat_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Line items as JSONB for flexibility
    line_items JSONB NOT NULL DEFAULT '[]',
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for all changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    
    action VARCHAR(50) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_claims_company_id ON claims(company_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created_at ON claims(created_at);
CREATE INDEX idx_claim_notes_claim_id ON claim_notes(claim_id);
CREATE INDEX idx_claim_notes_current ON claim_notes(claim_id, is_current) WHERE is_current = true;
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_pin_expires ON users(pin_expires_at) WHERE pin_expires_at IS NOT NULL;
CREATE INDEX idx_reports_company_id ON reports(company_id);
CREATE INDEX idx_reports_claim_id ON reports(claim_id);
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_audit_log_record ON audit_log(table_name, record_id);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate PIN with expiry
CREATE OR REPLACE FUNCTION generate_user_pin(user_uuid UUID)
RETURNS VARCHAR(10) AS $$
DECLARE
    new_pin VARCHAR(10);
BEGIN
    -- Generate 7-character alphanumeric PIN
    new_pin := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 7));
    
    -- Update user with new PIN
    UPDATE users 
    SET 
        pin = new_pin,
        pin_created_at = NOW(),
        pin_uses_remaining = 3,
        pin_expires_at = NOW() + INTERVAL '5 days',
        pin_locked_until = NULL
    WHERE id = user_uuid;
    
    RETURN new_pin;
END;
$$ LANGUAGE plpgsql;

-- Function to validate PIN
CREATE OR REPLACE FUNCTION validate_user_pin(user_uuid UUID, input_pin VARCHAR(10))
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT * INTO user_record FROM users WHERE id = user_uuid;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if PIN is locked
    IF user_record.pin_locked_until IS NOT NULL AND user_record.pin_locked_until > NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check if PIN is expired
    IF user_record.pin_expires_at IS NULL OR user_record.pin_expires_at < NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check if PIN has uses remaining
    IF user_record.pin_uses_remaining <= 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check PIN match
    IF user_record.pin = input_pin THEN
        -- Decrement uses
        UPDATE users 
        SET pin_uses_remaining = pin_uses_remaining - 1
        WHERE id = user_uuid;
        RETURN TRUE;
    ELSE
        -- Lock PIN if no uses remaining after this attempt
        IF user_record.pin_uses_remaining <= 1 THEN
            UPDATE users 
            SET 
                pin_uses_remaining = 0,
                pin_locked_until = NOW() + INTERVAL '30 minutes'
            WHERE id = user_uuid;
        ELSE
            UPDATE users 
            SET pin_uses_remaining = pin_uses_remaining - 1
            WHERE id = user_uuid;
        END IF;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;