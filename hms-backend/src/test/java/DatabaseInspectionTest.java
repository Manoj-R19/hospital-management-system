package com.hms;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

@SpringBootTest
public class DatabaseInspectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void inspectDatabase() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            System.out.println("=== Database Inspection ===");
            System.out.println("Product Name: " + metaData.getDatabaseProductName());
            System.out.println("Product Version: " + metaData.getDatabaseProductVersion());

            try (ResultSet rs = metaData.getTables("hms_db", null, "%", new String[]{"TABLE"})) {
                while (rs.next()) {
                    String tableName = rs.getString("TABLE_NAME");
                    System.out.println("Table: " + tableName);
                    try (ResultSet cols = metaData.getColumns("hms_db", null, tableName, "%")) {
                        while (cols.next()) {
                            System.out.println("  - Column: " + cols.getString("COLUMN_NAME") + " (" + cols.getString("TYPE_NAME") + ")");
                        }
                    }
                }
            }
        }
    }
}
