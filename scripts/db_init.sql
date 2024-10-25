-- CREATE DATABASE IF NOT EXISTS tgdb;
-- CREATE DATABASE IF NOT EXISTS tgbd-dev;

CREATE TABLE IF NOT EXISTS events (
  _id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(30),
  source VARCHAR(30),
  read_only BOOLEAN,
  username VARCHAR(12),
  accesskey_id VARCHAR(30),
  account_id VARCHAR(15),
  arn VARCHAR(35),
  aws_region VARCHAR(10),
  cipher_suite VARCHAR(30),
  client_provided_host_header VARCHAR(35),
  category VARCHAR(20),
  time TIMESTAMPTZ,
  type VARCHAR(20),
  version VARCHAR(8),
  is_management BOOLEAN,
  principal_id VARCHAR(25),
  recipient_account_id VARCHAR(15),
  request_id VARCHAR(36),
  source_ip VARCHAR(15),
  tls_version VARCHAR(10),
  user_identity_type VARCHAR(12),
  user_agent VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS ips (
  ip VARCHAR(15) PRIMARY KEY,
  country VARCHAR(20),
  region VARCHAR(20),
  city VARCHAR(20),
  lat NUMERIC(9, 6),
  long NUMERIC(9, 6)
);