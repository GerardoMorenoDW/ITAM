#!/bin/bash
chmod +x /sql/entrypoint.sh
/opt/mssql/bin/sqlservr &
sleep 15
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /sql/init.sql
wait