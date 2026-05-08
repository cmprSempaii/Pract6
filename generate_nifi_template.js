const fs = require('fs');
const path = require('path');

// JS-скрипт для генерации шаблона Apache NiFi в XML.
const templateDir = path.resolve(__dirname, 'nifi');
const templatePath = path.join(templateDir, 'practic5_template.xml');

const templateXml = `<?xml version="1.0" encoding="UTF-8"?>
<template>
  <name>practic5_batch_mariadb_to_parquet</name>
  <description>Шаблон NiFi для пакетной выгрузки данных из MariaDB в Parquet.</description>
  <snippet>
    <controllerServices>
      <controllerService>
        <id>dbcp-connection-pool-1</id>
        <name>MariaDB DBCPConnectionPool</name>
        <type>org.apache.nifi.dbcp.DBCPConnectionPool</type>
        <properties>
          <property>
            <name>Database Connection URL</name>
            <value>jdbc:mariadb://mariadb:3306/practic4</value>
          </property>
          <property>
            <name>Database Driver Class Name</name>
            <value>org.mariadb.jdbc.Driver</value>
          </property>
          <property>
            <name>Database User</name>
            <value>student</value>
          </property>
          <property>
            <name>Password</name>
            <value>student</value>
          </property>
        </properties>
      </controllerService>
    </controllerServices>

    <processors>
      <processor>
        <id>proc-executesql</id>
        <name>ExecuteSQL</name>
        <type>org.apache.nifi.processors.standard.ExecuteSQL</type>
        <properties>
          <property>
            <name>Database Connection Pooling Service</name>
            <value>MariaDB DBCPConnectionPool</value>
          </property>
          <property>
            <name>SQL select query</name>
            <value>SELECT id, customer_name, product, quantity, total, order_date FROM orders;</value>
          </property>
          <property>
            <name>Output FlowFile Format</name>
            <value>Avro</value>
          </property>
        </properties>
      </processor>
      <processor>
        <id>proc-convertrecord</id>
        <name>ConvertRecord</name>
        <type>org.apache.nifi.processors.standard.ConvertRecord</type>
        <properties>
          <property>
            <name>Record Reader</name>
            <value>AvroReader</value>
          </property>
          <property>
            <name>Record Writer</name>
            <value>ParquetRecordSetWriter</value>
          </property>
        </properties>
      </processor>
      <processor>
        <id>proc-putfile</id>
        <name>PutFile</name>
        <type>org.apache.nifi.processors.standard.PutFile</type>
        <properties>
          <property>
            <name>Directory</name>
            <value>/data/parquet-output</value>
          </property>
          <property>
            <name>Conflict Resolution Strategy</name>
            <value>replace</value>
          </property>
          <property>
            <name>Create Missing Directories</name>
            <value>true</value>
          </property>
        </properties>
      </processor>
    </processors>

    <connections>
      <connection>
        <id>conn-1</id>
        <source>ExecuteSQL</source>
        <destination>ConvertRecord</destination>
        <relationship>success</relationship>
      </connection>
      <connection>
        <id>conn-2</id>
        <source>ConvertRecord</source>
        <destination>PutFile</destination>
        <relationship>success</relationship>
      </connection>
    </connections>
  </snippet>
</template>
`;

fs.mkdirSync(templateDir, { recursive: true });
fs.writeFileSync(templatePath, templateXml, 'utf8');
console.log('NiFi template saved:', templatePath);
