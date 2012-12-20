DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE ,
  alternateItemCode VARCHAR(20),
  manufacturer VARCHAR(100),
  manufacturerCode VARCHAR(30),
  manufacturerBarcode VARCHAR(20),
  mohBarcode VARCHAR(20),
  gtin VARCHAR(20),
  type VARCHAR(100),
  displayOrder INTEGER,
  primaryName VARCHAR(150) NOT NULL,
  fullName VARCHAR(250),
  genericName VARCHAR(100),
  alternateName VARCHAR(100),
  description VARCHAR(250),
  strength VARCHAR(14),
  formId INTEGER REFERENCES product_forms(id),
  dosageUnitId INTEGER REFERENCES dosage_unit(id),
  dispensingUnit VARCHAR(20) NOT NULL,
  dosesPerDispensingUnit SMALLINT NOT NULL,
  packSize SMALLINT NOT NULL,
  alternatePackSize SMALLINT,
  storeRefrigerated  BOOLEAN,
  storeRoomTemperature BOOLEAN,
  hazardous BOOLEAN,
  flammable BOOLEAN,
  controlledSubstance BOOLEAN,
  lightSensitive BOOLEAN,
  approvedByWho BOOLEAN,
  contraceptiveCyp NUMERIC(8,4),
  packLength NUMERIC(8,4),
  packWidth NUMERIC(8,4),
  packHeight NUMERIC(8,4),
  packWeight NUMERIC(8,4),
  packsPerCarton SMALLINT,
  cartonLength NUMERIC(8,4),
  cartonWidth NUMERIC(8,4),
  cartonHeight NUMERIC(8,4),
  cartonsPerPallet SMALLINT,
  expectedShelfLife SMALLINT,
  specialStorageInstructions TEXT,
  specialTransportInstructions TEXT,
  active BOOLEAN NOT NULL,
  fullSupply BOOLEAN NOT NULL,
  tracer BOOLEAN NOT NULL,
  roundToZero BOOLEAN NOT NULL,
  archived BOOLEAN,
  packRoundingThreshold SMALLINT NOT NULL,
  modifiedDate TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
  modifiedBy VARCHAR(50)
);
CREATE UNIQUE INDEX uc_product_code ON products(LOWER(code));
