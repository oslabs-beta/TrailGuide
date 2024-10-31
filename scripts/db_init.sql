-- CREATE DATABASE IF NOT EXISTS tgdb;
-- CREATE DATABASE IF NOT EXISTS tgbd-dev;

CREATE TABLE IF NOT EXISTS events (
  _id VARCHAR PRIMARY KEY,
  name VARCHAR,
  source VARCHAR,
  read_only BOOLEAN,
  username VARCHAR,
  accesskey_id VARCHAR,
  account_id VARCHAR,
  arn VARCHAR,
  aws_region VARCHAR,
  cipher_suite VARCHAR,
  client_provided_host_header VARCHAR,
  category VARCHAR,
  time TIMESTAMPTZ,
  type VARCHAR,
  version VARCHAR,
  is_management BOOLEAN,
  principal_id VARCHAR,
  recipient_account_id VARCHAR,
  request_id VARCHAR,
  source_ip VARCHAR,
  tls_version VARCHAR,
  user_identity_type VARCHAR,
  user_agent VARCHAR
);

CREATE TABLE IF NOT EXISTS ips (
  ip VARCHAR(30) PRIMARY KEY,
  country VARCHAR(50),
  region VARCHAR(50),
  city VARCHAR(50),
  lat NUMERIC(9, 6),
  long NUMERIC(9, 6)
);

CREATE TABLE IF NOT EXISTS users(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      display_name VARCHAR(100),
      work_email VARCHAR(255) UNIQUE NOT NULL,
      work_phone VARCHAR(25),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      aws_access_key VARCHAR,
      aws_secret_access_key VARCHAR,
      aws_region VARCHAR
  );