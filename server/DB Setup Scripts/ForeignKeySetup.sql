# Execute this script in the MySQL shell: 'source E:\Github Projects\Red-Crow\server\DB Setup Scripts\ForeignKeySetup.sql'
# Or you can pipe it into MySQL if you have the environment variable setup: 'mysql < ForeignKeySetup.sql'
# You will have to execute this script everytime you want to setup the database (only needs to be ran once)

USE smsblitz;

ALTER TABLE clientsearchmessage
	ADD CONSTRAINT fk_client_message_id FOREIGN KEY (message_id) REFERENCES message(id);
	
ALTER TABLE serversearchmessage
	ADD CONSTRAINT fk_server_message_id FOREIGN KEY (message_id) REFERENCES message(id);